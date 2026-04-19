import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, connection_id } = body
  if (!workspace_id) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()
  let q = sb.from('analyst_chats').delete().eq('workspace_id', workspace_id)
  if (connection_id) q = q.eq('connection_id', connection_id)
  else q = q.is('connection_id', null)
  await q
  return { success: true }
})