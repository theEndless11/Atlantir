import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, type } = body
  if (!workspace_id || !type) throw createError({ statusCode: 400, message: 'workspace_id and type required' })

  const sb = useSupabaseAdmin()
  await sb.from('integrations')
    .update({ status: 'disconnected', config: {} })
    .eq('workspace_id', workspace_id)
    .eq('type', type)

  return { success: true }
})