import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, title, created_by, source } = body

  if (!workspace_id) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()

  const insertPayload: Record<string, any> = {
    workspace_id,
    title:      title || `Meeting ${new Date().toLocaleDateString()}`,
    created_by,
    status:     'live',
    started_at: new Date().toISOString(),
  }
  if (source) insertPayload.source = source

  const { data, error } = await sb
    .from('meetings')
    .insert(insertPayload)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
