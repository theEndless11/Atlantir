import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { workspace_id, action } = body // action: 'regenerate' | 'disable' | 'enable'
  if (!workspace_id) throw createError({ statusCode: 400, message: 'workspace_id required' })

  const sb = useSupabaseAdmin()

  if (action === 'disable') {
    await sb.from('workspaces').update({ invite_enabled: false }).eq('id', workspace_id)
    return { success: true, invite_enabled: false }
  }

  if (action === 'enable') {
    await sb.from('workspaces').update({ invite_enabled: true }).eq('id', workspace_id)
    return { success: true, invite_enabled: true }
  }

  // Regenerate — creates new token, old links stop working
  const newToken = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('')

  await sb.from('workspaces')
    .update({ invite_token: newToken, invite_enabled: true })
    .eq('id', workspace_id)

  return { success: true, invite_token: newToken }
})