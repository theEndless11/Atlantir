import { runOrchestrator } from '~/server/agents/orchestrator'
import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { meeting_id, workspace_id, transcript } = body

  if (!workspace_id || !transcript) {
    throw createError({ statusCode: 400, message: 'workspace_id and transcript required' })
  }

  const sb = useSupabaseAdmin()

  // Run orchestrator
  const result = await runOrchestrator(transcript, workspace_id, meeting_id)

  // Insert all tasks as pending_approval
  const taskRows = result.tasks.map(t => ({
    workspace_id,
    meeting_id: meeting_id || null,
    title: t.title,
    description: t.description,
    assigned_agent: t.assigned_agent,
    priority: t.priority || 'medium',
    status: 'pending_approval'
  }))

  const { data: tasks, error } = await sb
    .from('tasks')
    .insert(taskRows)
    .select()

  if (error) throw createError({ statusCode: 500, message: error.message })

  // Update meeting status
  if (meeting_id) {
    await sb.from('meetings').update({ status: 'ended' }).eq('id', meeting_id)
  }

  return { tasks, summary: result.summary }
})
