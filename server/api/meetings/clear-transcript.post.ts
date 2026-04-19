import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { meeting_id } = body
  if (!meeting_id) throw createError({ statusCode: 400, message: 'meeting_id required' })

  const sb = useSupabaseAdmin()
  await sb.from('meetings').update({ transcript: null }).eq('id', meeting_id)

  return { success: true }
})