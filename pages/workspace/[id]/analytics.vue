<template>
  <div class="page-shell">
  <div class="a-inner">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Analytics</h1>
        <p>Resource usage across models, agents, and integrations</p>
      </div>
      <select v-model="days" class="select" @change="load">
        <option :value="7">Last 7 days</option>
        <option :value="30">Last 30 days</option>
        <option :value="90">Last 90 days</option>
      </select>
    </div>

    <div v-if="loading" class="a-loading">
      <div class="spinner spinner-dark" /><span>Loading…</span>
    </div>

    <template v-else-if="stats">

      <!-- ── Overview ── -->
      <div class="section-label a-label">Overview</div>
      <div class="a-group">
        <div class="a-row">
          <span class="a-key">LLM calls</span>
          <span class="a-val">{{ stats.summary.totalAgentRuns }}</span>
        </div>
        <div class="a-row">
          <span class="a-key">Meetings transcribed</span>
          <span class="a-val">{{ stats.summary.totalMeetings }}</span>
        </div>
        <div class="a-row">
          <span class="a-key">Chunks embedded</span>
          <span class="a-val">{{ stats.summary.totalEmbeddings }}</span>
        </div>
        <div class="a-row">
          <span class="a-key">Tasks created</span>
          <span class="a-val">{{ stats.summary.totalTasks }}</span>
        </div>
        <div class="a-row">
          <span class="a-key">Completion rate</span>
          <span class="a-val">{{ stats.summary.completionRate }}%</span>
        </div>
        <div class="a-row">
          <span class="a-key">Avg run time</span>
          <span class="a-val">{{ avgTime }}</span>
        </div>
      </div>

      <!-- ── AI Models ── -->
      <div class="section-label a-label">AI Models</div>
      <div class="a-group">
        <div class="a-row a-model-row">
          <span class="a-key a-model-name"><span class="mtag mtag-llm">LLM</span>Gemini 2.5 Flash Lite</span>
          <span class="a-model-meta">Google · OpenRouter</span>
          <span class="a-model-use">Agent tasks, voice, orchestration</span>
          <span class="a-val">
            <span class="a-usage-bar"><span class="a-usage-fill" :style="{ width: usagePct(stats.summary.totalAgentRuns, maxUsage) + '%' }"/></span>
            {{ stats.summary.totalAgentRuns }} calls
          </span>
        </div>
        <div class="a-row a-model-row">
          <span class="a-key a-model-name"><span class="mtag mtag-exec">Exec</span>Claude 3.5 Haiku</span>
          <span class="a-model-meta">Anthropic · OpenRouter</span>
          <span class="a-model-use">Tool use, integrations, queries</span>
          <span class="a-val">
            <span class="a-usage-bar"><span class="a-usage-fill" :style="{ width: usagePct(stats.agentPerf['executor']?.runs || 0, maxUsage) + '%' }"/></span>
            {{ stats.agentPerf['executor']?.runs || 0 }} runs
          </span>
        </div>
        <div class="a-row a-model-row">
          <span class="a-key a-model-name"><span class="mtag mtag-stt">STT</span>Nova-2</span>
          <span class="a-model-meta">Deepgram · WebSocket</span>
          <span class="a-model-use">Meeting transcription, Zoom bot</span>
          <span class="a-val">
            <span class="a-usage-bar"><span class="a-usage-fill" :style="{ width: usagePct(stats.summary.totalMeetings, maxUsage) + '%' }"/></span>
            {{ stats.summary.totalMeetings }} sessions
          </span>
        </div>
        <div class="a-row a-model-row">
          <span class="a-key a-model-name"><span class="mtag mtag-tts">TTS</span>Turbo v2.5 · Rachel</span>
          <span class="a-model-meta">ElevenLabs</span>
          <span class="a-model-use">Voice replies, Zoom bot speech</span>
          <span class="a-val">
            <span class="a-usage-bar"><span class="a-usage-fill" :style="{ width: usagePct(stats.summary.totalVoiceSessions, maxUsage) + '%' }"/></span>
            {{ stats.summary.totalVoiceSessions }} sessions
          </span>
        </div>
        <div class="a-row a-model-row">
          <span class="a-key a-model-name"><span class="mtag mtag-embed">Embed</span>text-embedding-ada-002</span>
          <span class="a-model-meta">OpenAI · OpenRouter</span>
          <span class="a-model-use">RAG indexing, semantic search</span>
          <span class="a-val">
            <span class="a-usage-bar"><span class="a-usage-fill" :style="{ width: usagePct(stats.summary.totalEmbeddings, maxUsage) + '%' }"/></span>
            {{ stats.summary.totalEmbeddings }} chunks
          </span>
        </div>
      </div>

      <!-- ── Task Activity ── -->
      <div class="section-label a-label">
        Task activity
        <span class="a-label-sub">last {{ days }} days</span>
      </div>
      <div class="a-barchart">
        <div class="a-bar-y">
          <span>{{ maxBar }}</span>
          <span>{{ Math.round(maxBar / 2) }}</span>
          <span>0</span>
        </div>
        <div class="a-bars">
          <div
            v-for="(count, day) in stats.tasksByDay"
            :key="String(day)"
            class="a-bar-col"
            :title="`${String(day)}: ${count} tasks`"
          >
            <div class="a-bar-fill" :style="{ height: barH(Number(count)) + '%' }" />
            <div class="a-bar-lbl">{{ shortDay(String(day)) }}</div>
          </div>
        </div>
      </div>

      <!-- ── Task breakdown: status + agents together ── -->
      <div class="section-label a-label">Task breakdown</div>
      <div class="a-breakdown-grid">

        <!-- By status -->
        <div class="a-breakdown-col">
          <div v-if="!Object.keys(stats.tasksByStatus).length" class="a-empty">No tasks yet</div>
          <div v-for="(count, status) in stats.tasksByStatus" :key="String(status)" class="a-breakdown-row">
            <span class="badge" :class="`status-${status}`">{{ statusLabel(String(status)) }}</span>
            <div class="a-bd-right">
              <div class="a-bd-track"><div class="a-bd-fill" :style="{ width: pct(Number(count), stats.summary.totalTasks) + '%' }"/></div>
              <span class="a-bd-count">{{ count }}</span>
            </div>
          </div>
        </div>

        <!-- By agent -->
        <div class="a-breakdown-col">
          <div v-if="!Object.keys(stats.tasksByAgent).length" class="a-empty">No agent runs yet</div>
          <div v-for="(count, agent) in stats.tasksByAgent" :key="String(agent)" class="a-breakdown-row">
            <span class="a-bd-name">
              {{ capitalize(String(agent)) }}
              <span class="a-bd-sub">{{ agentModel(String(agent)) }}</span>
            </span>
            <div class="a-bd-right">
              <div class="a-bd-track"><div class="a-bd-fill" :style="{ width: pct(Number(count), stats.summary.totalTasks) + '%' }"/></div>
              <span class="a-bd-count">{{ count }}</span>
            </div>
          </div>
        </div>

      </div>

    </template>
  </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })
const route = useRoute()
const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string

const stats   = ref<any>(null)
const loading = ref(true)
const days    = ref(30)

const statusLabels: Record<string, string> = {
  pending_approval: 'Pending', approved: 'Approved', in_progress: 'Running',
  needs_clarification: 'Question', completed: 'Done', cancelled: 'Cancelled',
}

function statusLabel(s: string) { return statusLabels[s] || s }
function capitalize(s: string)  { return s.charAt(0).toUpperCase() + s.slice(1) }
function agentModel(a: string)  { return a === 'executor' ? 'Claude 3.5 Haiku' : 'Gemini 2.5 Flash Lite' }

function shortDay(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString([], { weekday: 'short' }).slice(0, 1)
}

const maxBar = computed(() =>
  !stats.value ? 1 : Math.max(1, ...Object.values(stats.value.tasksByDay as Record<string, number>))
)

const maxUsage = computed(() => {
  if (!stats.value) return 1
  return Math.max(1,
    stats.value.summary.totalAgentRuns,
    stats.value.agentPerf['executor']?.runs || 0,
    stats.value.summary.totalMeetings,
    stats.value.summary.totalVoiceSessions,
    stats.value.summary.totalEmbeddings,
  )
})

function barH(v: number) { return Math.max(2, Math.round((v / maxBar.value) * 100)) }
function pct(v: number, total: number) { return total > 0 ? Math.round((v / total) * 100) : 0 }
function usagePct(v: number, max: number) { return max > 0 ? Math.round((v / max) * 100) : 0 }

