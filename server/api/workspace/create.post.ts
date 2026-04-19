import { useSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, user_id, email, full_name, avatar_url } = body

  if (!name?.trim() || !user_id) {
    throw createError({ statusCode: 400, message: 'name and user_id required' })
  }

  const sb = useSupabaseAdmin()

  // Upsert user profile
  await sb.from('users').upsert({
    id: user_id,
    email,
    full_name: full_name || null,
    avatar_url: avatar_url || null,
  })

  // Create workspace
  const { data: ws, error: wsErr } = await sb
    .from('workspaces')
    .insert({ name: name.trim(), owner_id: user_id })
    .select()
    .single()

  if (wsErr) throw createError({ statusCode: 500, message: wsErr.message })

  // Add owner as member
  await sb.from('workspace_members').insert({
    workspace_id: ws.id,
    user_id,
    role: 'owner'
  })

  return ws
})