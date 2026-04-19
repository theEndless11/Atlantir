import { useAnthropic, AGENT_MODEL } from '~/server/utils/anthropic'
import { useSupabaseAdmin } from '~/server/utils/supabase'

async function getWorkspaceContext(workspaceId: string): Promise<string> {
  const sb = useSupabaseAdmin()

  const [intResult, fileResult, taskResult, dbResult] = await Promise.all([
    sb.from('integrations').select('type, config').eq('workspace_id', workspaceId).eq('status', 'connected'),
    sb.from('file_chunks').select('content').eq('workspace_id', workspaceId).limit(20),
    sb.from('tasks').select('title, status').eq('workspace_id', workspaceId)
      .in('status', ['pending_approval', 'in_progress']).limit(5),
    sb.from('db_connections').select('name, db_type, status, config').eq('workspace_id', workspaceId)
  ])

  const integrations = (intResult.data || []).map((i: any) => i.type).join(', ')
  const files = (fileResult.data || []).map((f: any) => f.content).join('\n\n').slice(0, 2000)
  const tasks = (taskResult.data || []).map((t: any) => `${t.title} (${t.status})`).join(', ')
  const databases = (dbResult.data || []).map((d: any) => {
    const tables = d.config?.tables?.join(', ') || ''
    return `${d.name} (${d.db_type}, ${d.status})${tables ? ' — tables: ' + tables : ''}`
  }).join('; ')

  let ctx = ''
  if (integrations) ctx += `\nConnected integrations: ${integrations}`
  if (databases)    ctx += `\nConnected databases: ${databases}`
  if (tasks)        ctx += `\nActive tasks: ${tasks}`
  if (files)        ctx += `\n\nCompany knowledge:\n${files}`
  return ctx
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, message, history } = body

  if (!workspace_id || !message) throw createError({ statusCode: 400, message: 'workspace_id and message required' })

  const context = await getWorkspaceContext(workspace_id)
  const client  = useAnthropic()

  const systemPrompt = `You are an AI workspace assistant for Atlantir. You help users get work done through natural conversation.
${context}

You have full access to the workspace. You can:
- Create and manage tasks by explaining what you'll do
- Answer questions about company knowledge and RAG documents
- List and describe connected integrations (Slack, Gmail, GitHub, Google Calendar, Notion, Zapier etc.)
- List and query connected databases (the databases listed above ARE accessible — do not say you cannot access them)
- Help think through problems, draft content, analyze data
- Schedule meetings and calendar events

IMPORTANT: If databases are listed above, you DO have access to them through the analyst module. Tell users to use the Analyst tab to query them, or confirm you can see them.
IMPORTANT: If integrations are listed, confirm you can use them for tasks.

Keep responses SHORT and CONVERSATIONAL — 1-3 sentences max for voice. You are speaking out loud.
No markdown, no bullet points, no formatting — plain spoken language only.
Sound natural, helpful, and confident. Get to the point immediately.`

  const messages = [
    ...(history || []).slice(-6),
    { role: 'user', content: message }
  ]

  const response = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: 300,
    system: systemPrompt,
    messages
  })

  const reply = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('').trim()
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/- /g, '')

  return { reply }
})
