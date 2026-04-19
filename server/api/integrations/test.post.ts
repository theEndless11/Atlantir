import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, type } = body

  if (!workspace_id || !type) {
    throw createError({ statusCode: 400, message: 'workspace_id and type required' })
  }

  const sb = useSupabaseAdmin()
  const { data, error } = await sb
    .from('integrations')
    .select('config, status')
    .eq('workspace_id', workspace_id)
    .eq('type', type)
    .single()

  if (error || !data) {
    throw createError({ statusCode: 404, message: 'Integration not found' })
  }

  if (data.status !== 'connected') {
    return { result: 'Integration is not connected' }
  }

  const config = data.config as Record<string, string>

  try {
    switch (type) {
      case 'slack': {
        const res = await fetch(config.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: '✅ Agentspace connection test successful!' }),
        })
        if (!res.ok) throw new Error(`Slack returned ${res.status}`)
        return { result: 'Slack message sent successfully!' }
      }

      case 'notion': {
        const res = await fetch('https://api.notion.com/v1/users/me', {
          headers: {
            Authorization: `Bearer ${config.api_key}`,
            'Notion-Version': '2022-06-28',
          },
        })
        if (!res.ok) throw new Error(`Notion returned ${res.status}`)
        const user = await res.json() as { name?: string }
        return { result: `Connected as ${user.name || 'Notion user'}` }
      }

      case 'gmail': {
        // Validate format only — no actual SMTP call on test
        if (!config.sender_email || !config.app_password) {
          throw new Error('Missing email or app password')
        }
        if (!config.sender_email.includes('@')) {
          throw new Error('Invalid email address')
        }
        return { result: `Gmail credentials look good for ${config.sender_email}` }
      }

      case 'github': {
        const res = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${config.token}`,
            Accept: 'application/vnd.github+json',
          },
        })
        if (!res.ok) throw new Error(`GitHub returned ${res.status}`)
        const user = await res.json() as { login?: string }
        return { result: `Connected as @${user.login}` }
      }

      case 'google_calendar': {
        if (!config.webhook_url) {
          throw new Error('No webhook URL — follow the setup guide to create a Zapier webhook')
        }
        // Fire a test ping to the Zapier webhook
        const res = await fetch(config.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source: 'agentspace', test: true, summary: 'Agentspace test ping' })
        })
        if (!res.ok) throw new Error(`Webhook returned ${res.status}`)
        return { result: 'Calendar webhook connected — test ping sent to Zapier ✅' }
      }
      case 'excel': {
        return { result: 'Excel generation is built-in — no external connection needed ✅' }
      }

      case 'zapier': {
        const res = await fetch(config.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true, source: 'agentspace' }),
        })
        if (!res.ok) throw new Error(`Zapier returned ${res.status}`)
        return { result: 'Zapier webhook triggered successfully!' }
      }

      default:
        return { result: 'Unknown integration type' }
    }
  } catch (e: any) {
    return { error: e?.message || 'Test failed' }
  }
})