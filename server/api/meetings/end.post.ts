import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { meeting_id, transcript, bot_session_id, bot_platform, bot_transcript } = body

  if (!meeting_id) {
    throw createError({ statusCode: 400, message: 'meeting_id required' })
  }

  const sb = useSupabaseAdmin()

  const updatePayload: Record<string, any> = {
    status:   'ended',
    ended_at: new Date().toISOString(),
  }
  if (transcript   !== undefined) updatePayload.transcript     = transcript
  if (bot_session_id)             updatePayload.bot_session_id = bot_session_id
  if (bot_platform)               updatePayload.bot_platform   = bot_platform
  if (bot_transcript)             updatePayload.bot_transcript = bot_transcript

  const { data: meeting, error } = await sb
    .from('meetings')
    .update(updatePayload)
    .eq('id', meeting_id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  // Fire all meeting_end workflows for this workspace in background
  const workspaceId = meeting.workspace_id

  if (workspaceId && transcript) {
    sb.from('workflows')
      .select('id')
      .eq('workspace_id', workspaceId)
      .eq('trigger', 'meeting_end')
      .eq('enabled', true)
      .then(async ({ data: workflows, error }) => {
        if (error || !workflows?.length) return
        await Promise.all(
          workflows.map((wf: any) =>
            $fetch('/api/workflows/run', {
              method: 'POST',
              body: {
                workflow_id:  wf.id,
                triggered_by: 'meeting_end',
                context:      transcript,
                variables: {
                  transcript: transcript.slice(0, 2000),
                  date: new Date().toLocaleDateString(),
                },
              },
            })
          )
        )
      })
  }

  return meeting
})
