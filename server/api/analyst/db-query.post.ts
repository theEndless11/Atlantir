import { useSupabaseAdmin } from '~/server/utils/supabase'
import { parseCassandraUrl } from '~/server/utils/cassandra-parse'

type QueryKind = 'read' | 'write' | 'ddl'

function classifyQuery(sql: string): QueryKind {
  const s = sql.trim().toLowerCase()
  if (/^(select|show|describe|explain|with\s)/i.test(s)) return 'read'
  if (/^(insert|update|delete|merge|replace|upsert)/i.test(s)) return 'write'
  return 'ddl' // alter, create, drop, truncate, etc.
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { connection_id, sql, limit = 500, allow_write = false } = body

  if (!connection_id || !sql?.trim()) {
    throw createError({ statusCode: 400, message: 'connection_id and sql required' })
  }

  const queryKind = classifyQuery(sql)

  // Writes and DDL both require explicit confirmation flag
  if ((queryKind === 'write' || queryKind === 'ddl') && !allow_write) {
    throw createError({
      statusCode: 403,
      message: 'WRITE_CONFIRMATION_REQUIRED',
      data: { code: 'WRITE_CONFIRMATION_REQUIRED', query_type: queryKind, sql }
    })
  }

  const sb = useSupabaseAdmin()
  const { data: conn } = await sb.from('db_connections').select('*').eq('id', connection_id).single()
  if (!conn) throw createError({ statusCode: 404, message: 'Connection not found' })

  const cfg = conn.config
  const type = conn.db_type
  const start = Date.now()

  try {
    let columns: string[] = []
    let rows: any[] = []
    let affectedRows: number | undefined
    let isDdl = false

    if (type === 'postgres' || type === 'supabase') {
      const { Client } = await import('pg')
      const client = new Client(cfg.connectionString ? cfg.connectionString : {
        host: cfg.host || 'localhost', port: parseInt(cfg.port || '5432'),
        database: cfg.database || undefined, user: cfg.username || undefined,
        password: cfg.password || undefined, connectionTimeoutMillis: 12000,
        ssl: cfg.ssl ? { rejectUnauthorized: false } : undefined
      })
      await client.connect()
      const res = await client.query(sql)
      await client.end()
      if (queryKind === 'read' && res.fields?.length) {
        columns = res.fields.map((f: any) => f.name)
        rows = res.rows.slice(0, limit)
      } else {
        isDdl = queryKind === 'ddl'
        affectedRows = res.rowCount || 0
        columns = ['result']
        rows = [{ result: isDdl ? 'Schema change applied successfully' : `${affectedRows} row(s) affected` }]
      }
    }

    else if (type === 'mysql' || type === 'mariadb' || type === 'planetscale') {
      const mysql = await import('mysql2/promise')
      const c = await mysql.createConnection(cfg.connectionString ? cfg.connectionString : {
        host: cfg.host || 'localhost', port: parseInt(cfg.port || '3306'),
        database: cfg.database, user: cfg.username, password: cfg.password, connectTimeout: 12000
      })
      const [result, fields]: any = await c.query(sql)
      await c.end()
      if (queryKind === 'read' && Array.isArray(result) && fields?.length) {
        columns = (fields as any[]).map((f: any) => f.name)
        rows = (result as any[]).slice(0, limit)
      } else {
        isDdl = queryKind === 'ddl'
        affectedRows = (result as any).affectedRows ?? 0
        columns = ['result']
        rows = [{ result: isDdl ? 'Schema change applied successfully' : `${affectedRows} row(s) affected` }]
      }
    }

    else if (type === 'cassandra' || type === 'scylla') {
      const cassandra = await import('cassandra-driver')
      const opts = cfg.connectionString
        ? parseCassandraUrl(cfg.connectionString)
        : (() => {
            const o: any = {
              contactPoints: (cfg.host || 'localhost').split(',').map((s: string) => s.trim()),
              localDataCenter: cfg.datacenter || 'datacenter1',
              socketOptions: { connectTimeout: 12000 }
            }
            if (cfg.database) o.keyspace = cfg.database
            if (cfg.username) o.credentials = { username: cfg.username, password: cfg.password || '' }
            if (cfg.port) o.protocolOptions = { port: parseInt(cfg.port) }
            return o
          })()
      const client = new cassandra.Client(opts)
      await client.connect()
      const res = await client.execute(sql, [], { prepare: false, fetchSize: limit })
      await client.shutdown()
      if (res.columns?.length) {
        columns = res.columns.map((c: any) => c.name)
        rows = res.rows.map((r: any) => {
          const obj: any = {}
          columns.forEach(c => { obj[c] = r[c] })
          return obj
        }).slice(0, limit)
      } else {
        isDdl = queryKind === 'ddl'
        columns = ['result']
        rows = [{ result: isDdl ? 'Schema change applied successfully' : 'Operation completed' }]
      }
    }

    else {
      throw new Error(`Query execution is not supported for database type "${type}" yet.`)
    }

    return {
      columns,
      rows,
      count: rows.length,
      affected_rows: affectedRows,
      query_type: queryKind,
      is_ddl: isDdl,
      time: Date.now() - start,
      truncated: queryKind === 'read' && rows.length === limit
    }

  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 400, message: err.message || 'Query failed' })
  }
})