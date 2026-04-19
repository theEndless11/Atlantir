import { useSupabaseAdmin } from '~/server/utils/supabase'
import { runAgent } from '~/server/agents/runner'
import type { AgentType } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, task_id, meeting_id, content, sender_id } = body

  if (!workspace_id || !content) {
    throw createError({ statusCode: 400, message: 'workspace_id and content required' })
  }

  const sb = useSupabaseAdmin()

  // Save human message
  const { data: message } = await sb.from('messages').insert({
    workspace_id,
    task_id: task_id || null,
    meeting_id: meeting_id || null,
    sender_id: sender_id || null,
    sender_type: 'human',
    content
  }).select().single()

  // If this is a reply to a task in needs_clarification, re-trigger the agent
  if (task_id) {
    const { data: task } = await sb.from('tasks').select('*').eq('id', task_id).single()

    if (task?.status === 'needs_clarification' && task.assigned_agent) {
      // Move back to approved so runner can proceed
      await sb.from('tasks').update({ status: 'approved' }).eq('id', task_id)

      // Create new run
      const { data: run } = await sb.from('agent_runs').insert({
        task_id,
        agent_type: task.assigned_agent,
        status: 'running',
        input: content
      }).select().single()

      if (run) {
        // Fire and forget — don't await so response returns quickly
        runAgent(task, task.assigned_agent as AgentType, run.id)
          .then(async (output) => {
            await sb.from('artifacts').insert({
              workspace_id,
              task_id,
              agent_run_id: run.id,
              title: task.title,
              type: 'document',
              content: output,
              version: 1
            })
            await sb.from('messages').insert({
              workspace_id,
              task_id,
              sender_type: 'agent',
              agent_type: task.assigned_agent,
              content: output
            })
            await sb.from('tasks').update({ status: 'completed' }).eq('id', task_id)
          })
      }
    }
  }

  return message
})
