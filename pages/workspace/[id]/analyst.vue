<template>
  <div class="analyst-page" :class="{ 'has-chat': activeDb !== null }">

    <aside class="sources-panel">
      <div class="sources-top">
        <div class="section-head">
          <span>Data sources</span>
          <label class="btn-sm-icon" title="Import file">
            <input type="file" accept=".csv,.xlsx,.xls,.json,.tsv" multiple @change="handleFileImport" />
            +
          </label>
        </div>
        <div v-if="!dataSources.length" class="empty-sources">
          <p>Import CSV, Excel, or JSON</p>
        </div>
        <div v-for="src in dataSources" :key="src.id"
          class="source-item" :class="{ active: activeSource != null && activeSource.id === src.id }"
          @click="selectSource(src)">
          <span class="src-dot" :class="src.type"></span>
          <div class="source-info">
            <div class="source-name">{{ src.name }}</div>
            <div class="source-meta">{{ src.rows }} rows / {{ src.cols }} cols</div>
          </div>
          <button class="src-del" @click.stop="removeSource(src.id)" title="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        </div>
        <button class="btn-sample" @click="loadSampleData">+ Sample sales data</button>
      </div>

      <div class="section-head" style="margin-top:12px">
        <span>Databases</span>
        <button class="btn-sm-icon" @click="showDbModal = true">+</button>
      </div>
      <div v-if="!dbConnections.length" class="empty-sources"><p>Connect Postgres, MySQL, SQLite</p></div>
      <div v-for="db in dbConnections" :key="db.id"
        class="source-item" :class="{ active: activeDb != null && activeDb.id === db.id }"
        @click="selectDb(db)">
        <span class="src-dot" :class="db.type"></span>
        <div class="source-info">
          <div class="source-name">{{ db.name }}</div>
          <div class="source-meta">{{ db.type }}</div>
        </div>
        <span class="db-dot" :class="db.status"></span>
        <button class="src-del" @click.stop="removeDb(db.id)" title="Remove connection">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </aside>

    <main class="main-panel">
      <div class="tab-bar">
        <button v-for="tab in tabs" :key="tab.id" class="tab" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id">
          {{ tab.label }}
        </button>
        <div class="tab-spacer"></div>
        <span v-if="activeSource || activeDb" class="active-label">{{ activeSource ? activeSource.name : activeDb ? activeDb.name : '' }}</span>
      </div>

      <div v-if="activeTab === 'analysis'" class="tab-content">
        <template v-if="activeSource || activeDb">
          <div class="question-bar">
            <div class="q-wrap">
              <input v-model="question" class="q-input" placeholder="Ask anything about your data..." @keyup.enter="analyzeQuestion" />
              <button class="btn-go" :disabled="!question.trim() || analyzing" @click="analyzeQuestion">
                <span v-if="analyzing" class="spinner"></span>
                <span v-else>Go</span>
              </button>
            </div>
            <div class="quick-pills">
              <button v-for="s in quickSuggestions" :key="s" class="pill" @click="runQuick(s)">{{ s }}</button>
            </div>
          </div>

          <div v-if="!insights.length" class="preview-area">
            <div class="preview-bar">
              <span>{{ activeSource ? activeSource.name : activeDb ? activeDb.name : '' }}</span>
              <span class="dim">{{ activeSource ? (activeSource.rows + ' rows') : (activeDb ? activeDb.type : '') }}</span>
            </div>
            <div class="table-wrap">
              <table v-if="activeSource" class="data-table">
                <thead>
                  <tr>
                    <th v-for="col in activeSource.columns" :key="col">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in activeSource.preview" :key="i">
                    <td v-for="col in activeSource.columns" :key="col">{{ cellVal(row[col]) }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-else-if="activeDb" class="db-view">
                <div v-if="dbLoading" class="db-loading">
                  <div class="spinner dark"></div>
                  <span>Connecting to {{ activeDb.name }}...</span>
                </div>
                <div v-else-if="activeDb.status === 'error'" class="db-error-state">
                  <div class="db-err-title">Connection failed</div>
                  <div class="db-err-msg">{{ dbErrorMsg || 'Could not reach the database. Check your credentials and network.' }}</div>
                  <button class="btn-retry" @click="selectDb(activeDb)">Retry</button>
                </div>
                <template v-else-if="dbPreview">
                  <div class="db-status-bar">
                    <span class="db-connected-badge">Connected</span>
                    <span class="dim">{{ dbPreview.tables.length }} tables</span>
                  </div>
                  <div class="db-two-col">
                    <div class="db-tables-list">
                      <div class="db-tables-label">Tables</div>
                      <div v-for="t in dbPreview.tables" :key="t" class="db-table-row"
                        @click="sqlQuery = 'SELECT * FROM ' + t + ' LIMIT 50'; activeTab = 'sql'">
                        <span>{{ t }}</span>
                        <span class="dim" v-if="dbPreview.rowCounts[t] !== undefined">{{ dbPreview.rowCounts[t].toLocaleString() }} rows</span>
                      </div>
                    </div>
                    <div class="db-preview-table" v-if="dbPreview.preview.length">
                      <div class="db-tables-label">{{ dbPreview.tables[0] }} preview</div>
                      <div class="table-wrap" style="flex:1">
                        <table class="data-table">
                          <thead><tr><th v-for="col in dbPreview.columns" :key="col">{{ col }}</th></tr></thead>
                          <tbody>
                            <tr v-for="(row, i) in dbPreview.preview" :key="i">
                              <td v-for="col in dbPreview.columns" :key="col">{{ cellVal(row[col]) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else class="db-loading">
                  <span>Select a database to explore its tables</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="insights-feed">
            <div v-for="(ins, i) in insights" :key="i" class="insight-card">
              <div class="ins-header">
                <div class="ins-q">{{ ins.question }}</div>
                <div class="ins-actions">
                  <button class="icon-btn" @click="pinInsight(i)">{{ ins.pinned ? 'unpin' : 'pin' }}</button>
                  <button class="icon-btn" @click="exportInsight(ins)">export</button>
                  <button class="icon-btn" @click="removeInsight(i)">remove</button>
                </div>
              </div>
              <div v-if="ins.chartData" class="chart-wrap">
                <canvas :id="'chart-' + i" height="160"></canvas>
              </div>
              <div class="ins-answer" v-html="renderMd(ins.answer)"></div>
              <div v-if="ins.keyMetrics && ins.keyMetrics.length" class="metrics-row">
                <div v-for="m in ins.keyMetrics" :key="m.label" class="metric-chip">
                  <div class="m-val">{{ m.value }}</div>
                  <div class="m-label">{{ m.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="empty-main">
          <h2>AI Data Analyst</h2>
          <p>Connect a database or import a file to start</p>
        </div>
      </div>

      <div v-if="activeTab === 'sql'" class="tab-content sql-tab">
        <div class="sql-editor-wrap">
          <div class="sql-toolbar">
            <span class="dim">SQL Editor</span>
            <div class="limit-wrap">
              <span class="dim">Limit</span>
              <select v-model="sqlLimit" class="limit-select">
                <option :value="100">100</option>
                <option :value="500">500</option>
                <option :value="1000">1000</option>
                <option :value="5000">5000</option>
                <option :value="999999">All</option>
              </select>
            </div>
            <button class="btn-run-sql" :disabled="!sqlQuery.trim() || runningSQL" @click="runSQL(false)">
              <span v-if="runningSQL" class="spinner dark"></span>
              <span v-else>Run</span>
            </button>
            <button class="btn-gen-sql" @click="generateSQL">Generate SQL</button>
          </div>
          <textarea v-model="sqlQuery" class="sql-textarea" placeholder="SELECT * FROM orders LIMIT 100" spellcheck="false"></textarea>
        </div>
        <div v-if="writeConfirmPending" class="write-confirm-banner">
          <div class="write-confirm-msg">
            <strong>Write operation detected</strong> - This query will modify data. Are you sure?
          </div>
          <div class="write-confirm-sql">{{ writeConfirmPending }}</div>
          <div class="write-confirm-btns">
            <button class="btn-cancel-write" @click="writeConfirmPending = null">Cancel</button>
            <button class="btn-confirm-write" @click="confirmWrite">Yes, run it</button>
          </div>
        </div>
        <div v-if="sqlResult" class="sql-result">
          <div class="sql-result-bar">
            <span v-if="sqlResult.query_type === 'write'" class="write-badge">{{ sqlResult.affected_rows }} rows affected</span>
            <span v-else>{{ sqlResult.rows }} rows</span>
            <span v-if="sqlResult.truncated" class="truncated-warn">Limited to {{ sqlLimit }}</span>
            <span class="dim">{{ sqlResult.time }}ms</span>
            <button class="btn-export-sql" @click="exportSQL">Export CSV</button>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th v-for="col in sqlResult.columns" :key="col">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in sqlResult.data" :key="i">
                  <td v-for="col in sqlResult.columns" :key="col">{{ cellVal(row[col]) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="sql-empty">
          <p>Write SQL or use Generate SQL to create queries from plain English</p>
          <div class="sql-examples">
            <button v-for="ex in sqlExamples" :key="ex" class="sql-ex-btn" @click="sqlQuery = ex">{{ ex }}</button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'charts'" class="tab-content charts-tab">
        <div class="chart-builder">
          <div class="chart-controls">
            <div class="ctrl-group">
              <label>Chart type</label>
              <div class="chart-type-grid">
                <button v-for="ct in chartTypes" :key="ct.id" class="chart-type-btn" :class="{ active: chartConfig.type === ct.id }" @click="chartConfig.type = ct.id">
                  {{ ct.label }}
                </button>
              </div>
            </div>
            <div v-if="activeSource" class="ctrl-group">
              <label>X axis</label>
              <select v-model="chartConfig.x" class="ctrl-select">
                <option v-for="col in activeSource.columns" :key="col" :value="col">{{ col }}</option>
              </select>
            </div>
            <div v-if="activeSource" class="ctrl-group">
              <label>Y axis</label>
              <select v-model="chartConfig.y" class="ctrl-select">
                <option v-for="col in numericCols" :key="col" :value="col">{{ col }}</option>
              </select>
            </div>
            <button class="btn-build-chart" :disabled="!activeSource" @click="buildChart">Build chart</button>
          </div>
          <div class="chart-preview">
            <canvas id="builder-chart" height="280"></canvas>
            <div v-if="!chartBuilt" class="chart-placeholder">Configure and build your chart</div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'summary'" class="tab-content">
        <div v-if="!summaryData" class="summary-empty">
          <button class="btn-gen-summary" :disabled="(!activeSource && !activeDb) || generatingSummary" @click="generateSummary">
            <span v-if="generatingSummary" class="spinner dark"></span>
            <span v-else>Generate full report</span>
          </button>
          <p>Auto-generate a complete analysis report with key insights, trends, and recommendations</p>
        </div>
        <div v-else class="summary-content">
          <div class="summary-toolbar">
            <span class="summary-title">{{ summaryData.title }}</span>
            <button class="btn-export-report" @click="exportReport">Export</button>
            <button class="icon-btn" @click="summaryData = null">Regenerate</button>
          </div>
          <div class="summary-body" v-html="renderMd(summaryData.content)"></div>
        </div>
      </div>
    </main>

    <aside v-if="activeDb !== null" class="chat-panel">
      <div class="chat-header">
        <span>Chat with data</span>
        <button class="icon-btn" @click="clearChat">Clear</button>
      </div>
      <div ref="chatEl" class="chat-messages">
        <div v-if="!chatMessages.length" class="chat-empty">
          <p>Ask follow-up questions or dig deeper into any insight</p>
        </div>
        <div v-for="msg in chatMessages" :key="msg.id" class="chat-msg" :class="msg.role">
          <div v-if="msg.user_name && msg.role === 'user'" class="msg-name">{{ msg.user_name }}</div>
          <div class="msg-bubble" v-html="renderMd(msg.content)"></div>
          <div v-if="msg.pending_write" class="write-confirm-inline">
            <div class="wci-header">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              Proposed write operation — confirm before executing
            </div>
            <code class="wci-sql">{{ msg.pending_write }}</code>
            <div class="wci-btns">
              <button class="wci-cancel" @click="dismissWrite(msg.id)">Decline</button>
              <button class="wci-confirm" @click="confirmInlineWrite(msg)">Confirm & Execute</button>
            </div>
          </div>
          <div class="msg-time">{{ msg.time }}</div>
        </div>
        <div v-if="chatThinking" class="chat-msg assistant">
          <div class="msg-bubble thinking"><span></span><span></span><span></span></div>
        </div>
      </div>
      <div class="chat-input-wrap">
        <textarea v-model="chatInput" class="chat-input" placeholder="Ask anything about your data..." rows="3" @keydown.enter.exact.prevent="sendChatMessage"></textarea>
        <button class="btn-send-chat" :disabled="!chatInput.trim() || chatThinking" @click="sendChatMessage">Send</button>
      </div>
    </aside>

    <!-- SQL Error modal -->
    <Transition name="toast-fade">
      <div v-if="sqlError" class="sql-error-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>{{ sqlError }}</span>
        <button class="sql-error-close" @click="sqlError = ''">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </Transition>

    <div v-if="showDbModal" class="modal-backdrop" @click.self="showDbModal = false">
      <div class="modal">
        <div class="modal-head">
          <span>Connect database</span>
          <button class="icon-btn" @click="showDbModal = false">X</button>
        </div>
        <div class="modal-body">
          <div class="db-type-grid">
            <button v-for="t in dbTypes" :key="t.id" class="db-type-btn" :class="{ active: dbForm.type === t.id }" @click="dbForm.type = t.id; dbTestStatus = ''">
              {{ t.label }}
            </button>
          </div>

          <div class="field">
            <label>Connection name <span class="req">*</span></label>
            <input v-model="dbForm.name" placeholder="e.g. Production Cassandra" />
          </div>

          <div class="conn-mode-toggle">
            <button class="mode-opt" :class="{ active: !dbForm.useConnStr }" @click="dbForm.useConnStr = false">Fields</button>
            <button class="mode-opt" :class="{ active: dbForm.useConnStr }" @click="dbForm.useConnStr = true">Connection string</button>
          </div>

          <template v-if="dbForm.useConnStr">
            <div class="field">
              <label>Connection string</label>
              <input v-model="dbForm.connectionString" :placeholder="dbConnStrPlaceholder" />
              <span class="field-hint">{{ dbConnStrHint }}</span>
            </div>
          </template>

          <template v-else>
            <div class="field-row">
              <div class="field">
                <label>Host <span class="opt">optional</span></label>
                <input v-model="dbForm.host" :placeholder="dbFieldDefaults.host" />
              </div>
              <div class="field sm">
                <label>Port <span class="opt">optional</span></label>
                <input v-model="dbForm.port" :placeholder="dbFieldDefaults.port" />
              </div>
            </div>
            <div class="field">
              <label>{{ dbFieldDefaults.dbLabel }} <span class="opt">optional</span></label>
              <input v-model="dbForm.database" :placeholder="dbFieldDefaults.database" />
            </div>
            <div class="field-row">
              <div class="field">
                <label>Username <span class="opt">optional</span></label>
                <input v-model="dbForm.username" :placeholder="dbFieldDefaults.user" />
              </div>
              <div class="field">
                <label>Password <span class="opt">optional</span></label>
                <input v-model="dbForm.password" type="password" placeholder="leave blank if none" />
              </div>
            </div>
            <div v-if="dbFieldDefaults.extraLabel" class="field">
              <label>{{ dbFieldDefaults.extraLabel }} <span class="opt">optional</span></label>
              <input v-model="dbForm.extra" :placeholder="dbFieldDefaults.extraPlaceholder || ''" />
            </div>
            <label class="ssl-toggle">
              <input type="checkbox" v-model="dbForm.ssl" />
              <span>Enable SSL/TLS</span>
            </label>
          </template>

          <div v-if="testingDb" class="field-testing">Testing connection...</div>
          <div v-else-if="dbTestStatus === 'success'" class="field-success">Connection successful - saving...</div>
          <div v-else-if="dbTestStatus === 'error'" class="field-error">{{ dbError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showDbModal = false">Cancel</button>
          <button class="btn-save-db" :disabled="!dbForm.name || testingDb" @click="saveConnection">
            <span v-if="testingDb" class="spinner dark"></span>
            <span v-else>Connect</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })

const route = useRoute()
const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string

interface DataSource {
  id: string
  name: string
  type: string
  rows: number
  cols: number
  columns: string[]
  data: Record<string, any>[]
  preview: Record<string, any>[]
  columnStats: { name: string; type: string; min?: any; max?: any; uniques?: number }[]
}
interface DbConnection {
  id: string
  name: string
  type: string
  status: string
  tables?: string[]
}
interface Insight {
  question: string
  answer: string
  chartData?: any
  keyMetrics?: { label: string; value: string }[]
  pinned?: boolean
}
interface ChatMsg {
  id: string
  role: string
  content: string
  time: string
  user_name?: string
  pending_write?: string
}

const dataSources = ref<DataSource[]>([])
const activeSource = ref<DataSource | null>(null)
const dbConnections = ref<DbConnection[]>([])
const activeDb = ref<DbConnection | null>(null)
const activeTab = ref('analysis')
const question = ref('')
const analyzing = ref(false)
const insights = ref<Insight[]>([])
const chatMessages = ref<ChatMsg[]>([])
const sqlError = ref('')
const chatInput = ref('')
const chatThinking = ref(false)
const chatEl = ref<HTMLElement>()
const sqlQuery = ref('')
const sqlResult = ref<any>(null)
const runningSQL = ref(false)
const chartConfig = ref({ type: 'bar', x: '', y: '' })
const chartBuilt = ref(false)
const summaryData = ref<any>(null)
const generatingSummary = ref(false)
const showDbModal = ref(false)
const dbLoading = ref(false)
const writeConfirmPending = ref<string | null>(null)
const sqlLimit = ref(500)
const dbErrorMsg = ref('')
const dbPreview = ref<{ tables: string[]; preview: any[]; columns: string[]; rowCounts: Record<string,number> } | null>(null)
const testingDb = ref(false)
const dbError = ref('')
const dbTestStatus = ref('')
const dbForm = ref({ type: 'postgres', name: '', host: '', port: '', database: '', username: '', password: '', connectionString: '', useConnStr: false, ssl: false, extra: '' })

const tabs = [
  { id: 'analysis', label: 'Analysis' },
  { id: 'sql', label: 'SQL' },
  { id: 'charts', label: 'Charts' },
  { id: 'summary', label: 'Report' }
]

const chartTypes = [
  { id: 'bar', label: 'Bar' },
  { id: 'line', label: 'Line' },
  { id: 'pie', label: 'Pie' },
  { id: 'scatter', label: 'Scatter' },
  { id: 'doughnut', label: 'Donut' },
  { id: 'radar', label: 'Radar' }
]

const dbTypes = [
  { id: 'postgres', label: 'PostgreSQL' },
  { id: 'mysql', label: 'MySQL' },
  { id: 'mariadb', label: 'MariaDB' },
  { id: 'mssql', label: 'SQL Server' },
  { id: 'sqlite', label: 'SQLite' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'redis', label: 'Redis' },
  { id: 'cassandra', label: 'Cassandra' },
  { id: 'scylla', label: 'ScyllaDB' },
  { id: 'clickhouse', label: 'ClickHouse' },
  { id: 'bigquery', label: 'BigQuery' },
  { id: 'snowflake', label: 'Snowflake' },
  { id: 'supabase', label: 'Supabase' },
  { id: 'planetscale', label: 'PlanetScale' },
  { id: 'turso', label: 'Turso' },
  { id: 'duckdb', label: 'DuckDB' }
]

const sqlExamples = [
  'SELECT * FROM orders LIMIT 10',
  'SELECT category, SUM(revenue) FROM sales GROUP BY category',
  'SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL 30 DAY'
]

const DB_CONFIGS: Record<string, any> = {
  postgres:    { host: 'localhost', port: '5432', user: 'postgres', database: 'mydb', dbLabel: 'Database', connStr: 'postgresql://user:pass@localhost:5432/mydb', connHint: 'Standard PostgreSQL URL' },
  mysql:       { host: 'localhost', port: '3306', user: 'root', database: 'mydb', dbLabel: 'Database', connStr: 'mysql://user:pass@localhost:3306/mydb', connHint: 'MySQL connection URL' },
  mariadb:     { host: 'localhost', port: '3306', user: 'root', database: 'mydb', dbLabel: 'Database', connStr: 'mariadb://user:pass@localhost:3306/mydb', connHint: 'MariaDB connection URL' },
  mssql:       { host: 'localhost', port: '1433', user: 'sa', database: 'master', dbLabel: 'Database', extraLabel: 'Instance', extraPlaceholder: 'SQLEXPRESS', connStr: 'mssql://sa:pass@localhost:1433/master', connHint: 'SQL Server connection URL' },
  sqlite:      { host: '', port: '', user: '', database: '/path/to/db.sqlite', dbLabel: 'File path', connStr: 'file:/path/to/database.sqlite', connHint: 'SQLite file path' },
  duckdb:      { host: '', port: '', user: '', database: '/path/to/db.duckdb', dbLabel: 'File path', connStr: 'duckdb:///path/to/db.duckdb', connHint: 'Use :memory: for in-memory mode' },
  mongodb:     { host: 'localhost', port: '27017', user: 'admin', database: 'mydb', dbLabel: 'Database', connStr: 'mongodb://localhost:27017/mydb', connHint: 'Supports replica set and Atlas SRV URIs' },
  redis:       { host: 'localhost', port: '6379', user: 'default', database: '0', dbLabel: 'DB index', connStr: 'redis://localhost:6379/0', connHint: 'Redis connection URL' },
  cassandra:   { host: 'localhost', port: '9042', user: '', database: '', dbLabel: 'Keyspace', extraLabel: 'Datacenter', extraPlaceholder: 'datacenter1', connStr: 'cassandra://localhost:9042/mykeyspace', connHint: 'Comma-separate multiple contact points' },
  scylla:      { host: 'localhost', port: '9042', user: '', database: '', dbLabel: 'Keyspace', extraLabel: 'Datacenter', extraPlaceholder: 'datacenter1', connStr: 'scylla://localhost:9042/mykeyspace', connHint: 'ScyllaDB uses Cassandra-compatible driver' },
  clickhouse:  { host: 'localhost', port: '8123', user: 'default', database: 'default', dbLabel: 'Database', connStr: 'clickhouse://default@localhost:8123/default', connHint: 'ClickHouse HTTP interface' },
  bigquery:    { host: '', port: '', user: '', database: 'my-gcp-project', dbLabel: 'Project ID', extraLabel: 'Dataset', extraPlaceholder: 'my_dataset', connStr: 'bigquery://my-project/my-dataset', connHint: 'BigQuery project and dataset URL' },
  snowflake:   { host: 'account.snowflakecomputing.com', port: '443', user: 'user', database: 'MY_DB', dbLabel: 'Database', extraLabel: 'Warehouse', extraPlaceholder: 'COMPUTE_WH', connStr: 'snowflake://user:pass@account/db?warehouse=WH', connHint: 'Snowflake account URL' },
  supabase:    { host: 'db.xxxx.supabase.co', port: '5432', user: 'postgres', database: 'postgres', dbLabel: 'Database', connStr: 'postgresql://postgres:pass@db.xxxx.supabase.co:5432/postgres', connHint: 'Supabase uses standard Postgres URL' },
  planetscale: { host: 'aws.connect.psdb.cloud', port: '3306', user: 'user', database: 'mydb', dbLabel: 'Database', connStr: 'mysql://user:pass@aws.connect.psdb.cloud/mydb?ssl=true', connHint: 'PlanetScale MySQL-compatible URL' },
  turso:       { host: 'libsql://db.turso.io', port: '', user: '', database: '', dbLabel: 'Database URL', extraLabel: 'Auth token', extraPlaceholder: 'eyJ...', connStr: 'libsql://db-name-org.turso.io?authToken=TOKEN', connHint: 'Turso libSQL URL with auth token' }
}

const dbFieldDefaults = computed(() => DB_CONFIGS[dbForm.value.type] || DB_CONFIGS.postgres)
const dbConnStrPlaceholder = computed(() => DB_CONFIGS[dbForm.value.type]?.connStr || '')
const dbConnStrHint = computed(() => DB_CONFIGS[dbForm.value.type]?.connHint || '')

const numericCols = computed(() =>
  activeSource.value ? activeSource.value.columnStats.filter(c => c.type === 'number').map(c => c.name) : []
)

const textCols = computed(() =>
  activeSource.value ? activeSource.value.columnStats.filter(c => c.type === 'text').map(c => c.name) : []
)

const quickSuggestions = computed(() => {
  const src = activeSource.value
  if (!src) return ['Summarize this dataset', 'Find outliers', 'Show trends', 'Top 10 by value']
  const num = numericCols.value
  const txt = textCols.value
  const s1 = 'Summarize key insights'
  const s2 = num.length > 1 ? ('Correlate ' + num[0] + ' vs ' + num[1]) : ('Distribution of ' + (num[0] || src.columns[0]))
  const s3 = txt.length ? ('Top 10 ' + txt[0]) : 'Find anomalies'
  const s4 = 'What should I focus on?'
  return [s1, s2, s3, s4]
})

function cellVal(v: any): string {
  if (v === undefined || v === null) return '-'
  return String(v)
}

function renderMd(text: string): string {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.*)/gm, '<h4>$1</h4>')
    .replace(/^## (.*)/gm, '<h3>$1</h3>')
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
}

function parseCSV(text: string): Record<string, any>[] {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = line.split(',')
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ? vals[i].trim().replace(/^"|"$/g, '') : '']))
  })
}

function inferStats(data: Record<string, any>[], columns: string[]) {
  return columns.map(col => {
    const vals = data.map(r => r[col]).filter(v => v !== '' && v != null)
    const nums = vals.map(Number).filter(n => !isNaN(n))
    if (nums.length > vals.length * 0.7) {
      return { name: col, type: 'number', min: Math.min(...nums), max: Math.max(...nums) }
    }
    return { name: col, type: 'text', uniques: new Set(vals).size }
  })
}

function buildDataContext(): string {
  const src = activeSource.value
  if (!src) return ''
  const stats = src.columnStats.map(c => {
    if (c.type === 'number') {
      return c.name + '(num,' + c.min + '-' + c.max + ')'
    }
    return c.name + '(text,' + c.uniques + 'unique)'
  }).join(', ')
  return 'Dataset: ' + src.name + ', ' + src.rows + ' rows. Columns: ' + stats
}

async function handleFileImport(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files) return
  for (const file of Array.from(files)) {
    const text = await file.text()
    let data: Record<string, any>[] = []
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext === 'csv' || ext === 'tsv') {
      data = parseCSV(ext === 'tsv' ? text.replace(/\t/g, ',') : text)
    } else if (ext === 'json') {
      try {
        data = JSON.parse(text)
        if (!Array.isArray(data)) data = [data]
      } catch {}
    }
    if (!data.length) continue
    const columns = Object.keys(data[0])
    const src: DataSource = {
      id: Math.random().toString(36).slice(2),
      name: file.name,
      type: (ext === 'csv' || ext === 'tsv') ? 'csv' : 'json',
      rows: data.length,
      cols: columns.length,
      columns,
      data,
      preview: data.slice(0, 10),
      columnStats: inferStats(data, columns)
    }
    dataSources.value.push(src)
    activeSource.value = src
    activeDb.value = null
    insights.value = []
  }
}

