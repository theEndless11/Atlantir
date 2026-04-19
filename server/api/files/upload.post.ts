import { useSupabaseAdmin } from '~/server/utils/supabase'
import { useAnthropic, AGENT_MODEL } from '~/server/utils/anthropic'

// Extract text from various file types
async function extractText(buffer: Buffer, mimeType: string, filename: string): Promise<string> {
  if (mimeType === 'text/plain' || mimeType === 'text/markdown' || filename.endsWith('.md') || filename.endsWith('.txt')) {
    return buffer.toString('utf-8')
  }

  if (mimeType === 'application/pdf') {
    // Use Anthropic to extract text from PDF via base64
    const client = useAnthropic()
    const base64 = buffer.toString('base64')
    const response = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 }
          } as any,
          { type: 'text', text: 'Extract all text content from this document. Return only the raw text, preserve structure.' }
        ]
      }]
    })
    return response.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
  }

  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // Basic docx extraction — strip XML tags
    const xml = buffer.toString('utf-8')
    const text = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    return text
  }

  return buffer.toString('utf-8')
}

// Split text into chunks for embedding
function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []
  let i = 0
  while (i < words.length) {
    chunks.push(words.slice(i, i + chunkSize).join(' '))
    i += chunkSize - overlap
  }
  return chunks.filter(c => c.trim().length > 20)
}

// Simple embedding via OpenRouter (text-embedding-ada-002)
async function embedChunks(chunks: string[]): Promise<number[][]> {
  const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/text-embedding-ada-002',
      input: chunks
    })
  })
  if (!res.ok) {
    return chunks.map(() => new Array(1536).fill(0))
  }
  const data = await res.json()
  return data.data.map((d: any) => d.embedding)
}

export default defineEventHandler(async (event) => {
  const sb = useSupabaseAdmin()

  // Parse multipart form
  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, message: 'No form data' })

  const filePart = formData.find(p => p.name === 'file')
  const workspaceId = formData.find(p => p.name === 'workspace_id')?.data.toString()
  const userId = formData.find(p => p.name === 'user_id')?.data.toString()

  if (!filePart || !workspaceId) {
    throw createError({ statusCode: 400, message: 'file and workspace_id required' })
  }

  const filename = filePart.filename || 'upload'
  const mimeType = filePart.type || 'text/plain'
  const buffer = filePart.data

  // Upload raw file to Supabase Storage
  const storagePath = `${workspaceId}/${Date.now()}_${filename}`
  const { error: storageErr } = await sb.storage
    .from('files')
    .upload(storagePath, buffer, { contentType: mimeType, upsert: false })

  if (storageErr) throw createError({ statusCode: 500, message: storageErr.message })

  // Save file record
  const { data: fileRecord, error: fileErr } = await sb.from('files').insert({
    workspace_id: workspaceId,
    uploaded_by: userId || null,
    filename,
    storage_path: storagePath,
    mime_type: mimeType,
    size_bytes: buffer.length,
  }).select().single()

  if (fileErr) throw createError({ statusCode: 500, message: fileErr.message })

  // Extract text + chunk + embed in background
  try {
    const text = await extractText(buffer, mimeType, filename)
    const chunks = chunkText(text)

    if (chunks.length > 0) {
      const embeddings = await embedChunks(chunks)

      const chunkRows = chunks.map((content, i) => ({
        file_id: fileRecord.id,
        workspace_id: workspaceId,
        content,
        embedding: JSON.stringify(embeddings[i]),
        chunk_index: i,
      }))

      await sb.from('file_chunks').insert(chunkRows)

      await sb.from('files').update({
        embedding_meta: { chunks: chunks.length, status: 'indexed' }
      }).eq('id', fileRecord.id)
    }
  } catch (err) {
    await sb.from('files').update({
      embedding_meta: { status: 'index_failed' }
    }).eq('id', fileRecord.id)
  }

  return fileRecord
})