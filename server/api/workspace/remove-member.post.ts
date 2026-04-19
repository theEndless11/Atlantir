import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, user_id, requester_id } = body

  if (!workspace_id || !user_id) {
    throw createError({ statusCode: 400, message: 'workspace_id and user_id required' })
  }

  const sb = useSupabaseAdmin()

  // Prevent removing the owner
  const { data: workspace } = await sb
    .from('workspaces')
    .select('owner_id')
    .eq('id', workspace_id)
    .single()

  if (workspace?.owner_id === user_id) {
    throw createError({ statusCode: 403, message: 'Cannot remove the workspace owner' })
  }

  const { error } = await sb
    .from('workspace_members')
    .delete()
    .eq('workspace_id', workspace_id)
    .eq('user_id', user_id)

  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})