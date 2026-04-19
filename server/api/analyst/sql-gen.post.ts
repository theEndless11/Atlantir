import { useAnthropic, AGENT_MODEL } from '~/server/utils/anthropic'

const DIALECT_HINTS: Record<string, string> = {
  cassandra: `CQL (Cassandra Query Language) rules:
- ALTER TABLE: ALTER TABLE tbl ADD colname datatype  (NO "COLUMN" keyword)
- No JOINs, no subqueries
- Data types: text, int, bigint, boolean, float, double, uuid, timestamp, list<text>, map<text,text>
- Always include LIMIT on SELECT unless querying by full primary key
- System tables: system_schema.tables, system_schema.columns`,
  scylla: `CQL (ScyllaDB) — same rules as Cassandra above`,
  mysql: `MySQL syntax — use VARCHAR/TEXT, backticks for identifiers, LIMIT for pagination`,
  mariadb: `MariaDB syntax — same as MySQL`,
  postgres: `PostgreSQL syntax — use TEXT/JSONB, gen_random_uuid(), RETURNING clause`,
  supabase: `PostgreSQL syntax — same as postgres`,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { prompt, tables, db_type } = body

  const dialectHint = DIALECT_HINTS[db_type] || DIALECT_HINTS['postgres']

  const client = useAnthropic()
  const response = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: 400,
    system: `Generate a valid query for this database.

Database engine: ${db_type || 'postgres'}
${dialectHint}

Available tables: ${(tables || []).join(', ')}

Return ONLY the raw SQL/CQL query, no explanation, no markdown fences, no comments.
The query must be valid for ${db_type || 'postgres'} specifically.`,
    messages: [{ role: 'user', content: prompt }]
  })

  const sql = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text).join('').trim()
    .replace(/^```sql\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

  return { sql }
})