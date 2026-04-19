import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // Support both `id` (sent by frontend) and `connection_id` (legacy)
  const id = body.id || body.connection_id
  if (!id) throw createError({ statusCode: 400, message: 'id required' })
  const sb = useSupabaseAdmin()
  const { error } = await sb.from('db_connections').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, message: error.message })
  return { success: true }
})
