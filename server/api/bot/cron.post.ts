import { useSupabaseAdmin } from '~/server/utils/supabase'

/**
 * POST /api/bot/cron
 *
 * Called by an external cron (e.g. crontab, GitHub Actions, or Supabase Edge Function)
 * every minute. Finds all scheduled_bots with status='pending' whose scheduled_at
 * is within the next 2 minutes, marks them 'running', then fires the bot join.
 *
 * Secure with CRON_SECRET env var.
 *
 * Example crontab (on your VPS):
 *   * * * * * curl -s -X POST https://your-app.com/api/bot/cron \
 *     -H "Content-Type: application/json" \
 *     -d '{"secret":"YOUR_CRON_SECRET"}'
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (body?.secret !== process.env.CRON_SECRET) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const sb  = useSupabaseAdmin()
  const now = new Date()

  // Find all pending bots scheduled for the next 2 minutes (gives a window for clock drift)
  const windowEnd = new Date(now.getTime() + 2 * 60 * 1000).toISOString()

  const { data: due, error } = await sb
    .from('scheduled_bots')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduled_at', windowEnd)

  if (error) throw createError({ statusCode: 500, message: error.message })
  if (!due?.length) return { fired: 0, checked: 0 }

  const results = await Promise.allSettled(
    due.map(async (bot: any) => {
      // Mark as running first to prevent double-firing
      await sb
        .from('scheduled_bots')
        .update({ status: 'running', fired_at: now.toISOString() })
        .eq('id', bot.id)
        .eq('status', 'pending')  // idempotency guard

      try {
        const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3021'
        const secret        = process.env.BOT_SECRET || 'changeme'

        const res = await fetch(`${botServiceUrl}/bot/join`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'x-bot-secret': secret },
          body:    JSON.stringify({
            room_url:      bot.room_url,
            workspace_id:  bot.workspace_id,
            bot_name:      bot.bot_name     || 'Atlantir',
            response_mode: bot.response_mode || 'addressed',
            instructions:  bot.instructions  || undefined,
          }),
        })

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`Bot service ${res.status}: ${errText}`)
        }

        const result = await res.json()

        // Store the session_id so we can track this scheduled session
        await sb
          .from('scheduled_bots')
          .update({ status: 'done', session_id: result.session_id })
          .eq('id', bot.id)

        return { id: bot.id, session_id: result.session_id }
      } catch (e: any) {
        // Mark as failed so it won't retry endlessly
        await sb
          .from('scheduled_bots')
          .update({ status: 'failed', error_message: e.message })
          .eq('id', bot.id)
        throw e
      }
    })
  )

  const fired  = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return {
    checked: due.length,
    fired,
    failed,
    at: now.toISOString(),
  }
})