const avgTime = computed(() => {
  const ms = stats.value?.summary.avgRunMs || 0
  if (!ms) return '—'
  return ms < 60000 ? `${Math.round(ms / 1000)}s` : `${Math.round(ms / 60000)}m`
})
const ragCoverage = computed(() => {
  const r = stats.value?.rag
  if (!r || !r.totalChunks) return 0
  return Math.round((r.embeddedChunks / r.totalChunks) * 100)
})

async function load() {
  loading.value = true
  stats.value = await $fetch<any>(`/api/analytics?workspace_id=${workspaceId}&days=${days.value}`)
  loading.value = false
}
onMounted(load)
</script>

<style scoped>
/* Centered content column */
.a-inner {
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
}

.a-loading { display: flex; align-items: center; gap: 10px; color: var(--text-3); font-size: 13px; padding: 40px 0; }
.a-empty   { font-size: 13px; color: var(--text-3); padding: 8px 0; }

/* Section labels */
.a-label {
  margin-top: 32px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.a-label-sub { font-size: 11px; font-weight: 400; text-transform: none; letter-spacing: 0; color: var(--text-3); }

/* Flat rows — no lines, just spacing */
.a-group { display: flex; flex-direction: column; gap: 0; }

.a-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 0;
}

.a-key {
  font-size: 15px;
  color: var(--text-2);
  flex: 1;
}
.a-val {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-1);
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Models row */
.a-model-row {
  display: grid;
  grid-template-columns: 220px 160px 1fr auto;
  gap: 16px;
  align-items: center;
}
.a-model-name { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 500; color: var(--text-1); white-space: nowrap; }
.a-model-meta { font-size: 13px; color: var(--text-3); }
.a-model-use  { font-size: 13px; color: var(--text-3); }

/* Usage mini-bar next to value */
.a-usage-bar {
  display: inline-block;
  width: 60px;
  height: 3px;
  background: var(--surface-3);
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
}
.a-usage-bar--wide { width: 100px; }
.a-usage-fill {
  height: 100%;
  background: var(--accent);
  opacity: .55;
  border-radius: 2px;
}

/* Model type tags */
.mtag {
  font-size: 9px; font-weight: 700; letter-spacing: .06em;
  text-transform: uppercase; padding: 2px 5px; border-radius: 3px; flex-shrink: 0;
}
.mtag-llm   { background: rgba(124,58,237,.12); color: #a78bfa; }
.mtag-exec  { background: rgba(59,130,246,.12);  color: #93c5fd; }
.mtag-stt   { background: rgba(16,185,129,.12);  color: #34d399; }
.mtag-tts   { background: rgba(245,158,11,.12);  color: #fbbf24; }
.mtag-embed { background: rgba(107,114,128,.12); color: #9ca3af; }

/* Bar chart */
.a-barchart { display: flex; gap: 8px; height: 110px; margin-bottom: 0; }
.a-bar-y    { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; padding-bottom: 18px; flex-shrink: 0; }
.a-bar-y span { font-size: 10px; color: var(--text-3); }
.a-bars     { flex: 1; display: flex; align-items: flex-end; gap: 3px; padding-bottom: 18px; }
.a-bar-col  { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; position: relative; }
.a-bar-fill { width: 100%; background: var(--accent); border-radius: 2px 2px 0 0; min-height: 2px; opacity: .3; transition: opacity .15s; }
.a-bar-col:hover .a-bar-fill { opacity: .65; }
.a-bar-lbl  { font-size: 8px; color: var(--text-3); position: absolute; bottom: -16px; }

/* Task breakdown: 2 columns side by side */
.a-breakdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 0;
}
.a-breakdown-col { display: flex; flex-direction: column; gap: 0; }

.a-breakdown-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0;
}
.a-bd-name { font-size: 15px; color: var(--text-1); display: flex; align-items: baseline; gap: 7px; }
.a-bd-sub  { font-size: 12px; color: var(--text-3); font-weight: 400; }
.a-bd-right{ display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.a-bd-track{ width: 80px; height: 3px; background: var(--surface-3); border-radius: 2px; overflow: hidden; }
.a-bd-fill { height: 100%; background: var(--accent); opacity: .45; border-radius: 2px; }
.a-bd-count{ font-size: 14px; font-weight: 500; color: var(--text-1); min-width: 22px; text-align: right; }
</style>