function loadSampleData() {
  const data = [
    { month: 'Jan', revenue: 42000, expenses: 28000, profit: 14000, units: 340, region: 'North', product: 'Pro' },
    { month: 'Feb', revenue: 48000, expenses: 29000, profit: 19000, units: 390, region: 'North', product: 'Basic' },
    { month: 'Mar', revenue: 45000, expenses: 31000, profit: 14000, units: 365, region: 'South', product: 'Pro' },
    { month: 'Apr', revenue: 52000, expenses: 30000, profit: 22000, units: 420, region: 'North', product: 'Enterprise' },
    { month: 'May', revenue: 61000, expenses: 32000, profit: 29000, units: 495, region: 'West', product: 'Pro' },
    { month: 'Jun', revenue: 58000, expenses: 35000, profit: 23000, units: 470, region: 'South', product: 'Basic' },
    { month: 'Jul', revenue: 49000, expenses: 33000, profit: 16000, units: 400, region: 'West', product: 'Pro' },
    { month: 'Aug', revenue: 55000, expenses: 31000, profit: 24000, units: 445, region: 'North', product: 'Enterprise' },
    { month: 'Sep', revenue: 63000, expenses: 36000, profit: 27000, units: 510, region: 'South', product: 'Pro' },
    { month: 'Oct', revenue: 71000, expenses: 38000, profit: 33000, units: 575, region: 'West', product: 'Enterprise' },
    { month: 'Nov', revenue: 84000, expenses: 42000, profit: 42000, units: 680, region: 'North', product: 'Pro' },
    { month: 'Dec', revenue: 92000, expenses: 45000, profit: 47000, units: 745, region: 'West', product: 'Enterprise' }
  ]
  const columns = Object.keys(data[0])
  const src: DataSource = {
    id: 'sample',
    name: 'sample-sales-2024.csv',
    type: 'csv',
    rows: data.length,
    cols: columns.length,
    columns,
    data,
    preview: data,
    columnStats: inferStats(data, columns)
  }
  const idx = dataSources.value.findIndex(s => s.id === 'sample')
  if (idx !== -1) {
    dataSources.value[idx] = src
  } else {
    dataSources.value.push(src)
  }
  activeSource.value = src
  activeDb.value = null
  insights.value = []
}

