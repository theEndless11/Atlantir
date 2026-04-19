import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const workspaceId = query.workspace_id as string
  const days = parseInt(query.days as string) || 30
  if (!workspaceId) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const [tasks, meetings, agentRuns, events] = await Promise.all([
    sb.from('tasks').select('id,status,assigned_agent,priority,created_at,updated_at')
      .eq('workspace_id', workspaceId).gte('created_at', since),
    sb.from('meetings').select('id,title,status,transcript,created_at,ended_at,source,bot_platform')
      .eq('workspace_id', workspaceId).gte('created_at', since).order('created_at', { ascending: false }),
    sb.from('agent_runs').select('id,agent_type,status,started_at,ended_at')
      .in('task_id', (await sb.from('tasks').select('id').eq('workspace_id', workspaceId)).data?.map(t => t.id) || [])
      .gte('started_at', since),
    sb.from('analytics_events').select('*')
      .eq('workspace_id', workspaceId).gte('created_at', since)
  ])

  const allTasks = tasks.data || []
  const allMeetings = meetings.data || []
  const allRuns = agentRuns.data || []

  // Task stats
  const tasksByStatus = allTasks.reduce((acc: any, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1; return acc
  }, {})

  const tasksByAgent = allTasks.reduce((acc: any, t) => {
    if (t.assigned_agent) acc[t.assigned_agent] = (acc[t.assigned_agent] || 0) + 1; return acc
  }, {})

  // Completion rate
  const completed = allTasks.filter(t => t.status === 'completed').length
  const total = allTasks.length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  // Avg agent run time
  const completedRuns = allRuns.filter(r => r.status === 'completed' && r.ended_at)
  const avgRunMs = completedRuns.length > 0
    ? completedRuns.reduce((sum, r) => {
        return sum + (new Date(r.ended_at!).getTime() - new Date(r.started_at).getTime())
      }, 0) / completedRuns.length
    : 0

  // Tasks by day (last N days)
  const tasksByDay: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    tasksByDay[d] = 0
  }
  allTasks.forEach(t => {
    const d = t.created_at.slice(0, 10)
    if (tasksByDay[d] !== undefined) tasksByDay[d]++
  })

  // Agent performance
  const agentPerf: Record<string, { runs: number, completed: number, avgMs: number }> = {}
  allRuns.forEach(r => {
    if (!agentPerf[r.agent_type]) agentPerf[r.agent_type] = { runs: 0, completed: 0, avgMs: 0 }
    agentPerf[r.agent_type].runs++
    if (r.status === 'completed') {
      agentPerf[r.agent_type].completed++
      if (r.ended_at) {
        agentPerf[r.agent_type].avgMs += new Date(r.ended_at).getTime() - new Date(r.started_at).getTime()
      }
    }
  })
  Object.values(agentPerf).forEach((p: any) => {
    if (p.completed > 0) p.avgMs = Math.round(p.avgMs / p.completed)
  })

  return {
    summary: {
      totalTasks: total,
      completedTasks: completed,
      completionRate,
      totalMeetings: allMeetings.length,
      totalAgentRuns: allRuns.length,
      avgRunMs: Math.round(avgRunMs)
    },
    tasksByStatus,
    tasksByAgent,
    tasksByDay,
    agentPerf,
    recentMeetings: allMeetings.slice(0, 10)
  }
})