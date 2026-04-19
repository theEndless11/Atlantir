import { useSupabaseAdmin } from '~/server/utils/supabase'
export default defineEventHandler(async (event) => {
  const { meeting_id, title } = await readBody(event)
  if (!meeting_id || !title) throw createError({ statusCode: 400, message: 'meeting_id and title required' })
  const sb = useSupabaseAdmin()
  await sb.from('meetings').update({ title }).eq('id', meeting_id)
  return { ok: true }
})
