import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { file_id } = body
  if (!file_id) throw createError({ statusCode: 400, message: 'file_id required' })

  const sb = useSupabaseAdmin()

  const { data: file } = await sb.from('files').select('storage_path').eq('id', file_id).single()
  if (file) await sb.storage.from('files').remove([file.storage_path])

  await sb.from('file_chunks').delete().eq('file_id', file_id)
  await sb.from('files').delete().eq('id', file_id)

  return { success: true }
})