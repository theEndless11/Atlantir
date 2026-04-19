import { useSupabaseAdmin } from '~/server/utils/supabase'

const SECRET_KEYS = new Set([
  'app_password', 'api_key', 'token', 'auth_token', 'api_token', 'access_token',
  'webhook_url', 'oauth_token', 'secret_key', 'routing_key', 'account_sid'
])

function maskSecret(value: string): string {
  if (!value || value.length < 4) return '••••'
  return '••••' + value.slice(-4)
}

function stripSecrets(config: Record<string, any>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(config).map(([k, v]) =>
      SECRET_KEYS.has(k) ? [k, maskSecret(String(v))] : [k, v]
    )
  )
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const workspaceId = query.workspace_id as string
  if (!workspaceId) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()
  const { data } = await sb
    .from('integrations')
    .select('type, status, config, id')
    .eq('workspace_id', workspaceId)

  // Return ALL integrations from DB — client builds full list by merging with known types
  return (data || []).map(i => ({
    type: i.type,
    status: i.status,
    config: i.config ? stripSecrets(i.config as Record<string, any>) : {},
    id: i.id,
  }))
})
