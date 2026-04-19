<template>
  <div class="splash">
    <div class="brand-mark">
      <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="2" width="11" height="11" rx="3" fill="#818cf8"/>
        <rect x="15" y="2" width="11" height="11" rx="3" fill="#818cf8" opacity="0.5"/>
        <rect x="2" y="15" width="11" height="11" rx="3" fill="#818cf8" opacity="0.5"/>
        <rect x="15" y="15" width="11" height="11" rx="3" fill="#818cf8" opacity="0.25"/>
      </svg>
    </div>
    <div class="spinner" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ auth: false })
const supabase = useSupabaseClient()

onMounted(async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) { navigateTo('/login'); return }

  const user = data.session.user
  const meta = user.user_metadata

  // Upsert profile
  await supabase.from('users').upsert({
    id: user.id,
    email: user.email,
    full_name: meta?.full_name || null,
    avatar_url: meta?.avatar_url || null,
  })

  // Handle pending invite token from Google OAuth
  const pendingToken = sessionStorage.getItem('pending_invite_token')
  if (pendingToken) {
    sessionStorage.removeItem('pending_invite_token')
    navigateTo(`/join/${pendingToken}`)
    return
  }

  // If invited to a workspace, add membership
  if (meta?.invited_to_workspace) {
    const { data: existing } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', meta.invited_to_workspace)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      await supabase.from('workspace_members').insert({
        workspace_id: meta.invited_to_workspace,
        user_id: user.id,
        role: meta.invited_role || 'member'
      })
    }

    navigateTo(`/workspace/${meta.invited_to_workspace}`)
    return
  }

  // Normal flow
  const { data: ws } = await supabase.from('workspaces').select('id').limit(1).single()
  if (ws) navigateTo(`/workspace/${ws.id}`)
  else navigateTo('/onboarding')
})
</script>

<style scoped>
.splash { min-height: 100vh; background: #080b12; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
.spinner { width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(129,140,248,0.2); border-top-color: #818cf8; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>