function selectSource(src: DataSource) {
  activeSource.value = src
  activeDb.value = null
  insights.value = []
  activeTab.value = 'analysis'
}

async function selectDb(db: DbConnection) {
  activeDb.value = db
  activeSource.value = null
  insights.value = []
  activeTab.value = 'analysis'
  dbPreview.value = null
  dbLoading.value = true
  try {
    const res = await $fetch<any>('/api/analyst/db-introspect', {
      method: 'POST',
      body: { connection_id: db.id, workspace_id: workspaceId }
    })
    dbPreview.value = res
    // Update tables on the connection object
    const idx = dbConnections.value.findIndex(c => c.id === db.id)
    if (idx !== -1) {
      dbConnections.value[idx].tables = res.tables
      dbConnections.value[idx].status = 'connected'
    }
    activeDb.value = { ...db, tables: res.tables, status: 'connected' }
  } catch (e: any) {
    dbErrorMsg.value = e?.data?.message || e?.message || 'Connection failed'
    const idx = dbConnections.value.findIndex(c => c.id === db.id)
    if (idx !== -1) dbConnections.value[idx].status = 'error'
    activeDb.value = { ...db, status: 'error' }
  } finally {
    dbLoading.value = false
  }
}

async function removeDb(id: string) {
  dbConnections.value = dbConnections.value.filter(d => d.id !== id)
  if (activeDb.value && activeDb.value.id === id) {
    activeDb.value = null
    dbPreview.value = null
  }
  try {
    await $fetch('/api/analyst/db-delete', { method: 'POST', body: { id, workspace_id: workspaceId } })
  } catch {}
}

