import { useSupabaseAdmin } from '~/server/utils/supabase'
import { parseCassandraUrl } from '~/server/utils/cassandra-parse'

export default defineEventHandler(async (event) => {
  // Support both GET (query params) and POST (body)
  let connection_id: string | undefined
  let workspace_id: string | undefined
  if (event.method === 'GET') {
    const query = getQuery(event)
    connection_id = query.connection_id as string
    workspace_id = query.workspace_id as string
  } else {
    const body = await readBody(event)
    connection_id = body.connection_id
    workspace_id = body.workspace_id
  }

  if (!connection_id) throw createError({ statusCode: 400, message: 'connection_id required' })

  const sb = useSupabaseAdmin()
  const { data: conn } = await sb
    .from('db_connections')
    .select('*')
    .eq('id', connection_id)
    .single()

  if (!conn) throw createError({ statusCode: 404, message: 'Connection not found' })

  const cfg = conn.config
  const type = conn.db_type

  try {
    let tables: string[] = []
    let preview: Record<string, any>[] = []
    let columns: string[] = []
    let rowCounts: Record<string, number> = {}

    if (type === 'postgres' || type === 'supabase') {
      const { Client } = await import('pg')
      const client = new Client(cfg.connectionString ? cfg.connectionString : {
        host: cfg.host || 'localhost', port: parseInt(cfg.port || '5432'),
        database: cfg.database || undefined, user: cfg.username || undefined,
        password: cfg.password || undefined,
        connectionTimeoutMillis: 8000,
        ssl: cfg.ssl ? { rejectUnauthorized: false } : undefined
      })
      await client.connect()

      const tRes = await client.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        ORDER BY table_name LIMIT 50`)
      tables = tRes.rows.map(r => r.table_name)

      for (const t of tables.slice(0, 10)) {
        try {
          const r = await client.query(`SELECT COUNT(*) FROM "${t}"`)
          rowCounts[t] = parseInt(r.rows[0].count)
        } catch {}
      }

      if (tables.length) {
        const pRes = await client.query(`SELECT * FROM "${tables[0]}" LIMIT 10`)
        preview = pRes.rows
        columns = pRes.fields.map(f => f.name)
      }
      await client.end()
    }

    else if (type === 'mysql' || type === 'mariadb' || type === 'planetscale') {
      const mysql = await import('mysql2/promise')
      const conn2 = await mysql.createConnection(cfg.connectionString ? cfg.connectionString : {
        host: cfg.host || 'localhost', port: parseInt(cfg.port || '3306'),
        database: cfg.database, user: cfg.username, password: cfg.password,
        connectTimeout: 8000,
        ssl: cfg.ssl ? { rejectUnauthorized: false } : undefined
      })
      const [tRows]: any = await conn2.query('SHOW TABLES')
      tables = tRows.map((r: any) => Object.values(r)[0] as string)

      for (const t of tables.slice(0, 10)) {
        try {
          const [r]: any = await conn2.query('SELECT COUNT(*) as cnt FROM `' + t + '`')
          rowCounts[t] = r[0].cnt
        } catch {}
      }

      if (tables.length) {
        const [pRows, pFields]: any = await conn2.query('SELECT * FROM `' + tables[0] + '` LIMIT 10')
        preview = pRows
        columns = (pFields as any[]).map(f => f.name)
      }
      await conn2.end()
    }

    else if (type === 'cassandra' || type === 'scylla') {
      const cassandra = await import('cassandra-driver')

      let opts: any
      if (cfg.connectionString) {
        opts = parseCassandraUrl(cfg.connectionString)
      } else {
        const contactPoints = (cfg.host || 'localhost').split(',').map((s: string) => s.trim())
        opts = {
          contactPoints,
          localDataCenter: cfg.datacenter || 'datacenter1',
          socketOptions: { connectTimeout: 8000 }
        }
        if (cfg.database) opts.keyspace = cfg.database
        if (cfg.username) opts.credentials = { username: cfg.username, password: cfg.password || '' }
        if (cfg.port) opts.protocolOptions = { port: parseInt(cfg.port) }
      }

      const client = new cassandra.Client(opts)
      await client.connect()

      const keyspace = opts.keyspace || client.keyspace
      if (keyspace) {
        const tRes = await client.execute(
          'SELECT table_name FROM system_schema.tables WHERE keyspace_name = ?', [keyspace])
        tables = tRes.rows.map(r => r.table_name)

        if (tables.length) {
          try {
            const pRes = await client.execute(
              'SELECT * FROM ' + keyspace + '.' + tables[0] + ' LIMIT 10')
            preview = pRes.rows.map(r => {
              const obj: any = {}
              pRes.columns?.forEach(c => { obj[c.name] = r[c.name] })
              return obj
            })
            columns = pRes.columns?.map(c => c.name) || []
          } catch {}
        }
      } else {
        // No keyspace specified - list all keyspaces instead
        const ksRes = await client.execute(
          'SELECT keyspace_name FROM system_schema.keyspaces')
        tables = ksRes.rows.map(r => r.keyspace_name).filter(k =>
          !['system', 'system_auth', 'system_distributed', 'system_schema', 'system_traces'].includes(k))
      }

      await client.shutdown()
    }

    else {
      throw new Error('Introspection not yet supported for ' + type)
    }

    await sb.from('db_connections')
      .update({ status: 'connected', config: { ...cfg, tables }, updated_at: new Date().toISOString() })
      .eq('id', connection_id)

    return { tables, preview, columns, rowCounts, status: 'connected' }

  } catch (err: any) {
    await sb.from('db_connections').update({ status: 'error' }).eq('id', connection_id)
    throw createError({ statusCode: 400, message: err.message || 'Failed to connect' })
  }
})