import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const workspaceId = query.workspace_id as string
  const days = parseInt(query.days as string) || 30
  if (!workspaceId) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const taskIds = (await sb.from('tasks').select('id').eq('workspace_id', workspaceId))
    .data?.map((t: any) => t.id) || []

  const [tasks, meetings, agentRuns, integrations, databases, fileChunks] = await Promise.all([
    sb.from('tasks').select('id,status,assigned_agent,created_at,updated_at')
      .eq('workspace_id', workspaceId).gte('created_at', since),
    sb.from('meetings').select('id,source,bot_platform,transcript,created_at')
      .eq('workspace_id', workspaceId).gte('created_at', since),
    taskIds.length
      ? sb.from('agent_runs').select('id,agent_type,status,started_at,ended_at')
          .in('task_id', taskIds).gte('started_at', since)
      : { data: [] },
    // CORRECT columns: type, status — no name/enabled column
    sb.from('integrations').select('type,status').eq('workspace_id', workspaceId),
    sb.from('db_connections').select('name,db_type,status').eq('workspace_id', workspaceId),
    sb.from('file_chunks').select('id,embedding').eq('workspace_id', workspaceId),
  ])

  const allTasks    = tasks.data || []
  const allMeetings = meetings.data || []
  const allRuns     = agentRuns.data || []
  const allChunks   = fileChunks.data || []
  const allIntegrations = (integrations.data || []).map((i: any) => ({
    type:   i.type,
    status: i.status || 'connected',
  }))

  const tasksByStatus = allTasks.reduce((acc: any, t: any) => {
    acc[t.status] = (acc[t.status] || 0) + 1; return acc
  }, {})
  const tasksByAgent = allTasks.reduce((acc: any, t: any) => {
    if (t.assigned_agent) acc[t.assigned_agent] = (acc[t.assigned_agent] || 0) + 1; return acc
  }, {})

  const completed      = allTasks.filter((t: any) => t.status === 'completed').length
  const total          = allTasks.length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const completedRuns = allRuns.filter((r: any) => r.status === 'completed' && r.ended_at)
  const avgRunMs = completedRuns.length > 0
    ? completedRuns.reduce((sum: number, r: any) =>
        sum + (new Date(r.ended_at).getTime() - new Date(r.started_at).getTime()), 0) / completedRuns.length
    : 0

  const tasksByDay: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    tasksByDay[d] = 0
  }
  allTasks.forEach((t: any) => {
    const d = t.created_at.slice(0, 10)
    if (tasksByDay[d] !== undefined) tasksByDay[d]++
  })

  const agentPerf: Record<string, { runs: number; completed: number; avgMs: number }> = {}
  allRuns.forEach((r: any) => {
    if (!agentPerf[r.agent_type]) agentPerf[r.agent_type] = { runs: 0, completed: 0, avgMs: 0 }
    agentPerf[r.agent_type].runs++
    if (r.status === 'completed') {
      agentPerf[r.agent_type].completed++
      if (r.ended_at)
        agentPerf[r.agent_type].avgMs += new Date(r.ended_at).getTime() - new Date(r.started_at).getTime()
    }
  })
  Object.values(agentPerf).forEach((p: any) => {
    if (p.completed > 0) p.avgMs = Math.round(p.avgMs / p.completed)
  })

  const embeddedChunks = allChunks.filter((c: any) => c.embedding !== null).length
  const totalFiles = Math.ceil(allChunks.length / 10) || 0

  return {
    summary: {
      totalTasks: total,
      completedTasks: completed,
      completionRate,
      totalMeetings: allMeetings.length,
      totalAgentRuns: allRuns.length,
      avgRunMs: Math.round(avgRunMs),
      totalVoiceSessions: allMeetings.filter((m: any) => m.source === 'voice' || m.bot_platform).length,
      totalEmbeddings: embeddedChunks,
      connectedIntegrations: allIntegrations.filter((i: any) => i.status === 'connected').length,
    },
    tasksByStatus,
    tasksByAgent,
    tasksByDay,
    agentPerf,
    integrations: allIntegrations,
    databases: databases.data || [],
    rag: {
      totalFiles,
      totalChunks: allChunks.length,
      embeddedChunks,
    },
  }
})