function removeSource(id: string) {
  dataSources.value = dataSources.value.filter(s => s.id !== id)
  if (activeSource.value && activeSource.value.id === id) {
    activeSource.value = dataSources.value[0] || null
    insights.value = []
  }
}

function removeInsight(i: number) { insights.value.splice(i, 1) }
function pinInsight(i: number) { insights.value[i].pinned = !insights.value[i].pinned }
function runQuick(s: string) { question.value = s; analyzeQuestion() }
async function clearChat() {
  chatMessages.value = []
  await $fetch('/api/analyst/chat-clear', {
    method: 'POST',
    body: { workspace_id: workspaceId, connection_id: activeDb.value?.id || null }
  })
}

async function analyzeQuestion() {
  if (!question.value.trim() || analyzing.value) return
  const q = question.value.trim()
  question.value = ''
  analyzing.value = true
  try {
    const src = activeSource.value
    const db = activeDb.value

    // If DB connected and no file, fetch a sample from the first table
    let dbSample: any[] = []
    let dbColumns: string[] = []
    let dbStats = ''
    if (!src && db && dbPreview.value && dbPreview.value.tables.length) {
      try {
        const qRes = await $fetch<any>('/api/analyst/db-query', {
          method: 'POST',
          body: {
            sql: 'SELECT * FROM ' + (dbPreview.value.tables[0]) + ' LIMIT 50',
            connection_id: db.id
          }
        })
        dbSample = qRes.rows || []
        dbColumns = qRes.columns || []
        dbStats = dbColumns.join(', ')
      } catch {}
    }

    const res = await $fetch<any>('/api/analyst/query', {
      method: 'POST',
      body: {
        question: q,
        workspace_id: workspaceId,
        data_sample: src ? src.data.slice(0, 50) : dbSample,
        columns: src ? src.columns : dbColumns,
        column_stats: src ? src.columnStats.map(c => {
          if (c.type === 'number') return c.name + '(number,' + c.min + '-' + c.max + ')'
          return c.name + '(text,' + c.uniques + 'unique)'
        }).join(', ') : dbStats,
        total_rows: src ? src.rows : dbSample.length,
        db_info: db ? ('Connected to ' + db.name + ' (' + db.type + '). Tables: ' + (dbPreview.value?.tables.join(', ') || 'unknown')) : ''
      }
    })
    const insight: Insight = {
      question: q,
      answer: res.answer,
      keyMetrics: res.key_metrics || [],
      chartData: res.chart_data || null
    }
    insights.value.unshift(insight)
    if (res.chart_data) {
      await nextTick()
      renderChart('chart-0', res.chart_data)
    }
    // Sync to chat panel so right side stays aware
    chatMessages.value.push({
      id: String(Date.now()),
      role: 'assistant',
      content: '[Analysis] ' + q + '\n\n' + res.answer,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } catch (e: any) {
    insights.value.unshift({ question: q, answer: e?.data?.message || 'Analysis failed. Please try again.' })
  } finally {
    analyzing.value = false
  }
}

async function sendChatMessage() {
  if (!chatInput.value.trim() || chatThinking.value) return
  const text = chatInput.value.trim()
  chatInput.value = ''
  chatMessages.value.push({
    id: String(Date.now()),
    role: 'user',
    content: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  await nextTick()
  if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
  chatThinking.value = true
  try {
    const history = chatMessages.value.slice(-10).map(m => ({ role: m.role, content: m.content }))
    // Build insights context from recent analysis
    const insightsContext = insights.value.slice(0, 3)
  .map(i => `Q: ${i.question}
A: ${i.answer.slice(0, 300)}`)
  .join('\n\n')
  
    const res = await $fetch<any>('/api/analyst/chat', {
      method: 'POST',
      body: {
        message: text,
        history,
        data_context: buildDataContext(),
        workspace_id: workspaceId,
        // Pass DB connection info so chat can query live
        connection_id: activeDb.value ? activeDb.value.id : null,
        db_tables: dbPreview.value ? dbPreview.value.tables : [],
        db_name: activeDb.value ? activeDb.value.name : null,
        db_type: activeDb.value ? activeDb.value.type : null,
        insights_context: insightsContext
      }
    })
    chatMessages.value.push({
      id: String(Date.now() + 1),
      role: 'assistant',
      content: res.reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pending_write: res.pending_write || undefined
    })
    saveChatToLocalStorage()
  } catch (e: any) {
    chatMessages.value.push({ id: String(Date.now() + 1), role: 'assistant', content: e?.data?.message || 'Something went wrong.', time: '' })
  } finally {
    chatThinking.value = false
    await nextTick()
    if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
  }
}

async function generateSQL() {
  if (!sqlQuery.value.trim()) { sqlQuery.value = 'SELECT * FROM '; return }
  const res = await $fetch<any>('/api/analyst/sql-gen', {
    method: 'POST',
    body: {
      prompt: sqlQuery.value,
      tables: activeDb.value ? (activeDb.value.tables || []) : (activeSource.value ? [activeSource.value.name] : []),
      db_type: activeDb.value?.type || 'postgres',
      workspace_id: workspaceId
    }
  })
  sqlQuery.value = res.sql
}

async function runSQL(allowWrite = false) {
  if (!sqlQuery.value.trim() || runningSQL.value) return
  writeConfirmPending.value = null
  runningSQL.value = true
  const start = Date.now()
  try {
    if (activeSource.value) {
      const src = activeSource.value
      const data = src.data.slice(0, sqlLimit.value)
      sqlResult.value = { columns: src.columns, data, rows: data.length, time: Date.now() - start, truncated: false }
    } else if (activeDb.value) {
      const res = await $fetch<any>('/api/analyst/db-query', {
        method: 'POST',
        body: { sql: sqlQuery.value, connection_id: activeDb.value.id, limit: sqlLimit.value, allow_write: allowWrite }
      })
      sqlResult.value = { columns: res.columns, data: res.rows, rows: res.count, time: res.time, truncated: res.truncated, affected_rows: res.affected_rows, query_type: res.query_type }
    }
  } catch (e: any) {
    sqlResult.value = null
    const msg = e?.data?.message || e?.message || 'Query failed'
    if (msg === 'WRITE_CONFIRMATION_REQUIRED') {
      writeConfirmPending.value = sqlQuery.value
    } else {
      sqlError.value = msg
    }
  } finally {
    runningSQL.value = false
  }
}

function dismissWrite(msgId: string) {
  const msg = chatMessages.value.find(m => m.id === msgId)
  if (msg) {
    msg.pending_write = undefined
    chatMessages.value = [...chatMessages.value] // trigger reactivity
  }
}

async function confirmInlineWrite(msg: any) {
  if (!msg.pending_write || !activeDb.value) return
  const sql = msg.pending_write
  msg.pending_write = undefined
  chatMessages.value = [...chatMessages.value]

  chatThinking.value = true
  try {
    const res = await $fetch<any>('/api/analyst/chat', {
      method: 'POST',
      body: {
        message: 'confirm',
        workspace_id: workspaceId,
        connection_id: activeDb.value.id,
        db_tables: dbPreview.value ? dbPreview.value.tables : [],
        db_name: activeDb.value.name,
        db_type: activeDb.value.type,
        confirm_write: true,
        pending_sql: sql,
        history: []
      }
    })
    chatMessages.value.push({
      id: String(Date.now()),
      role: 'assistant',
      content: res.reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    saveChatToLocalStorage()
    // Auto-refresh table list after DDL
    if (/^\s*(alter|create|drop)/i.test(sql)) {
      setTimeout(async () => {
        try {
          const introspect = await $fetch<any>('/api/analyst/db-introspect', {
            query: { connection_id: activeDb.value!.id }
          })
          if (introspect?.tables) {
            activeDb.value = { ...activeDb.value!, tables: introspect.tables }
          }
        } catch {}
      }, 800)
    }
  } catch (e: any) {
    chatMessages.value.push({
      id: String(Date.now()),
      role: 'assistant',
      content: 'Operation failed: ' + (e?.data?.message || e?.message || 'Unknown error'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  } finally {
    chatThinking.value = false
    await nextTick()
    if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
  }
}

async function confirmWrite() {
  const sql = writeConfirmPending.value
  writeConfirmPending.value = null
  await runSQL(true)
  // If it was a DDL operation, offer to re-introspect tables
  if (sql && /^\s*(alter|create|drop)/i.test(sql) && activeDb.value) {
    setTimeout(async () => {
      try {
        const res = await $fetch<any>('/api/analyst/db-introspect', {
          method: 'GET',
          query: { connection_id: activeDb.value!.id }
        })
        if (res?.tables) {
          activeDb.value = { ...activeDb.value!, tables: res.tables }
        }
      } catch {}
    }, 800)
  }
}

function buildChart() {
  if (!activeSource.value) return
  const src = activeSource.value
  const labels = src.data.map(r => cellVal(r[chartConfig.value.x])).slice(0, 50)
  const values = src.data.map(r => parseFloat(r[chartConfig.value.y]) || 0).slice(0, 50)
  chartBuilt.value = true
  nextTick(() => {
    const canvas = document.getElementById('builder-chart') as HTMLCanvasElement
    if (!canvas || !(window as any).Chart) return
    const existing = (window as any).Chart.getChart(canvas)
    if (existing) existing.destroy()
    new (window as any).Chart(canvas, {
      type: chartConfig.value.type,
      data: { labels, datasets: [{ label: chartConfig.value.y, data: values, backgroundColor: '#6366f1', borderColor: '#6366f1', fill: false }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    })
  })
}

async function generateSummary() {
  if (!activeSource.value && !activeDb.value) return
  generatingSummary.value = true
  try {
    const src = activeSource.value
    const db = activeDb.value

    let sample: any[] = []
    let colStats: any[] = []
    let totalRows = 0
    let name = ''

    if (src) {
      sample = src.data.slice(0, 100)
      colStats = src.columnStats
      totalRows = src.rows
      name = src.name
    } else if (db && dbPreview.value) {
      name = db.name + ' (' + db.type + ')'
      // Fetch data from all tables
      for (const table of dbPreview.value.tables.slice(0, 5)) {
        try {
          const res = await $fetch<any>('/api/analyst/db-query', {
            method: 'POST',
            body: { sql: 'SELECT * FROM ' + table + ' LIMIT 50', connection_id: db.id }
          })
          sample.push(...(res.rows || []).map((r: any) => ({ _table: table, ...r })))
          totalRows += dbPreview.value?.rowCounts[table] || res.count || 0
        } catch {}
      }
      colStats = dbPreview.value.columns.map(c => ({ name: c, type: 'text' }))
    }

    const res = await $fetch<any>('/api/analyst/summary', {
      method: 'POST',
      body: {
        data_sample: sample,
        column_stats: colStats,
        name,
        total_rows: totalRows,
        db_tables: dbPreview.value?.tables || [],
        workspace_id: workspaceId
      }
    })
    summaryData.value = res
  } catch (e: any) {
    console.error('Summary error:', e)
  } finally {
    generatingSummary.value = false
  }
}

function exportInsight(ins: Insight) {
  const lines = ['# ' + ins.question, '', ins.answer]
  if (ins.keyMetrics && ins.keyMetrics.length) {
    ins.keyMetrics.forEach(m => lines.push('**' + m.label + ':** ' + m.value))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'insight-' + Date.now() + '.md'
  a.click()
}

function exportSQL() {
  if (!sqlResult.value) return
  const rows = [sqlResult.value.columns.join(',')]
  sqlResult.value.data.forEach((r: any) => {
    rows.push(sqlResult.value.columns.map((c: string) => cellVal(r[c])).join(','))
  })
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'query-' + Date.now() + '.csv'
  a.click()
}

function exportReport() {
  if (!summaryData.value) return
  const blob = new Blob([summaryData.value.content], { type: 'text/markdown' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'report-' + Date.now() + '.md'
  a.click()
}

async function testConnection() {
  testingDb.value = true
  dbError.value = ''
  dbTestStatus.value = ''
  try {
    const payload = {
      ...dbForm.value,
      useConnectionString: dbForm.value.useConnStr,
      datacenter: dbForm.value.extra,
      workspace_id: workspaceId
    }
    await $fetch('/api/analyst/db-test', { method: 'POST', body: payload })
    dbTestStatus.value = 'success'
  } catch (e: any) {
    dbTestStatus.value = 'error'
    dbError.value = (e?.data?.message || e?.message || 'Could not connect - check credentials')
  } finally {
    testingDb.value = false
  }
}

async function saveConnection() {
  if (!dbForm.value.name) return
  dbError.value = ''
  dbTestStatus.value = ''
  testingDb.value = true

  // Auto-test before saving
  try {
    const payload = {
      ...dbForm.value,
      useConnectionString: dbForm.value.useConnStr,
      datacenter: dbForm.value.extra,
      workspace_id: workspaceId
    }
    await $fetch('/api/analyst/db-test', { method: 'POST', body: payload })
    dbTestStatus.value = 'success'
  } catch (e: any) {
    dbTestStatus.value = 'error'
    dbError.value = e?.data?.message || 'Connection failed - check credentials'
    testingDb.value = false
    return
  }
  testingDb.value = false

  // Save
  try {
    const saved = await $fetch<any>('/api/analyst/db-connect', {
      method: 'POST',
      body: { ...dbForm.value, useConnStr: dbForm.value.useConnStr, workspace_id: workspaceId }
    })
    const newDb = { id: saved.id, name: dbForm.value.name, type: dbForm.value.type, status: 'connected', tables: [] }
    dbConnections.value.push(newDb)
    showDbModal.value = false
    dbTestStatus.value = ''
    dbError.value = ''
    dbForm.value = { type: 'postgres', name: '', host: '', port: '', database: '', username: '', password: '', connectionString: '', useConnStr: false, ssl: false, extra: '' }
    // Auto-select and introspect
    await selectDb(newDb)
  } catch (e: any) {
    dbError.value = e?.data?.message || 'Failed to save connection'
    dbTestStatus.value = 'error'
  }
}

function renderChart(id: string, chartData: any) {
  nextTick(() => {
    const canvas = document.getElementById(id) as HTMLCanvasElement
    if (!canvas || !(window as any).Chart) return
    const existing = (window as any).Chart.getChart(canvas)
    if (existing) existing.destroy()
    new (window as any).Chart(canvas, {
      type: chartData.type || 'bar',
      data: chartData,
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: (chartData.type !== 'pie' && chartData.type !== 'doughnut') ? { y: { beginAtZero: true } } : undefined
      }
    })
  })
}

async function deleteDb(id: string) {
  if (!confirm('Remove this database connection?')) return
  // Remove from UI immediately
  dbConnections.value = dbConnections.value.filter(d => d.id !== id)
  if (activeDb.value && activeDb.value.id === id) {
    activeDb.value = null
    dbPreview.value = null
    chatMessages.value = []
  }
  // Remove from localStorage
  try { localStorage.removeItem('analyst_chat_' + workspaceId + '_' + id) } catch {}
  // Delete from server
  try {
    await $fetch('/api/analyst/db-delete', { method: 'POST', body: { connection_id: id } })
  } catch (e: any) {
    console.error('Delete failed:', e?.data?.message)
  }
}

async function loadSavedConnections() {
  try {
    const data = await $fetch<any[]>(`/api/analyst/db-list?workspace_id=${workspaceId}`)
    if (data && data.length) {
      dbConnections.value = data.map((d: any) => ({
        id: d.id,
        name: d.config?.name || d.type,
        type: d.config?.dbType || 'postgres',
        status: d.status,
        tables: d.config?.tables || []
      }))
    }
  } catch {}
}

const user = useSupabaseUser()
const supabase = useSupabaseClient()

function lsKey() {
  return 'analyst_chat_' + workspaceId + '_' + (activeDb.value?.id || 'global')
}

function saveChatToLocalStorage() {
  try {
    const msgs = chatMessages.value.slice(-80).map(m => ({
      id: m.id, role: m.role, content: m.content, time: m.time
    }))
    localStorage.setItem(lsKey(), JSON.stringify(msgs))
  } catch {}
}

function loadChatFromLocalStorage() {
  try {
    const raw = localStorage.getItem(lsKey())
    if (raw) {
      const msgs = JSON.parse(raw)
      if (Array.isArray(msgs) && msgs.length > 0) {
        chatMessages.value = msgs
        nextTick(() => { if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight })
        return true
      }
    }
  } catch {}
  return false
}

async function loadChatHistory() {
  // Show localStorage immediately while server loads
  loadChatFromLocalStorage()
  try {
    const connId = activeDb.value?.id || null
    const url = '/api/analyst/chat-history?workspace_id=' + workspaceId + (connId ? '&connection_id=' + connId : '')
    const data = await $fetch<any[]>(url)
    if (data && data.length > 0) {
      chatMessages.value = data.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user_name: m.users?.full_name || m.users?.email || undefined
      }))
      saveChatToLocalStorage()
    }
    await nextTick()
    if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight
  } catch {}
}

async function saveChatMsg(role: string, content: string, extra: any = {}) {
  try {
    const saved = await $fetch<any>('/api/analyst/chat-save', {
      method: 'POST',
      body: {
        workspace_id: workspaceId,
        connection_id: activeDb.value?.id || null,
        role, content,
        user_id: role === 'user' ? user.value?.id : null,
        metadata: extra
      }
    })
    return saved.id
  } catch { return null }
}

// Reload chat when DB changes
watch(activeDb, () => { loadChatHistory() })

onMounted(() => {
  if (!(window as any).Chart) {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js'
    document.head.appendChild(s)
  }
  loadSavedConnections()
  loadChatHistory()
  watch(activeSource, (src) => {
    if (src) {
      chartConfig.value.x = src.columns[0]
      chartConfig.value.y = numericCols.value[0] || src.columns[1] || ''
    }
  })
})
</script>

<style scoped>
.analyst-page { display: grid; grid-template-columns: 200px 1fr; height: 100%; overflow: hidden; background: var(--bg); transition: grid-template-columns .2s; }
.analyst-page.has-chat { grid-template-columns: 200px 1fr 300px; }

/* Sources panel */
.sources-panel { border-right: 1px solid var(--border); background: var(--surface); overflow-y: auto; display: flex; flex-direction: column; padding-bottom: 12px; }
.section-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-3); }
.btn-sm-icon { background: none; border: none; cursor: pointer; color: var(--text-3); padding: 2px 6px; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
.btn-sm-icon:hover { color: var(--accent); background: var(--surface-2); }
.btn-sm-icon input { display: none; }
.empty-sources { padding: 4px 12px 8px; }
.empty-sources p { font-size: 11px; color: var(--text-3); margin: 0; line-height: 1.5; }
.source-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; cursor: pointer; border-radius: 8px; margin: 0 6px 3px; transition: all .15s; border: 1px solid transparent; }
.source-item:hover  { background: var(--surface-2); border-color: var(--border); }
.source-item.active { background: var(--accent-soft); border-color: var(--accent-border); }
.src-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.src-dot.csv, .src-dot.json { background: var(--green); }
.src-dot.excel      { background: var(--agent-research); }
.src-dot.postgres, .src-dot.supabase { background: #336791; }
.src-dot.mysql, .src-dot.mariadb { background: #00618a; }
.src-dot.cassandra, .src-dot.scylla { background: #1287b1; }
.src-dot.mongodb    { background: var(--agent-analyst); }
.src-dot.redis      { background: var(--red); }
.src-dot.clickhouse { background: var(--amber); }
.src-dot.snowflake  { background: #29b5e8; }
.src-dot.bigquery   { background: var(--agent-research); }
.src-dot.sqlite, .src-dot.duckdb { background: var(--text-3); }
.src-dot.turso      { background: var(--accent); }
.db-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.db-dot.connected { background: var(--green); }
.db-dot.error     { background: var(--red); }
.db-dot.untested  { background: var(--border); }
.source-info { flex: 1; min-width: 0; }
.source-name { font-size: 11px; font-weight: 500; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.source-meta { font-size: 10px; color: var(--text-3); }
.src-del {
  width: 22px; height: 22px; flex-shrink: 0;
  background: none; border: none; cursor: pointer;
  border-radius: 5px; display: flex; align-items: center; justify-content: center;
  color: var(--text-3); opacity: 0; transition: all .13s;
}
.source-item:hover .src-del { opacity: 1; }
.src-del:hover { color: var(--red-text) !important; background: var(--red-soft) !important; opacity: 1 !important; }

.btn-sample { margin: 6px 10px; padding: 6px 10px; background: var(--surface-2); border: 1px dashed var(--border); border-radius: 6px; font-size: 11px; color: var(--text-3); cursor: pointer; text-align: left; transition: all .15s; }
.btn-sample:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }

/* Main panel */
.main-panel { display: flex; flex-direction: column; overflow: hidden; }
.tab-bar { display: flex; align-items: center; padding: 0 14px; border-bottom: 1px solid var(--border); background: var(--surface); flex-shrink: 0; gap: 2px; }
.tab { padding: 10px 14px; font-size: 13px; color: var(--text-3); background: none; border: none; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all .15s; }
.tab:hover  { color: var(--text-1); }
.tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 500; }
.tab-spacer { flex: 1; }
.active-label { font-size: 11px; color: var(--text-3); }
.tab-content { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.question-bar { padding: 10px 14px; background: var(--surface); border-bottom: 1px solid var(--border-soft); flex-shrink: 0; }
.q-wrap { display: flex; gap: 6px; margin-bottom: 7px; }
.q-input { flex: 1; padding: 8px 12px; border: 1.5px solid var(--border); border-radius: 8px; font-size: 13px; font-family: inherit; background: var(--surface); color: var(--text-1); outline: none; transition: border-color .15s; }
.q-input:focus { border-color: var(--accent); }
.q-input::placeholder { color: var(--text-3); }
.btn-go { padding: 8px 16px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: background .15s; }
.btn-go:not(:disabled):hover { background: var(--accent-hover); }
.btn-go:disabled { opacity: 0.4; cursor: not-allowed; }
.quick-pills { display: flex; gap: 5px; flex-wrap: wrap; }
.pill { font-size: 11px; padding: 3px 9px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 20px; color: var(--text-2); cursor: pointer; transition: all .15s; }
.pill:hover { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); }
.preview-area { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.preview-bar { display: flex; justify-content: space-between; padding: 8px 14px; font-size: 12px; font-weight: 500; color: var(--text-1); border-bottom: 1px solid var(--border-soft); background: var(--surface); flex-shrink: 0; }
.dim { color: var(--text-3); font-weight: 400; }
.table-wrap { flex: 1; overflow: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.data-table th { padding: 7px 12px; text-align: left; font-weight: 600; color: var(--text-3); font-size: 10px; text-transform: uppercase; letter-spacing: .05em; background: var(--surface); position: sticky; top: 0; border-bottom: 1px solid var(--border); white-space: nowrap; }
.data-table td { padding: 6px 12px; border-bottom: 1px solid var(--border-soft); color: var(--text-1); white-space: nowrap; }
.data-table tr:hover td { background: var(--surface-2); }
.db-view { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.db-loading { display: flex; align-items: center; gap: 10px; padding: 30px; color: var(--text-3); font-size: 13px; }
.db-error-state { padding: 30px; display: flex; flex-direction: column; gap: 8px; }
.db-err-title { font-size: 14px; font-weight: 500; color: var(--red-text); }
.db-err-msg   { font-size: 13px; color: var(--text-2); }
.btn-retry { padding: 6px 14px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; font-size: 12px; cursor: pointer; color: var(--text-2); }
.btn-retry:hover { background: var(--surface-3); }
.db-status-bar { display: flex; align-items: center; gap: 10px; padding: 8px 14px; background: var(--green-soft); border-bottom: 1px solid #bbf7d0; flex-shrink: 0; }
.db-connected-badge { font-size: 11px; font-weight: 600; color: var(--green-text); background: #d1fae5; padding: 2px 8px; border-radius: 10px; }
.db-two-col { display: grid; grid-template-columns: 200px 1fr; flex: 1; overflow: hidden; }
.db-tables-list { border-right: 1px solid var(--border-soft); overflow-y: auto; padding: 8px 0; }
.db-tables-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--text-3); padding: 4px 12px 6px; }
.db-table-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; cursor: pointer; font-size: 12px; color: var(--text-1); }
.db-table-row:hover { background: var(--surface-2); color: var(--accent); }
.db-preview-table { display: flex; flex-direction: column; overflow: hidden; padding: 8px 0 0; }
.insights-feed { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.insight-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.ins-header { display: flex; align-items: center; gap: 8px; padding: 9px 12px; background: var(--surface-2); border-bottom: 1px solid var(--border-soft); }
.ins-q { flex: 1; font-size: 12px; font-weight: 500; color: var(--text-1); }
.ins-actions { display: flex; gap: 4px; }
.icon-btn { background: none; border: none; cursor: pointer; color: var(--text-3); font-size: 11px; padding: 2px 6px; border-radius: 4px; }
.icon-btn:hover { background: var(--surface-3); color: var(--text-1); }
.chart-wrap { padding: 12px 14px; border-bottom: 1px solid var(--border-soft); }
.ins-answer { padding: 10px 14px; font-size: 13px; line-height: 1.7; color: var(--text-1); }
.ins-answer :deep(strong) { font-weight: 600; }
.ins-answer :deep(code) { background: var(--surface-2); padding: 1px 5px; border-radius: 4px; font-size: 11px; font-family: var(--mono); }
.ins-answer :deep(h3), .ins-answer :deep(h4) { font-size: 13px; font-weight: 600; margin: 8px 0 3px; }
.ins-answer :deep(li) { margin-left: 14px; list-style: disc; }
.metrics-row { display: flex; gap: 8px; padding: 0 12px 12px; flex-wrap: wrap; }
.metric-chip { background: var(--surface-2); border: 1px solid var(--border); border-radius: 7px; padding: 6px 10px; }
.m-val { font-size: 16px; font-weight: 700; color: var(--text-1); line-height: 1; }
.m-label { font-size: 10px; color: var(--text-3); margin-top: 2px; }
.empty-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; }
.empty-main h2 { font-size: 18px; font-weight: 600; color: var(--text-1); margin: 0 0 8px; }
.empty-main p  { font-size: 13px; color: var(--text-2); margin: 0; }

/* SQL tab */
.sql-tab { display: flex; flex-direction: column; }
.sql-editor-wrap { border-bottom: 1px solid var(--border); flex-shrink: 0; }
.sql-toolbar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--surface-2); border-bottom: 1px solid var(--border-soft); }
.btn-run-sql { padding: 5px 12px; background: var(--green-soft); color: var(--green-text); border: 1px solid #bbf7d0; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.btn-run-sql:disabled { opacity: 0.4; }
.btn-gen-sql { padding: 5px 10px; background: var(--surface-3); border: none; border-radius: 6px; font-size: 12px; color: var(--text-2); cursor: pointer; }
.btn-gen-sql:hover { background: var(--accent-soft); color: var(--accent); }
.sql-textarea { width: 100%; min-height: 100px; padding: 12px 14px; font-family: var(--mono); font-size: 13px; border: none; resize: vertical; color: var(--text-1); background: var(--surface); box-sizing: border-box; }
.sql-textarea:focus { outline: none; }
.sql-textarea::placeholder { color: var(--text-3); }
.sql-result { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.sql-result-bar { display: flex; align-items: center; gap: 10px; padding: 7px 12px; font-size: 12px; color: var(--text-2); background: var(--surface-2); border-bottom: 1px solid var(--border-soft); flex-shrink: 0; }
.btn-export-sql { margin-left: auto; padding: 4px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 5px; font-size: 11px; cursor: pointer; color: var(--text-2); }
.limit-wrap { display: flex; align-items: center; gap: 5px; font-size: 12px; }
.limit-select { padding: 3px 6px; border: 1px solid var(--border); border-radius: 5px; font-size: 12px; background: var(--surface); color: var(--text-1); }
.write-badge    { font-size: 11px; font-weight: 600; color: var(--green-text); background: var(--green-soft); padding: 2px 8px; border-radius: 10px; }
.truncated-warn { font-size: 11px; color: var(--amber-text); background: var(--amber-soft); padding: 2px 8px; border-radius: 10px; }
.write-confirm-banner { background: var(--amber-soft); border-bottom: 1px solid #fcd34d; padding: 12px 14px; flex-shrink: 0; }
.write-confirm-msg { font-size: 13px; font-weight: 500; color: var(--amber-text); margin-bottom: 6px; }
.write-confirm-sql { font-size: 11px; font-family: var(--mono); color: var(--text-1); background: var(--surface); border: 1px solid var(--border); border-radius: 5px; padding: 6px 10px; margin-bottom: 10px; white-space: pre-wrap; max-height: 60px; overflow-y: auto; }
.write-confirm-btns { display: flex; gap: 8px; }
.btn-cancel-write { padding: 5px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; font-size: 12px; cursor: pointer; color: var(--text-1); }
.btn-confirm-write { padding: 5px 14px; background: var(--red); color: #fff; border: none; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; }
.sql-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: var(--text-3); font-size: 13px; padding: 30px; }
.sql-examples { display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 480px; }
.sql-ex-btn { padding: 7px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; font-size: 11px; font-family: var(--mono); color: var(--text-1); cursor: pointer; text-align: left; transition: all .15s; }
.sql-ex-btn:hover { border-color: var(--accent); background: var(--accent-soft); }

/* Charts tab */
.charts-tab { display: flex; flex-direction: row; overflow: hidden; }
.chart-builder { display: flex; flex: 1; overflow: hidden; }
.chart-controls { width: 200px; border-right: 1px solid var(--border); padding: 14px; overflow-y: auto; flex-shrink: 0; display: flex; flex-direction: column; gap: 14px; background: var(--surface); }
.ctrl-group { display: flex; flex-direction: column; gap: 6px; }
.ctrl-group label { font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: .04em; }
.chart-type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
.chart-type-btn { padding: 6px 4px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; font-size: 11px; color: var(--text-2); cursor: pointer; text-align: center; transition: all .15s; }
.chart-type-btn.active { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); }
.ctrl-select { padding: 6px 8px; border: 1.5px solid var(--border); border-radius: 6px; font-size: 12px; font-family: inherit; background: var(--surface); color: var(--text-1); outline: none; }
.ctrl-select:focus { border-color: var(--accent); }
.btn-build-chart { padding: 8px; background: var(--accent); color: #fff; border: none; border-radius: 7px; font-size: 13px; font-weight: 500; cursor: pointer; margin-top: auto; transition: background .15s; }
.btn-build-chart:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-build-chart:not(:disabled):hover { background: var(--accent-hover); }
.chart-preview { flex: 1; padding: 20px; position: relative; display: flex; align-items: center; justify-content: center; }
.chart-placeholder { position: absolute; font-size: 13px; color: var(--text-3); }

/* Summary tab */
.summary-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
.btn-gen-summary { padding: 10px 22px; background: var(--accent); color: #fff; border: none; border-radius: 9px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background .15s; }
.btn-gen-summary:not(:disabled):hover { background: var(--accent-hover); }
.btn-gen-summary:disabled { opacity: 0.5; cursor: not-allowed; }
.summary-empty p { font-size: 13px; color: var(--text-3); max-width: 280px; text-align: center; line-height: 1.6; }
.summary-content { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.summary-toolbar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: var(--surface); border-bottom: 1px solid var(--border-soft); flex-shrink: 0; }
.summary-title { font-size: 13px; font-weight: 500; flex: 1; color: var(--text-1); }
.btn-export-report { padding: 5px 12px; background: var(--accent); color: #fff; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
.summary-body { flex: 1; overflow-y: auto; padding: 20px; font-size: 13px; line-height: 1.8; color: var(--text-1); }
.summary-body :deep(h2) { font-size: 16px; font-weight: 600; margin: 18px 0 8px; }
.summary-body :deep(h3), .summary-body :deep(h4) { font-size: 14px; font-weight: 600; margin: 12px 0 6px; }
.summary-body :deep(strong) { font-weight: 600; }
.summary-body :deep(li) { margin-left: 16px; list-style: disc; }

/* Chat panel */
.chat-panel { border-left: 1px solid var(--border); display: flex; flex-direction: column; background: var(--surface); overflow: hidden; }
.chat-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text-2); border-bottom: 1px solid var(--border-soft); flex-shrink: 0; background: var(--surface); }
.chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 14px; min-height: 0; scroll-behavior: smooth; }
.chat-empty p { font-size: 12px; color: var(--text-3); line-height: 1.5; text-align: center; padding: 20px; margin: 0; }
.chat-msg { display: flex; flex-direction: column; gap: 3px; }
.chat-msg.user      { align-items: flex-end; }
.chat-msg.assistant { align-items: flex-start; }
.msg-bubble { padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.68; max-width: 90%; }
.chat-msg.user      .msg-bubble { background: linear-gradient(135deg, #4f46e5, #6d28d9); color: #fff; border-radius: 12px 12px 4px 12px; box-shadow: 0 2px 8px rgba(79,70,229,.2); }
.chat-msg.assistant .msg-bubble { background: var(--surface-2); color: var(--text-1); border-radius: 12px 12px 12px 4px; border: 1px solid var(--border-soft); }
.msg-bubble :deep(strong) { font-weight: 600; }
.msg-name { font-size: 10px; font-weight: 600; color: var(--accent); margin-bottom: 2px; padding-left: 2px; }
.write-confirm-inline { background: var(--amber-soft); border: 1px solid #fcd34d; border-radius: 8px; padding: 10px 12px; margin-top: 6px; display: flex; flex-direction: column; gap: 7px; }
.wci-header { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: #92400e; }
.wci-label { font-size: 11px; font-weight: 600; color: var(--amber-text); }
.wci-sql { display: block; font-size: 11px; font-family: var(--mono); background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 5px 8px; white-space: pre-wrap; color: var(--text-1); }
.wci-btns { display: flex; gap: 6px; }
.wci-cancel  { padding: 4px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 5px; font-size: 11px; cursor: pointer; color: var(--text-1); }
.wci-confirm { padding: 5px 14px; background: #b45309; color: #fff; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; transition: background .15s; }
.wci-confirm:hover { background: #92400e; }
.wci-cancel { padding: 5px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 6px; font-size: 11px; cursor: pointer; color: var(--text-1); }
.msg-bubble.thinking { display: flex; gap: 5px; align-items: center; padding: 12px 16px; }
.msg-bubble.thinking span { width: 5px; height: 5px; background: var(--text-3); border-radius: 50%; animation: bounce 1.2s infinite; }
.msg-bubble.thinking span:nth-child(2) { animation-delay: .2s; }
.msg-bubble.thinking span:nth-child(3) { animation-delay: .4s; }
@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }
.msg-time { font-size: 10px; color: var(--text-3); }
.chat-input-wrap { border-top: 1px solid var(--border-soft); padding: 10px 12px; display: flex; gap: 8px; flex-shrink: 0; background: var(--surface); align-items: flex-end; }
.chat-input { flex: 1; resize: none; font-size: 13px; border: 1.5px solid var(--border); border-radius: 10px; padding: 10px 12px; font-family: inherit; line-height: 1.5; min-height: 56px; background: var(--surface); color: var(--text-1); outline: none; transition: border-color .15s; }
.chat-input:focus { border-color: var(--accent); }
.chat-input::placeholder { color: var(--text-3); }
.btn-send-chat { padding: 8px 16px; background: linear-gradient(135deg, #4f46e5, #6d28d9); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 600; align-self: flex-end; transition: all .15s; box-shadow: 0 2px 8px rgba(79,70,229,.25); }
.btn-send-chat:not(:disabled):hover { background: var(--accent-hover); }
.btn-send-chat:disabled { opacity: 0.4; cursor: not-allowed; }

/* DB Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); width: 480px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); }
.modal-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border); font-weight: 500; font-size: 14px; color: var(--text-1); }
.modal-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }
.db-type-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
.db-type-btn { padding: 6px 4px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; font-size: 11px; cursor: pointer; color: var(--text-2); text-align: center; transition: all .15s; }
.db-type-btn.active { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); font-weight: 500; }
.field { display: flex; flex-direction: column; gap: 4px; }
.field.sm { max-width: 90px; }
.field-row { display: flex; gap: 10px; }
.field label { font-size: 12px; font-weight: 500; color: var(--text-2); }
.field input { padding: 8px 10px; border: 1.5px solid var(--border); border-radius: 7px; font-size: 13px; font-family: inherit; background: var(--surface); color: var(--text-1); outline: none; }
.field input:focus { border-color: var(--accent); }
.field-error { font-size: 12px; color: var(--red-text); background: var(--red-soft); padding: 8px 10px; border-radius: 6px; }
.field-testing { font-size: 12px; color: var(--accent); background: var(--accent-soft); padding: 8px 10px; border-radius: 6px; }
.field-success { font-size: 12px; color: var(--green-text); background: var(--green-soft); padding: 8px 10px; border-radius: 6px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 18px; border-top: 1px solid var(--border); }
.btn-cancel { padding: 7px 14px; border: 1.5px solid var(--border); border-radius: 7px; background: var(--surface); color: var(--text-1); cursor: pointer; font-size: 13px; }
.btn-save-db { padding: 7px 16px; background: var(--accent); color: #fff; border: none; border-radius: 7px; cursor: pointer; font-size: 13px; font-weight: 500; }
.btn-save-db:disabled { opacity: 0.4; }
.conn-mode-toggle { display: flex; border: 1.5px solid var(--border); border-radius: 7px; overflow: hidden; }
.mode-opt { flex: 1; padding: 6px; font-size: 12px; border: none; background: var(--surface); cursor: pointer; color: var(--text-2); transition: all .15s; }
.mode-opt.active { background: var(--accent-soft); color: var(--accent); font-weight: 500; }
.req { color: var(--red); }
.opt { font-size: 10px; color: var(--text-3); font-weight: 400; text-transform: none; letter-spacing: 0; }
.field-hint { font-size: 11px; color: var(--text-3); }
.ssl-toggle { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text-2); cursor: pointer; }
.ssl-toggle input { cursor: pointer; accent-color: var(--accent); }
.spinner { width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin .7s linear infinite; }
.spinner.dark { border-color: var(--border); border-top-color: var(--text-2); }
@keyframes spin { to { transform: rotate(360deg); } }
/* SQL error notification */
.sql-error-bar {
  position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 900;
  display: flex; align-items: center; gap: 10px;
  padding: 11px 16px; border-radius: 10px; max-width: 480px; width: max-content;
  background: rgba(239,68,68,.95); color: #fff; font-size: 13px; font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,.25); border: 1px solid rgba(255,255,255,.15);
}
.sql-error-close { background: none; border: none; color: rgba(255,255,255,.7); cursor: pointer; padding: 0; display: flex; flex-shrink: 0; }
.sql-error-close:hover { color: #fff; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity .2s, transform .2s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(6px); }

</style>