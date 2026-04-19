import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { workflow_id, limit = 5 } = query

  if (!workflow_id) throw createError({ statusCode: 400, message: 'workflow_id required' })

  const sb = useSupabaseAdmin()
  const { data } = await sb
    .from('workflow_runs')
    .select('*')
    .eq('workflow_id', workflow_id)
    .order('created_at', { ascending: false })
    .limit(Number(limit))

  return data || []
})