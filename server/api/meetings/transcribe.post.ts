import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, message: 'No form data' })

  const filePart = formData.find(p => p.name === 'file')
  const workspaceId = formData.find(p => p.name === 'workspace_id')?.data.toString()
  const title = formData.find(p => p.name === 'title')?.data.toString() || 'Uploaded recording'
  const createdBy = formData.find(p => p.name === 'user_id')?.data.toString()

  if (!filePart || !workspaceId) {
    throw createError({ statusCode: 400, message: 'file and workspace_id required' })
  }

  const mimeType = filePart.type || 'audio/mpeg'

  // Send to Deepgram pre-recorded API
  const dgKey = process.env.DEEPGRAM_API_KEY
  if (!dgKey) throw createError({ statusCode: 500, message: 'Deepgram API key not configured' })

  const dgRes = await fetch(
    'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true&paragraphs=true',
    {
      method: 'POST',
      headers: {
        'Authorization': `Token ${dgKey}`,
        'Content-Type': mimeType,
      },
      body: filePart.data
    }
  )

  if (!dgRes.ok) {
    const err = await dgRes.text()
    throw createError({ statusCode: 500, message: `Deepgram error: ${err}` })
  }

  const dgData = await dgRes.json()
  const transcript = dgData?.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''

  if (!transcript) throw createError({ statusCode: 422, message: 'No speech detected in file' })

  // Save as a meeting record
  const sb = useSupabaseAdmin()
  const { data: meeting, error } = await sb
    .from('meetings')
    .insert({
      workspace_id: workspaceId,
      created_by: createdBy || null,
      title,
      status: 'ended',
      transcript,
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { meeting, transcript }
})