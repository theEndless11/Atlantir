import { useSupabaseAdmin } from '~/server/utils/supabase'
import { runPipeline } from '~/server/agents/pipeline'
import type { Task } from '~/types'

// Replace {{variable}} placeholders with provided values
function injectVars(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workflow_id, triggered_by = 'manual', variables = {}, context = '' } = body
  if (!workflow_id) throw createError({ statusCode: 400, message: 'workflow_id required' })

  const sb = useSupabaseAdmin()

  const { data: workflow } = await sb
    .from('workflows')
    .select('*')
    .eq('id', workflow_id)
    .single()

  if (!workflow) throw createError({ statusCode: 404, message: 'Workflow not found' })

  // Create run record
  const { data: run } = await sb
    .from('workflow_runs')
    .insert({
      workflow_id,
      workspace_id: workflow.workspace_id,
      status: 'running',
      triggered_by,
      variables,
    })
    .select()
    .single()

  const steps = workflow.steps as any[]
  const createdTasks: any[] = []

  // Run steps sequentially, passing previous output as context
  let previousOutput = context // seed with transcript or caller-provided context

  for (const step of steps) {
    const title = injectVars(step.task_title, variables)
    const baseDesc = injectVars(step.task_description || '', variables)

    // Chain: prepend previous step's output so each agent builds on it
    const description = previousOutput
      ? `${baseDesc}\n\nContext from previous step:\n${previousOutput.slice(0, 1500)}`
      : baseDesc

    const { data: task } = await sb.from('tasks').insert({
      workspace_id: workflow.workspace_id,
      title,
      description,
      assigned_agent: step.agent,
      priority: step.priority || 'medium',
      status: 'approved', // skip approval queue — workflows are pre-approved
      approved_at: new Date().toISOString(),
    }).select().single()

    if (!task) continue
    createdTasks.push(task)

    // Run pipeline synchronously so next step gets this output
    try {
      await sb.from('tasks').update({ status: 'in_progress' }).eq('id', task.id)

      const output = await runPipeline(task as Task)
      previousOutput = output

      // Save artifact
      await sb.from('artifacts').insert({
        workspace_id: task.workspace_id,
        task_id: task.id,
        title: task.title,
        type: task.assigned_agent === 'research' ? 'research'
          : task.assigned_agent === 'writer' ? 'document' : 'other',
        content: output,
        version: 1,
      })

      await sb.from('tasks').update({ status: 'completed' }).eq('id', task.id)
    } catch (err: any) {
      await sb.from('tasks').update({ status: 'approved' }).eq('id', task.id)
      previousOutput = '' // don't chain broken output
    }
  }

  // Update run record
  await sb.from('workflow_runs').update({
    status: 'completed',
    tasks_created: createdTasks.length,
    final_output: previousOutput?.slice(0, 5000) || '',
    ended_at: new Date().toISOString(),
  }).eq('id', run!.id)

  await sb.from('workflows').update({
    run_count: (workflow.run_count || 0) + 1,
    last_run_at: new Date().toISOString(),
  }).eq('id', workflow_id)

  return { tasks: createdTasks, run, final_output: previousOutput }
})