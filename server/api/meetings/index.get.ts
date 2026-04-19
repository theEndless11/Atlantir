import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const workspaceId = query.workspace_id as string
  if (!workspaceId) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()
  const { data, error } = await sb
    .from('meetings')
    .select('id, title, status, transcript, started_at, ended_at, created_at, source, bot_session_id, bot_platform, bot_transcript')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})