import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const workspaceId = query.workspace_id as string
  if (!workspaceId) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()
  const { data, error } = await sb
    .from('db_connections')
    .select('id, name, db_type, status, config')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, message: error.message })
  return (data || []).map(d => ({
    id: d.id,
    name: d.name,
    type: d.db_type,
    status: d.status,
    tables: d.config?.tables || []
  }))
})