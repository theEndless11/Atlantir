<template>
  <div class="page-shell">
    <div class="page-header">
      <div>
        <h1>{{ workspaceName }}</h1>
        <p>{{ today }}</p>
      </div>
      <NuxtLink :to="`/workspace/${workspaceId}/meeting/room`" class="btn btn-danger">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
        Start meeting
      </NuxtLink>
    </div>

    <div class="summary-cards">
      <div class="card stat-card">
        <div class="stat-val">{{ stats?.summary.totalTasks || 0 }}</div>
        <div class="stat-name">Tasks this month</div>
        <div class="stat-sub">{{ stats?.summary.completionRate || 0 }}% completion</div>
      </div>
      <div class="card stat-card accent">
        <div class="stat-val">{{ stats?.summary.completedTasks || 0 }}</div>
        <div class="stat-name">Completed</div>
        <div class="stat-sub">{{ stats?.summary.totalAgentRuns || 0 }} agent runs</div>
      </div>
      <div class="card stat-card">
        <div class="stat-val">{{ stats?.summary.totalMeetings || 0 }}</div>
        <div class="stat-name">Meetings</div>
        <div class="stat-sub">Last 30 days</div>
      </div>
      <div class="card stat-card">
        <div class="stat-val">{{ avgRunTime }}</div>
        <div class="stat-name">Avg agent run</div>
        <div class="stat-sub">per task</div>
      </div>
    </div>

    <div class="dash-grid">
      <div class="card section-card">
        <div class="card-head">
          Active tasks
          <NuxtLink :to="`/workspace/${workspaceId}`" class="see-all">View all →</NuxtLink>
        </div>
        <div v-if="!recentTasks.length" class="empty-small">No active tasks</div>
        <div v-for="task in recentTasks" :key="task.id" class="task-row">
          <span class="task-name">{{ task.title }}</span>
          <span class="badge" :class="`agent-${task.assigned_agent}`">{{ task.assigned_agent || '—' }}</span>
          <span class="badge" :class="`status-${task.status}`">{{ statusLabel(task.status) }}</span>
          <span class="priority-dot" :class="task.priority" />
        </div>
      </div>

      <div class="card section-card">
        <div class="card-head">Task activity</div>
        <div class="bar-chart">
          <div v-for="(count, day) in tasksByDaySlice" :key="day" class="bar-col">
            <div class="bar-fill" :style="{ height: barHeight(count) + '%' }" :title="`${day}: ${count}`" />
            <div class="bar-lbl">{{ shortDay(String(day)) }}</div>
          </div>
        </div>
      </div>

      <div class="card section-card">
        <div class="card-head">Agent usage</div>
        <div v-if="!agentEntries.length" class="empty-small">No agent data yet</div>
        <div v-for="[agent, data] in agentEntries" :key="String(agent)" class="agent-row">
          <span class="badge" :class="`agent-${agent}`">{{ agent }}</span>
          <div class="agent-bar-wrap"><div class="agent-bar-fill" :class="`agent-${agent}`" :style="{ width: agentBarW(data.runs) + '%' }" /></div>
          <span class="agent-runs">{{ data.runs }} runs</span>
        </div>
      </div>

      <div class="card section-card">
        <div class="card-head">
          Recent meetings
          <NuxtLink :to="`/workspace/${workspaceId}/meeting/room`" class="see-all">New →</NuxtLink>
        </div>
        <div v-if="!stats?.recentMeetings?.length" class="empty-small">No meetings yet</div>
        <div v-for="m in stats?.recentMeetings" :key="m.id" class="meeting-row">
          <span class="meeting-dot" :class="m.status" />
          <span class="meeting-title">{{ m.title || 'Meeting' }}</span>
          <span v-if="m.source === 'bot'" class="meeting-badge">bot</span>
          <span class="meeting-date">{{ formatDate(m.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })

const route = useRoute()
const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string
const supabase = useSupabaseClient()

const stats = ref<any>(null)
const recentTasks = ref<any[]>([])
const workspaceName = ref('')
const today = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })

