import { useSupabaseAdmin } from '~/server/utils/supabase'

// Masked values sent back by index.get must never overwrite real secrets
function isMasked(value: string): boolean {
  return typeof value === 'string' && value.startsWith('••••')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, type, config, status } = body

  if (!workspace_id || !type) throw createError({ statusCode: 400, message: 'workspace_id and type required' })

  const sb = useSupabaseAdmin()

  // Fetch existing config so we can preserve secrets the user didn't re-enter
  const { data: existing } = await sb
    .from('integrations')
    .select('config')
    .eq('workspace_id', workspace_id)
    .eq('type', type)
    .single()

  const existingConfig: Record<string, string> = (existing?.config as any) || {}
  const incomingConfig: Record<string, string> = config || {}

  // Merge: keep existing secret if incoming value looks like a mask
  const mergedConfig = { ...existingConfig }
  for (const [k, v] of Object.entries(incomingConfig)) {
    if (!isMasked(v as string)) {
      mergedConfig[k] = v as string
    }
  }

  const { data, error } = await sb
    .from('integrations')
    .upsert({
      workspace_id,
      type,
      status: status || 'connected',
      config: mergedConfig,
      updated_at: new Date().toISOString()
    }, { onConflict: 'workspace_id,type' })
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, message: error.message })

  // Never return raw config — only return status confirmation
  return { id: data.id, type: data.type, status: data.status }
})