import { useAnthropic, AGENT_MODEL } from '~/server/utils/anthropic'
import { useSupabaseAdmin } from '~/server/utils/supabase'
import { parseCassandraUrl } from '~/server/utils/cassandra-parse'

async function getConn(connectionId: string) {
  const sb = useSupabaseAdmin()
  const { data } = await sb.from('db_connections').select('*').eq('id', connectionId).single()
  return data
}

// ─── Per-engine execution ──────────────────────────────────────────────────────

async function execQuery(
  cfg: any,
  type: string,
  sql: string,
  fetchSize = 100
): Promise<{ columns: string[]; rows: any[]; affected?: number; ddl?: boolean }> {
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
    if (res.fields?.length) return { columns: res.fields.map((f: any) => f.name), rows: res.rows.slice(0, fetchSize) }
    return { columns: ['result'], rows: [{ result: 'ok' }], affected: res.rowCount || 0, ddl: true }
  }

  if (type === 'mysql' || type === 'mariadb' || type === 'planetscale') {
    const mysql = await import('mysql2/promise')
    const c = await mysql.createConnection(cfg.connectionString ? cfg.connectionString : {
      host: cfg.host || 'localhost', port: parseInt(cfg.port || '3306'),
      database: cfg.database, user: cfg.username, password: cfg.password, connectTimeout: 12000
    })
    const [rows, fields]: any = await c.query(sql)
    await c.end()
    if (Array.isArray(rows) && fields?.length) return { columns: (fields as any[]).map((f: any) => f.name), rows: (rows as any[]).slice(0, fetchSize) }
    return { columns: ['affected_rows'], rows: [{ affected_rows: (rows as any).affectedRows ?? 0 }], affected: (rows as any).affectedRows ?? 0, ddl: true }
  }

  if (type === 'cassandra' || type === 'scylla') {
    const cassandra = await import('cassandra-driver')
    const opts = cfg.connectionString ? parseCassandraUrl(cfg.connectionString) : (() => {
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
    // For DDL/write operations in Cassandra, execute returns ResultSet with no rows
    const res = await client.execute(sql, [], { prepare: false, fetchSize })
    const columns = res.columns?.map((c: any) => c.name) || []
    if (!columns.length) {
      // DDL or write with no result set
      await client.shutdown()
      return { columns: ['result'], rows: [{ result: 'ok' }], ddl: true }
    }
    const rows = res.rows.map((r: any) => {
      const obj: any = {}
      columns.forEach(c => { obj[c] = r[c] })
      return obj
    })
    await client.shutdown()
    return { columns, rows }
  }

  throw new Error('Unsupported database type: ' + type)
}

// ─── Dialect-aware SQL syntax guidance ────────────────────────────────────────

function dialectGuide(type: string): string {
  switch (type) {
    case 'cassandra':
    case 'scylla':
      return `CRITICAL - You are connected to a CASSANDRA / CQL database. You MUST use CQL syntax, NOT SQL syntax.

CQL rules you must always follow:
- Adding a column: ALTER TABLE tablename ADD columnname datatype  (NO "COLUMN" keyword — CQL does not have it)
- Column types in CQL: text, int, bigint, boolean, float, double, uuid, timestamp, list<text>, map<text,text>, set<text>
- No JOINS in CQL — Cassandra does not support joins
- No subqueries
- SELECT always needs LIMIT unless querying by full primary key
- Primary key must be included in WHERE clauses for UPDATE/DELETE
- No transactions
- To list tables: SELECT table_name FROM system_schema.tables WHERE keyspace_name='yourkeyspace'
- To describe a table: SELECT * FROM system_schema.columns WHERE table_name='yourtable' AND keyspace_name='yourkeyspace'

WRONG (SQL): ALTER TABLE users ADD COLUMN groups TEXT
CORRECT (CQL): ALTER TABLE users ADD groups text

WRONG (SQL): SELECT * FROM users JOIN orders ON users.id = orders.user_id
CORRECT (CQL): Not possible — query each table separately

Always generate valid CQL. If the user asks something impossible in CQL, tell them clearly instead of generating wrong syntax.`

    case 'mysql':
    case 'mariadb':
    case 'planetscale':
      return `You are connected to a MYSQL database. Use MySQL syntax.
- String type: VARCHAR(255) or TEXT
- Adding column: ALTER TABLE tablename ADD COLUMN columnname datatype
- Auto-increment: INT AUTO_INCREMENT PRIMARY KEY
- Use backticks for identifiers if needed`

    case 'postgres':
    case 'supabase':
    default:
      return `You are connected to a POSTGRESQL database. Use PostgreSQL syntax.
- String type: TEXT or VARCHAR
- Adding column: ALTER TABLE tablename ADD COLUMN columnname datatype
- UUID: gen_random_uuid() or uuid_generate_v4()
- JSON: JSONB type recommended`
  }
}

// ─── Format query results as markdown table ────────────────────────────────────

function fmtTable(result: { columns: string[]; rows: any[] }): string {
  if (!result.rows.length) return '_(0 rows)_'
  const header = '| ' + result.columns.join(' | ') + ' |'
  const sep = '| ' + result.columns.map(() => '---').join(' | ') + ' |'
  const rows = result.rows.slice(0, 40).map(r =>
    '| ' + result.columns.map(c => String(r[c] ?? '')).join(' | ') + ' |'
  )
  return [header, sep, ...rows].join('\n') +
    (result.rows.length > 40 ? `\n_(showing 40 of ${result.rows.length} rows)_` : '')
}

// ─── Main handler ──────────────────────────────────────────────────────────────

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    message, history, data_context, connection_id,
    db_tables, db_name, db_type, insights_context,
    workspace_id, confirm_write, pending_sql
  } = body

  const aiClient = useAnthropic()
  let conn: any = null
  let connCfg: any = null
  let connType = db_type

  if (connection_id) {
    conn = await getConn(connection_id)
    if (conn) { connCfg = conn.config; connType = conn.db_type }
  }

  // ── Handle confirmed write/DDL ──────────────────────────────────────────────
  if (confirm_write && pending_sql && connCfg) {
    try {
      const result = await execQuery(connCfg, connType, pending_sql)
      let reply: string
      if (result.ddl) {
        reply = `Done. The operation completed successfully.\n\nIf this was a schema change (ALTER TABLE, CREATE, etc.), you may need to refresh the table list to see it.`
      } else if (result.affected !== undefined) {
        reply = `Done. **${result.affected} row(s) affected.**`
      } else {
        reply = `Done.\n\n${fmtTable(result)}`
      }
      return { reply, executed_sql: pending_sql }
    } catch (err: any) {
      return {
        reply: `The operation failed with this error:\n\n\`\`\`\n${err.message}\n\`\`\`\n\nThis may mean the syntax is wrong for this database engine or you lack permissions.`,
        error: true
      }
    }
  }

  const tableList = (db_tables || []).join(', ')
  const dialect = connType ? dialectGuide(connType) : ''

  const systemPrompt = `You are an expert data analyst with direct access to the connected database. You give accurate, honest responses.

${connection_id ? `DATABASE: "${db_name}" (${connType})
ALL TABLES: ${tableList || 'none discovered yet'}