const statusLabels: Record<string, string> = {
  pending_approval: 'Pending', approved: 'Approved', in_progress: 'Running',
  needs_clarification: 'Question', completed: 'Done', cancelled: 'Cancelled'
}
function statusLabel(s: string) { return statusLabels[s] || s }
function formatDate(ts: string) { return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' }) }

const avgRunTime = computed(() => {
  const ms = stats.value?.summary.avgRunMs || 0
  if (!ms) return '—'
  return ms < 60000 ? `${Math.round(ms/1000)}s` : `${Math.round(ms/60000)}m`
})
const tasksByDaySlice = computed(() => {
  const days = stats.value?.tasksByDay || {}
  const keys = Object.keys(days).slice(-14)
  return Object.fromEntries(keys.map(k => [k, days[k]]))
})
const maxBar = computed(() => Math.max(1, ...Object.values(tasksByDaySlice.value as Record<string, number>)))
function barHeight(v: number) { return Math.max(4, Math.round((v / maxBar.value) * 100)) }
function shortDay(d: string) { return new Date(d).toLocaleDateString([], { weekday: 'short' }).slice(0, 2) }
const agentEntries = computed(() => Object.entries(stats.value?.agentPerf || {}).sort((a: any, b: any) => b[1].runs - a[1].runs))
const maxAgentRuns = computed(() => Math.max(1, ...agentEntries.value.map((e: any) => e[1].runs)))
function agentBarW(runs: number) { return Math.round((runs / maxAgentRuns.value) * 100) }

onMounted(async () => {
  const { data: ws } = await supabase.from('workspaces').select('name').eq('id', workspaceId).single()
  if (ws) workspaceName.value = ws.name
  const [statsData, tasksData] = await Promise.all([
    $fetch<any>(`/api/analytics?workspace_id=${workspaceId}&days=30`),
    supabase.from('tasks').select('*').eq('workspace_id', workspaceId)
      .in('status', ['pending_approval', 'approved', 'in_progress', 'needs_clarification'])
      .order('created_at', { ascending: false }).limit(8)
  ])
  stats.value = statsData
  recentTasks.value = tasksData.data || []
})
</script>

<style scoped>
.summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.stat-card { padding: 18px 20px; }
.stat-card.accent { border-color: var(--accent-border); background: var(--accent-soft); }
.stat-val  { font-size: 28px; font-weight: 700; color: var(--text-1); line-height: 1; }
.stat-name { font-size: 13px; font-weight: 500; color: var(--text-1); margin: 6px 0 2px; }
.stat-sub  { font-size: 12px; color: var(--text-3); }
.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.section-card { padding: 0; overflow: hidden; }
.card-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; font-size: 13px; font-weight: 600; color: var(--text-1); border-bottom: 1px solid var(--border-soft); }
.see-all { font-size: 12px; color: var(--accent); font-weight: 400; }
.see-all:hover { text-decoration: underline; }
.empty-small { padding: 20px 18px; font-size: 13px; color: var(--text-3); font-style: italic; }
.task-row { display: flex; align-items: center; gap: 8px; padding: 9px 18px; border-bottom: 1px solid var(--border-soft); }
.task-row:last-child { border-bottom: none; }
.task-name { flex: 1; font-size: 13px; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bar-chart { display: flex; align-items: flex-end; gap: 3px; height: 90px; padding: 12px 18px 28px; position: relative; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; }
.bar-fill { width: 100%; background: var(--accent); border-radius: 3px 3px 0 0; min-height: 2px; transition: height .3s; opacity: .8; }
.bar-lbl  { font-size: 9px; color: var(--text-3); margin-top: 4px; position: absolute; bottom: 10px; }
.agent-row { display: flex; align-items: center; gap: 10px; padding: 9px 18px; border-bottom: 1px solid var(--border-soft); }
.agent-row:last-child { border-bottom: none; }
.agent-bar-wrap { flex: 1; height: 5px; background: var(--surface-2); border-radius: 3px; overflow: hidden; }
.agent-bar-fill { height: 100%; border-radius: 3px; }
.agent-bar-fill.agent-research { background: var(--agent-research); }
.agent-bar-fill.agent-writer   { background: var(--agent-writer); }
.agent-bar-fill.agent-analyst  { background: var(--agent-analyst); }
.agent-bar-fill.agent-executor { background: var(--agent-executor); }
.agent-runs { font-size: 12px; color: var(--text-2); min-width: 52px; text-align: right; }
.meeting-row { display: flex; align-items: center; gap: 8px; padding: 9px 18px; border-bottom: 1px solid var(--border-soft); }
.meeting-row:last-child { border-bottom: none; }
.meeting-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); flex-shrink: 0; }
.meeting-dot.ended    { background: var(--green); }
.meeting-dot.live     { background: var(--red); animation: pulse-dot 1.5s infinite; }
.meeting-dot.scheduled { background: var(--accent); }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
.meeting-title  { font-size: 13px; color: var(--text-1); flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.meeting-badge  { font-size: 10px; padding: 1px 6px; border-radius: 99px; background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-border); flex-shrink: 0; font-weight: 600; }
.meeting-date   { font-size: 11px; color: var(--text-3); flex-shrink: 0; }
.meeting-status { font-size: 11px; color: var(--text-3); text-transform: capitalize; }
</style>