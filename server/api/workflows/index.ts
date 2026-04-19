import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const sb = useSupabaseAdmin()

  if (method === 'GET') {
    const query = getQuery(event)
    const { data } = await sb
      .from('workflows')
      .select('*')
      .eq('workspace_id', query.workspace_id)
      .order('created_at', { ascending: false })
    return data || []
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { data, error } = await sb
      .from('workflows')
      .insert(body)
      .select()
      .single()
    if (error) throw createError({ statusCode: 500, message: error.message })
    return data
  }

  if (method === 'PATCH') {
    const body = await readBody(event)
    const { id, ...updates } = body
    const { data, error } = await sb
      .from('workflows')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw createError({ statusCode: 500, message: error.message })
    return data
  }

  if (method === 'DELETE') {
    const body = await readBody(event)
    await sb.from('workflows').delete().eq('id', body.id)
    return { success: true }
  }
})