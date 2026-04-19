import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, connection_id, role, content, user_id, metadata } = body
  if (!workspace_id || !role || !content) throw createError({ statusCode: 400, message: 'workspace_id, role, content required' })

  const sb = useSupabaseAdmin()
  const { data, error } = await sb.from('analyst_chats').insert({
    workspace_id,
    connection_id: connection_id || null,
    role,
    content,
    user_id: user_id || null,
    metadata: metadata || {}
  }).select('id, created_at').single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})