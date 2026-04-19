import { useSupabaseAdmin } from '~/server/utils/supabase'

// Called by cron: POST /api/workflows/schedule { secret, cadence: 'daily'|'weekly'|'monday' }
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Basic shared secret guard
  if (body.secret !== process.env.CRON_SECRET) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const cadence: string = body.cadence || 'daily'
  const sb = useSupabaseAdmin()

  const { data: workflows } = await sb
    .from('workflows')
    .select('id, workspace_id, name')
    .eq('trigger', 'schedule')
    .eq('schedule_cadence', cadence)
    .eq('enabled', true)

  if (!workflows?.length) return { fired: 0 }

  const results = await Promise.allSettled(
    workflows.map(wf =>
      $fetch('/api/workflows/run', {
        method: 'POST',
        body: {
          workflow_id: wf.id,
          triggered_by: `schedule:${cadence}`,
          variables: { date: new Date().toLocaleDateString(), cadence },
        },
      })
    )
  )

  const fired = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return { fired, failed, cadence }
})