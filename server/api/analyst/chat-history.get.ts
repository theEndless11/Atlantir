import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { workspace_id, connection_id } = query
  if (!workspace_id) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()
  let q = sb
    .from('analyst_chats')
    .select('id, role, content, user_id, metadata, created_at, users(full_name, email)')
    .eq('workspace_id', workspace_id as string)
    .order('created_at', { ascending: true })
    .limit(200)

  if (connection_id) {
    q = q.eq('connection_id', connection_id as string)
  } else {
    q = q.is('connection_id', null)
  }

  const { data } = await q
  return data || []
})