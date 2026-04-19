<template>
  <div class="app-shell" :class="{ dark: isDark }">

    <nav class="sidebar">
      <div class="sidebar-brand">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path d="M16 3L28 9.5V22.5L16 29L4 22.5V9.5L16 3Z" fill="url(#sb_logo)" opacity="0.9"/>
          <path d="M16 3L28 9.5V22.5L16 29" stroke="rgba(167,139,250,0.5)" stroke-width="1.5" fill="none"/>
          <defs><linearGradient id="sb_logo" x1="4" y1="3" x2="28" y2="29"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs>
        </svg>
      </div>

      <button class="workspace-badge" :title="workspaceName">{{ workspaceInitial }}</button>
      <div class="nav-sep" />

      <div class="nav-links">
        <NuxtLink :to="`/workspace/${workspaceId}`"            class="nav-btn" :class="{ active: isHome }"         title="Command center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </NuxtLink>
        <NuxtLink :to="`/workspace/${workspaceId}/meeting/room`" class="nav-btn meeting" :class="{ active: isMeeting }" title="Meeting room">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14"/><rect x="3" y="8" width="12" height="8" rx="2"/></svg>
        </NuxtLink>
        <NuxtLink :to="`/workspace/${workspaceId}/workflows`"    class="nav-btn" :class="{ active: isWorkflows }"    title="Workflows">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </NuxtLink>
        <NuxtLink :to="`/workspace/${workspaceId}/analyst`"      class="nav-btn" :class="{ active: isAnalyst }"      title="Data analyst">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
        </NuxtLink>
        <NuxtLink :to="`/workspace/${workspaceId}/files`"        class="nav-btn" :class="{ active: isFiles }"        title="Knowledge base">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </NuxtLink>
        <NuxtLink :to="`/workspace/${workspaceId}/integrations`" class="nav-btn" :class="{ active: isIntegrations }" title="Integrations">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </NuxtLink>
        <NuxtLink :to="`/workspace/${workspaceId}/settings`"     class="nav-btn" :class="{ active: isSettings }"     title="Settings & members">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </NuxtLink>
      </div>

      <div class="sidebar-foot">
        <button class="nav-btn dark-toggle" :title="isDark ? 'Light mode' : 'Dark mode'" @click="isDark = !isDark">
          <svg v-if="!isDark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg v-else         width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>

        <!-- User menu — click shows dropdown, does NOT auto-logout -->
        <div class="user-menu-wrap" ref="userMenuRef">
          <button class="user-btn" :title="userEmail" @click.stop="showUserMenu = !showUserMenu">
            {{ userInitial }}
          </button>
          <Transition name="menu-fade">
            <div v-if="showUserMenu" class="user-menu">
              <div class="user-menu-info">
                <div class="user-menu-name">{{ userName }}</div>
                <div class="user-menu-email">{{ userEmail }}</div>
              </div>
              <div class="user-menu-sep" />
              <NuxtLink :to="`/workspace/${workspaceId}/settings`" class="user-menu-item" @click="showUserMenu = false">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Settings
              </NuxtLink>
              <div class="user-menu-sep" />
              <button class="user-menu-item signout" @click="signOut">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign out
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </nav>

    <main class="page-content">
      <VoiceMode :workspace-id="workspaceId" />
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user     = useSupabaseUser()
const route    = useRoute()

const isDark       = ref(false)
const showUserMenu = ref(false)
const userMenuRef  = ref<HTMLElement>()

const workspaceId = computed(() => {
  if (route.params.id) return Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string
  const match = route.path.match(/\/workspace\/([^/]+)/)
  return match ? match[1] : ''
})

const isHome         = computed(() => route.path === `/workspace/${workspaceId.value}`)
const isMeeting      = computed(() => route.path.includes('/meeting'))
const isWorkflows    = computed(() => route.path.endsWith('/workflows'))
const isAnalyst      = computed(() => route.path.endsWith('/analyst'))
const isFiles        = computed(() => route.path.endsWith('/files'))
const isIntegrations = computed(() => route.path.endsWith('/integrations'))
const isSettings     = computed(() => route.path.endsWith('/settings'))