${dialect}

You can run read queries by including them like:
[QUERY: SELECT * FROM users LIMIT 10]

You can propose write/DDL operations like:
[WRITE: INSERT INTO users (name) VALUES ('Alice')]
[WRITE: ALTER TABLE users ADD groups text]

The user will be asked to confirm before any write/DDL executes.

IMPORTANT RULES:
- Always use the correct syntax for this specific database engine (${connType})
- If a query fails, report the actual error — never pretend it succeeded
- If something is not possible in this database engine, say so clearly with an explanation
- When you propose a write, the SQL you put in [WRITE: ...] must be exactly valid for ${connType}
- After a write is confirmed and executed, tell the user to refresh to see the change take effect` : 'No database connected. Tell the user to select a database from the left panel.'}

${data_context ? 'Data context:\n' + data_context : ''}
${insights_context ? 'Recent analysis:\n' + insights_context : ''}

Respond with markdown. Be direct, accurate, and honest about errors or limitations.`

  // ── Pre-emptive SELECT if message implies data need ─────────────────────────
  let preData = ''
  const isDataRequest = /\b(show|list|rows|data|records|count|how many|what|fetch|get)\b/i.test(message)
  if (connCfg && tableList && isDataRequest) {
    try {
      const genRes = await aiClient.messages.create({
        model: AGENT_MODEL, max_tokens: 300,
        system: `Generate a SELECT query for this request. Database engine: ${connType}.
Tables available: ${tableList}.
${dialect}
Return ONLY the SELECT SQL, nothing else. If a SELECT is not appropriate, return nothing.`,
        messages: [{ role: 'user', content: message }]
      })
      const autoSql = genRes.content
        .filter((b: any) => b.type === 'text')
        .map((b: any) => b.text).join('').trim()
        .replace(/^```sql\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

      if (autoSql && autoSql.toUpperCase().startsWith('SELECT')) {
        const result = await execQuery(connCfg, connType, autoSql, 50)
        if (result.rows.length > 0) {
          preData = `\n\n[Live query result for: ${autoSql}]\n${fmtTable(result)}`
        }
      }
    } catch (e: any) {
      // If pre-emptive query fails, include the error so the AI can explain it
      preData = `\n\n[Pre-emptive query failed: ${e.message}]`
    }
  }

  const response = await aiClient.messages.create({
    model: AGENT_MODEL, max_tokens: 2000,
    system: systemPrompt,
    messages: [
      ...(history || []).map((m: any) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message + preData }
    ]
  })

  let reply = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text).join('').trim()

  // ── Execute [QUERY: ...] blocks inline ─────────────────────────────────────
  const readRegex = /\[QUERY:\s*([\s\S]*?)\]/g
  let match
  const queryParts: string[] = []
  while ((match = readRegex.exec(reply)) !== null) {
    if (connCfg) {
      try {
        const result = await execQuery(connCfg, connType, match[1].trim(), 100)
        queryParts.push('\n**Results:**\n' + fmtTable(result))
      } catch (e: any) {
        queryParts.push(`\n**Query error:** \`${e.message}\``)
      }
    }
  }
  reply = reply.replace(/\[QUERY:\s*[\s\S]*?\]/g, '').trim()
  if (queryParts.length) reply += queryParts.join('\n')

  // ── Detect [WRITE: ...] — send back for confirmation ───────────────────────
  const writeMatch = reply.match(/\[WRITE:\s*([\s\S]*?)\]/)
  if (writeMatch) {
    const writeSql = writeMatch[1].trim()
    reply = reply.replace(/\[WRITE:\s*[\s\S]*?\]/g, '').trim()
    reply += `\n\n**Proposed operation:**\n\`\`\`sql\n${writeSql}\n\`\`\`\n_Confirm below to execute this against the database._`
    return { reply, pending_write: writeSql }
  }

  return { reply }
})