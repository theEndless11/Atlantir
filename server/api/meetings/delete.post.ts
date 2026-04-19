import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { meeting_id } = body
  if (!meeting_id) throw createError({ statusCode: 400, message: 'meeting_id required' })

  const sb = useSupabaseAdmin()

  // Delete messages, tasks cascade via FK, then meeting
  await sb.from('messages').delete().eq('meeting_id', meeting_id)
  await sb.from('meetings').delete().eq('id', meeting_id)

  return { success: true }
})