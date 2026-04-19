import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, name, type, host, port, database, username, password,
          connectionString, useConnStr, ssl, extra } = body

  if (!workspace_id || !name) throw createError({ statusCode: 400, message: 'workspace_id and name required' })

  const sb = useSupabaseAdmin()

  const config: any = useConnStr
    ? { connectionString }
    : { host, port, database, username, password, ssl, datacenter: extra }

  const { data, error } = await sb
    .from('db_connections')
    .insert({
      workspace_id,
      name,
      db_type: type,
      status: 'untested',
      config,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return { id: data.id, name, type, status: 'untested' }
})