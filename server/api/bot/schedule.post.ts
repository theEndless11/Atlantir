import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    workspace_id, room_url, bot_name, response_mode,
    instructions, scheduled_at, timezone, platform,
  } = body

  if (!workspace_id || !room_url || !scheduled_at) {
    throw createError({ statusCode: 400, message: 'workspace_id, room_url, and scheduled_at required' })
  }

  // Must be in the future
  if (new Date(scheduled_at) <= new Date()) {
    throw createError({ statusCode: 400, message: 'Scheduled time must be in the future' })
  }

  const sb = useSupabaseAdmin()

  const { data, error } = await sb
    .from('scheduled_bots')
    .insert({
      workspace_id,
      room_url,
      bot_name:      bot_name     || 'Atlantir',
      response_mode: response_mode || 'addressed',
      instructions:  instructions  || null,
      scheduled_at,
      timezone:      timezone      || 'UTC',
      platform:      platform      || 'zoom',
      status:        'pending',
    })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })
  return data
})
