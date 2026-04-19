import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, user_id, email, full_name } = body

  if (!token || !user_id) throw createError({ statusCode: 400, message: 'token and user_id required' })

  const sb = useSupabaseAdmin()

  // Find workspace by token
  const { data: workspace } = await sb
    .from('workspaces')
    .select('id, name, invite_enabled')
    .eq('invite_token', token)
    .single()

  if (!workspace) throw createError({ statusCode: 404, message: 'Invalid or expired invite link' })
  if (!workspace.invite_enabled) throw createError({ statusCode: 403, message: 'Invite link has been disabled' })

  // Check if already a member
  const { data: existing } = await sb
    .from('workspace_members')
    .select('id, role')
    .eq('workspace_id', workspace.id)
    .eq('user_id', user_id)
    .single()

  if (existing) {
    return { workspace_id: workspace.id, workspace_name: workspace.name, already_member: true, role: existing.role }
  }

  // Upsert user profile
  await sb.from('users').upsert({ id: user_id, email, full_name: full_name || null })

  // Add as member
  await sb.from('workspace_members').insert({
    workspace_id: workspace.id,
    user_id,
    role: 'member'
  })

  return { workspace_id: workspace.id, workspace_name: workspace.name, already_member: false, role: 'member' }
})