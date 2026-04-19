import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, email, role = 'member', invited_by } = body

  if (!workspace_id || !email) {
    throw createError({ statusCode: 400, message: 'workspace_id and email required' })
  }

  const sb = useSupabaseAdmin()

  // Check workspace exists and inviter is owner/member
  const { data: workspace } = await sb
    .from('workspaces')
    .select('name')
    .eq('id', workspace_id)
    .single()

  if (!workspace) throw createError({ statusCode: 404, message: 'Workspace not found' })

  // Check if user already exists
  const { data: existingUser } = await sb
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    // Check if already a member
    const { data: existing } = await sb
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', workspace_id)
      .eq('user_id', existingUser.id)
      .single()

    if (existing) throw createError({ statusCode: 409, message: 'User is already a member' })

    // Add directly
    await sb.from('workspace_members').insert({
      workspace_id,
      user_id: existingUser.id,
      role
    })

    return { status: 'added', message: `${email} added to workspace` }
  }

  // User doesn't exist — send invite via Supabase auth
  const { error } = await sb.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/auth/callback`,
    data: {
      invited_to_workspace: workspace_id,
      invited_role: role,
      workspace_name: workspace.name
    }
  })

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { status: 'invited', message: `Invite sent to ${email}` }
})