const workspaceName    = ref('Workspace')
const workspaceInitial = computed(() => workspaceName.value.slice(0, 2).toUpperCase())
const userEmail = computed(() => user.value?.email || '')
const userName  = computed(() => user.value?.user_metadata?.full_name || userEmail.value.split('@')[0])
const userInitial = computed(() =>
  (user.value?.user_metadata?.full_name || user.value?.email || '?')[0].toUpperCase()
)

// Close menu on outside click — NOT on nav itself
function handleOutsideClick(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    showUserMenu.value = false
  }
}

onMounted(async () => {
  if (!workspaceId.value || !user.value?.id) return

  const { data: member } = await supabase
    .from('workspace_members')
    .select('id')
    .eq('workspace_id', workspaceId.value)
    .eq('user_id', user.value.id)
    .single()

  if (!member) { navigateTo('/no-workspace'); return }

  const { data: ws } = await supabase
    .from('workspaces').select('name')
    .eq('id', workspaceId.value).single()
  if (ws) workspaceName.value = ws.name

  try { isDark.value = localStorage.getItem('agentspace-dark') === '1' } catch {}

  document.addEventListener('click', handleOutsideClick)

  supabase.channel(`membership:${workspaceId.value}:${user.value.id}`)
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'workspace_members', filter: `workspace_id=eq.${workspaceId.value}` },
      (payload) => { if ((payload.old as any)?.user_id === user.value?.id) navigateTo('/no-workspace') })
    .subscribe()
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

watch(isDark, (v) => {
  try { localStorage.setItem('agentspace-dark', v ? '1' : '0') } catch {}
})

async function signOut() {
  showUserMenu.value = false
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<style scoped>
.app-shell { display: flex; height: 100vh; overflow: hidden; background: var(--bg); }
.sidebar { width: var(--sidebar-w); flex-shrink: 0; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; padding: 10px 0; gap: 2px; }
.sidebar-brand { padding: 6px; margin-bottom: 4px; color: var(--accent); }
.workspace-badge { width: 32px; height: 32px; border-radius: 8px; background: var(--accent); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: none; cursor: default; }
.nav-sep { width: 28px; height: 1px; background: var(--border); margin: 6px 0; }
.nav-links { display: flex; flex-direction: column; gap: 2px; width: 100%; align-items: center; flex: 1; }
.nav-btn { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; color: var(--text-3); background: none; border: none; cursor: pointer; transition: all .15s; text-decoration: none; }
.nav-btn:hover { background: var(--surface-2); color: var(--text-2); }
.nav-btn.active { background: var(--accent-soft); color: var(--accent); }
.nav-btn.meeting:hover  { background: rgba(239,68,68,.1) !important; color: var(--red) !important; }
.nav-btn.meeting.active { background: rgba(239,68,68,.12) !important; color: var(--red-text) !important; }
.sidebar-foot { display: flex; flex-direction: column; align-items: center; gap: 6px; padding-bottom: 4px; }
.user-menu-wrap { position: relative; }
.user-btn { width: 30px; height: 30px; border-radius: 50%; background: var(--accent); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; transition: all .15s; }
.user-btn:hover { transform: scale(1.08); }
.page-content { flex: 1; overflow: hidden; min-width: 0; height: 100vh; display: flex; flex-direction: column; }

/* User dropdown */
.user-menu { position: absolute; bottom: 4px; left: 48px; width: 210px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-lg); z-index: 300; overflow: hidden; }
.user-menu-info { padding: 12px 14px 8px; }
.user-menu-name  { font-size: 13px; font-weight: 600; color: var(--text-1); margin-bottom: 2px; }
.user-menu-email { font-size: 11px; color: var(--text-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-menu-sep   { height: 1px; background: var(--border); }
.user-menu-item  { display: flex; align-items: center; gap: 8px; width: 100%; padding: 9px 14px; font-size: 13px; color: var(--text-1); background: none; border: none; cursor: pointer; text-decoration: none; transition: background .1s; }
.user-menu-item:hover   { background: var(--surface-2); }
.user-menu-item.signout { color: var(--red-text); }
.user-menu-item.signout:hover { background: var(--red-soft); }

/* Menu transition */
.menu-fade-enter-active, .menu-fade-leave-active { transition: opacity .12s, transform .12s; }
.menu-fade-enter-from, .menu-fade-leave-to { opacity: 0; transform: translateY(4px); }
</style>
