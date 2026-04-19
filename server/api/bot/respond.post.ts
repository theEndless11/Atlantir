import { useAnthropic, AGENT_MODEL } from '~/server/utils/anthropic'
import { useSupabaseAdmin } from '~/server/utils/supabase'

// ── Vector cosine similarity (runs in-process, no pgvector needed) ───────────
function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2 }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0
}

// ── Embed a query string via OpenRouter (same model used at upload time) ──────
async function embedQuery(text: string): Promise<number[] | null> {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'openai/text-embedding-ada-002', input: [text] }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.data?.[0]?.embedding ?? null
  } catch {
    return null
  }
}

export default defineEventHandler(async (event) => {
  const secret = getHeader(event, 'x-bot-secret')
  if (secret !== process.env.BOT_SECRET) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { transcript, workspace_id, instructions: sessionInstructions } = body
  if (!transcript || !workspace_id) {
    throw createError({ statusCode: 400, message: 'transcript and workspace_id required' })
  }

  const sb = useSupabaseAdmin()

  // ── 1. Load workspace + bot settings ──────────────────────────────────────
  const { data: workspace } = await sb
    .from('workspaces')
    .select('name, description, bot_name, bot_instructions, bot_response_mode')
    .eq('id', workspace_id)
    .single()

  const workspaceName    = workspace?.name || 'this workspace'
  const botInstructions  = workspace?.bot_instructions?.trim() || ''
  const workspaceDesc    = workspace?.description?.trim() || ''

  // ── 2. RAG — vector similarity over file_chunks ───────────────────────────
  let ragContext = ''
  const queryVec = await embedQuery(transcript)

  if (queryVec) {
    // Fetch all chunks with stored embeddings for this workspace
    const { data: chunks } = await sb
      .from('file_chunks')
      .select('content, embedding')
      .eq('workspace_id', workspace_id)
      .not('embedding', 'is', null)
      .limit(200)  // cap for safety

    if (chunks?.length) {
      const scored = chunks
        .map((c: any) => {
          let vec: number[]
          try { vec = typeof c.embedding === 'string' ? JSON.parse(c.embedding) : c.embedding }
          catch { return null }
          return { content: c.content, score: cosine(queryVec, vec) }
        })
        .filter((c: any): c is { content: string; score: number } => c !== null && c.score > 0.72)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)

      if (scored.length) {
        ragContext = `\n\nRelevant workspace knowledge (retrieved by semantic search):\n${
          scored.map((c, i) => `[${i + 1}] ${c.content}`).join('\n---\n')
        }`
      }
    }
  }

  // Fallback to keyword scoring if no embeddings exist yet
  if (!ragContext) {
    const keywords = transcript
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 4)
      .slice(0, 8)

    if (keywords.length) {
      const { data: chunks } = await sb
        .from('file_chunks')
        .select('content')
        .eq('workspace_id', workspace_id)
        .limit(80)

      if (chunks?.length) {
        const scored = chunks
          .map((c: any) => ({
            content: c.content,
            score: keywords.filter((k: string) => c.content.toLowerCase().includes(k)).length,
          }))
          .filter((c: any) => c.score > 0)
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 3)

        if (scored.length) {
          ragContext = `\n\nRelevant workspace knowledge:\n${scored.map((c: any) => c.content).join('\n---\n')}`
        }
      }
    }
  }

  // ── 3. Active integrations ────────────────────────────────────────────────
  let integrationsCtx = ''
  const { data: integrations } = await sb
    .from('integrations')
    .select('name, type')
    .eq('workspace_id', workspace_id)
    .eq('enabled', true)
    .limit(10)
  if (integrations?.length) {
    integrationsCtx = `\nConnected tools: ${integrations.map((i: any) => i.name || i.type).join(', ')}.`
  }

  // Per-session instructions override workspace default; fall back to workspace setting
  const effectiveInstructions = (sessionInstructions?.trim()) || botInstructions

  // ── 4. Build system prompt ────────────────────────────────────────────────
  const systemParts = [
    effectiveInstructions
      ? effectiveInstructions
      : `You are an AI assistant named ${workspace?.bot_name || 'Atlantir'}, embedded live in a meeting call for the workspace "${workspaceName}".`,

    // Workspace context
    workspaceDesc && !botInstructions ? `Workspace: ${workspaceDesc}` : '',
    integrationsCtx,

    // Voice response rules — always appended
    `\nYou are speaking aloud via text-to-speech. Rules:`,
    `- Maximum 2–3 sentences. No markdown, no lists, no formatting.`,
    `- Natural spoken language only. Be direct and concise.`,
    `- Use knowledge from the workspace when relevant.`,
    `- If you don't know something, say so briefly in one sentence.`,

    // Knowledge
    ragContext,
  ].filter(Boolean).join('\n')

  // ── 5. Call Claude ────────────────────────────────────────────────────────
  const client = useAnthropic()
  const response = await client.messages.create({
    model:      AGENT_MODEL,
    max_tokens: 200,
    system:     systemParts,
    messages:   [{ role: 'user', content: transcript }],
  })

  const text = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('')
    .trim()

  return { response: text }
})
