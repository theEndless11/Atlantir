import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = query.token as string
  if (!token) throw createError({ statusCode: 400, message: 'token required' })

  const sb = useSupabaseAdmin()
  const { data } = await sb
    .from('workspaces')
    .select('id, name, invite_enabled')
    .eq('invite_token', token)
    .single()

  if (!data) throw createError({ statusCode: 404, message: 'Invalid invite link' })
  if (!data.invite_enabled) throw createError({ statusCode: 403, message: 'This invite link has been disabled' })

  // Return member count without exposing sensitive data
  const { count } = await sb
    .from('workspace_members')
    .select('*', { count: 'exact', head: true })
    .eq('workspace_id', data.id)

  return { id: data.id, name: data.name, member_count: count || 0 }
})