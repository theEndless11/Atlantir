import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { task_id, assigned_agent, approved_by } = body

  if (!task_id) throw createError({ statusCode: 400, message: 'task_id required' })

  const sb = useSupabaseAdmin()

  const { data, error } = await sb
    .from('tasks')
    .update({
      status: 'approved',
      assigned_agent,
      approved_by,
      approved_at: new Date().toISOString()
    })
    .eq('id', task_id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  return data
})
