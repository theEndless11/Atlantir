import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const workspaceId = query.workspace_id as string
  if (!workspaceId) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()
  const { data, error } = await sb
    .from('workspace_members')
    .select('*, user:users(id, email, full_name, avatar_url)')
    .eq('workspace_id', workspaceId)
    .order('role')

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})