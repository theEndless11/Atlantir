import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  if (!id) throw createError({ statusCode: 400, message: 'id required' })

  const sb = useSupabaseAdmin()

  // Only allow cancelling pending ones
  const { error } = await sb
    .from('scheduled_bots')
    .delete()
    .eq('id', id)
    .eq('status', 'pending')

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { deleted: true }
})
