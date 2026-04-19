<template>
  <div class="page-shell">
    <div class="page-header">
      <div>
        <h1>Analytics</h1>
        <p>Task completion, agent performance, and activity over time</p>
      </div>
      <select v-model="days" class="input select-sm" @change="load">
        <option :value="7">Last 7 days</option>
        <option :value="30">Last 30 days</option>
        <option :value="90">Last 90 days</option>
      </select>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner spinner-dark" />
      <span>Loading analytics…</span>
    </div>

    <template v-else-if="stats">
      <div class="stat-row">
        <div class="stat-card">
          <div class="stat-val">{{ stats.summary.totalTasks }}</div>
          <div class="stat-label">Total tasks</div>
        </div>
        <div class="stat-card highlight">
          <div class="stat-val">{{ stats.summary.completionRate }}<span class="stat-unit">%</span></div>
          <div class="stat-label">Completion rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ stats.summary.totalMeetings }}</div>
          <div class="stat-label">Meetings</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ stats.summary.totalAgentRuns }}</div>
          <div class="stat-label">Agent runs</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">{{ avgTime }}</div>
          <div class="stat-label">Avg run time</div>
        </div>
      </div>

      <div class="analytics-grid">
        <div class="a-card wide">
          <div class="a-card-head">Task activity — last {{ days }} days</div>
          <div class="bar-chart">
            <div v-for="(count, day) in stats.tasksByDay" :key="String(day)" class="bar-col" :title="`${day}: ${count}`">
              <div class="bar-fill" :style="{ height: barH(Number(count)) + '%' }" />
              <div class="bar-lbl">{{ shortDay(String(day)) }}</div>
            </div>
          </div>
        </div>

        <div class="a-card">
          <div class="a-card-head">By status</div>
          <div class="dist-list">
            <div v-for="(count, status) in stats.tasksByStatus" :key="String(status)" class="dist-row">
              <div class="dist-dot" :class="`status-dot-${status}`" />
              <span class="dist-label">{{ statusLabel(String(status)) }}</span>
              <div class="dist-bar-wrap">
                <div class="dist-bar" :class="`dist-${status}`" :style="{ width: pct(Number(count), stats.summary.totalTasks) + '%' }" />
              </div>
              <span class="dist-count">{{ count }}</span>
            </div>
          </div>
        </div>

        <div class="a-card">
          <div class="a-card-head">By agent</div>
          <div class="dist-list">
            <div v-for="(count, agent) in stats.tasksByAgent" :key="String(agent)" class="dist-row">
              <div class="dist-dot" :class="`agent-dot-${agent}`" />
              <span class="dist-label" style="text-transform:capitalize">{{ agent }}</span>
              <div class="dist-bar-wrap">
                <div class="agent-bar" :class="`agent-${agent}`" :style="{ width: pct(Number(count), stats.summary.totalTasks) + '%' }" />
              </div>
              <span class="dist-count">{{ count }}</span>
            </div>
          </div>
        </div>

        <div class="a-card wide">
          <div class="a-card-head">Agent performance</div>
          <table class="perf-table">
            <thead>
              <tr>
                <th>Agent</th><th>Runs</th><th>Completed</th><th>Success rate</th><th>Avg time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!Object.keys(stats.agentPerf).length">
                <td colspan="5" class="no-data">No agent runs yet</td>
              </tr>
              <tr v-for="(data, agent) in stats.agentPerf" :key="String(agent)">
                <td><span class="badge" :class="`agent-${agent}`">{{ agent }}</span></td>
                <td>{{ data.runs }}</td>
                <td>{{ data.completed }}</td>
                <td>
                  <div class="success-bar-wrap">
                    <div class="success-track">
                      <div class="success-fill" :style="{ width: (data.runs > 0 ? (data.completed/data.runs)*100 : 0) + '%' }" />
                    </div>
                    <span>{{ data.runs > 0 ? Math.round((data.completed/data.runs)*100) : 0 }}%</span>
                  </div>
                </td>
                <td class="perf-time">{{ data.avgMs > 0 ? (data.avgMs < 60000 ? Math.round(data.avgMs/1000) + 's' : Math.round(data.avgMs/60000) + 'm') : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
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
  needs_clarification: 'Question', completed: 'Done', cancelled: 'Cancelled'
}
function statusLabel(s: string) { return statusLabels[s] || s }
function shortDay(d: string) { return new Date(d + 'T12:00:00').toLocaleDateString([], { weekday: 'short' }).slice(0, 2) }

const maxBar = computed(() => !stats.value ? 1 : Math.max(1, ...Object.values(stats.value.tasksByDay as Record<string, number>)))
function barH(v: number) { return Math.max(2, Math.round((v / maxBar.value) * 100)) }
function pct(v: number, total: number) { return total > 0 ? Math.round((v / total) * 100) : 0 }
const avgTime = computed(() => {
  const ms = stats.value?.summary.avgRunMs || 0
  if (!ms) return '—'
  return ms < 60000 ? `${Math.round(ms/1000)}s` : `${Math.round(ms/60000)}m`
})

async function load() {
  loading.value = true
  stats.value = await $fetch<any>(`/api/analytics?workspace_id=${workspaceId}&days=${days.value}`)
  loading.value = false
}
onMounted(load)
</script>

<style scoped>
.select-sm { padding: 6px 10px; font-size: 13px; width: auto; }

.loading-state { display: flex; align-items: center; gap: 10px; color: var(--text-3); font-size: 13px; padding: 40px 0; }

.stat-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; }
.stat-card.highlight { border-color: var(--accent-border); background: var(--accent-soft); }
.stat-val  { font-size: 28px; font-weight: 700; color: var(--text-1); line-height: 1; }
.stat-unit { font-size: 18px; font-weight: 600; }
.stat-label { font-size: 12px; color: var(--text-2); margin-top: 6px; }

.analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.a-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.a-card.wide { grid-column: span 2; }
.a-card-head { font-size: 13px; font-weight: 600; color: var(--text-1); padding: 14px 18px; border-bottom: 1px solid var(--border-soft); }

.bar-chart { display: flex; align-items: flex-end; gap: 3px; height: 100px; padding: 12px 18px 26px; position: relative; }
.bar-col   { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
.bar-fill  { width: 100%; background: var(--accent); border-radius: 3px 3px 0 0; min-height: 2px; opacity: .75; transition: opacity .15s; }
.bar-col:hover .bar-fill { opacity: 1; }
.bar-lbl   { font-size: 9px; color: var(--text-3); margin-top: 4px; position: absolute; bottom: 8px; }

.dist-list  { padding: 12px 18px; display: flex; flex-direction: column; gap: 10px; }
.dist-row   { display: flex; align-items: center; gap: 8px; }
.dist-dot   { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dist-dot.status-dot-completed          { background: var(--green); }
.dist-dot.status-dot-pending_approval   { background: var(--amber); }
.dist-dot.status-dot-in_progress        { background: var(--accent); }
.dist-dot.status-dot-approved           { background: var(--blue); }
.dist-dot.status-dot-cancelled          { background: var(--border); }
.dist-dot.agent-dot-research            { background: var(--agent-research); }
.dist-dot.agent-dot-writer              { background: var(--agent-writer); }
.dist-dot.agent-dot-analyst             { background: var(--agent-analyst); }
.dist-dot.agent-dot-executor            { background: var(--agent-executor); }
.dist-label  { font-size: 12px; color: var(--text-1); min-width: 72px; }
.dist-bar-wrap { flex: 1; height: 5px; background: var(--surface-2); border-radius: 3px; overflow: hidden; }
.dist-bar    { height: 100%; border-radius: 3px; }
.dist-bar.dist-completed         { background: var(--green); }
.dist-bar.dist-pending_approval  { background: var(--amber); }
.dist-bar.dist-in_progress       { background: var(--accent); }
.dist-bar.dist-approved          { background: var(--blue); }
.dist-bar.dist-cancelled         { background: var(--text-3); }
.agent-bar { height: 100%; border-radius: 3px; }
.agent-bar.agent-research { background: var(--agent-research); }
.agent-bar.agent-writer   { background: var(--agent-writer); }
.agent-bar.agent-analyst  { background: var(--agent-analyst); }
.agent-bar.agent-executor { background: var(--agent-executor); }
.dist-count { font-size: 12px; color: var(--text-2); min-width: 24px; text-align: right; }

.perf-table  { width: 100%; border-collapse: collapse; font-size: 13px; }
.perf-table th { text-align: left; padding: 8px 18px; font-size: 11px; font-weight: 600; color: var(--text-3); text-transform: uppercase; letter-spacing: .05em; border-bottom: 1px solid var(--border-soft); }
.perf-table td { padding: 10px 18px; border-bottom: 1px solid var(--border-soft); color: var(--text-1); }
.perf-table tr:last-child td { border-bottom: none; }
.perf-table tr:hover td { background: var(--surface-2); }
.no-data     { text-align: center; color: var(--text-3); font-style: italic; }
.perf-time   { color: var(--text-2); }
.success-bar-wrap { display: flex; align-items: center; gap: 8px; }
.success-track    { width: 80px; height: 5px; background: var(--surface-2); border-radius: 3px; overflow: hidden; }
.success-fill     { height: 100%; background: var(--green); border-radius: 3px; }
.success-bar-wrap span { font-size: 12px; color: var(--text-2); }
</style>
