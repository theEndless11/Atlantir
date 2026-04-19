import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { workspace_id } = getQuery(event)
  if (!workspace_id) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()

  const { data, error } = await sb
    .from('scheduled_bots')
    .select('*')
    .eq('workspace_id', workspace_id as string)
    .order('scheduled_at', { ascending: true })

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
