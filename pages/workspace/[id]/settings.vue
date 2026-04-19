<template>
  <div class="page-shell settings-shell">
    <div class="settings-wrap">

      <div class="settings-header">
        <div class="ws-name-block">
          <div class="ws-avatar">{{ workspaceName.slice(0,2).toUpperCase() }}</div>
          <div>
            <h1>{{ workspaceName }}</h1>
            <code class="ws-id">{{ workspaceId }}</code>
          </div>
        </div>
      </div>

      <!-- Invite link section -->
      <div class="settings-card">
        <div class="card-header">
          <div>
            <div class="card-title">Invite link</div>
            <div class="card-sub">Anyone with this link can join as a member</div>
          </div>
          <div class="toggle-wrap">
            <span class="toggle-label">{{ inviteEnabled ? 'Active' : 'Disabled' }}</span>
            <button class="toggle" :class="{ on: inviteEnabled }" @click="toggleInvite">
              <span class="toggle-knob" />
            </button>
          </div>
        </div>

        <div v-if="inviteEnabled && inviteToken" class="link-box">
          <div class="link-url">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <span>{{ inviteUrl }}</span>
          </div>
          <div class="link-actions">
            <button class="btn btn-primary" @click="copyLink">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              {{ copied ? 'Copied!' : 'Copy link' }}
            </button>
            <button class="btn btn-ghost" @click="regenLink(false)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              Regenerate
            </button>
          </div>
        </div>
        <div v-else-if="inviteEnabled" class="link-generating">
          <div class="spinner spinner-dark" /> Generating link…
        </div>
        <p v-else class="link-disabled">Invite link is disabled. Toggle on to allow link-based joining.</p>
      </div>

      <!-- Members section -->
      <div class="settings-card">
        <div class="card-header">
          <div>
            <div class="card-title">Members</div>
            <div class="card-sub">{{ members.length }} member{{ members.length !== 1 ? 's' : '' }} in this workspace</div>
          </div>
          <button class="btn btn-primary" @click="showInvite = true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Invite by email
          </button>
        </div>

        <div class="members-list">
          <div v-if="loading" class="members-loading">
            <div class="spinner spinner-dark" /> Loading members…
          </div>
          <div v-else-if="!members.length" class="members-empty">No members found</div>
          <div v-for="member in members" :key="member.id" class="member-row">
            <div class="member-avatar" :style="{ background: avatarColor(member.user?.email) }">
              {{ initials(member.user) }}
            </div>
            <div class="member-info">
              <span class="member-name">{{ member.user?.full_name || member.user?.email || 'Unknown' }}</span>
              <span class="member-email">{{ member.user?.email }}</span>
            </div>
            <span class="role-badge" :class="`role-${member.role}`">{{ member.role }}</span>
            <button v-if="member.role !== 'owner' && isOwner" class="btn btn-ghost remove-btn" @click="removeMember(member.user_id)">
              Remove
            </button>
          </div>
        </div>
      </div>


    </div>

    <!-- Invite modal -->
    <div v-if="showInvite" class="modal-backdrop" @click.self="showInvite = false">
      <div class="modal" style="width:440px">
        <div class="modal-head">
          <span>Invite by email</span>
          <button class="btn-icon" @click="showInvite = false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Email address</label>
            <input v-model="inviteEmail" class="input" type="email" placeholder="colleague@company.com" @keyup.enter="sendInvite" />
          </div>
          <div class="field">
            <label>Role</label>
            <select v-model="inviteRole" class="input select">
              <option value="member">Member — can view and run tasks</option>
              <option value="viewer">Viewer — read only</option>
            </select>
          </div>
          <div v-if="inviteResult" class="invite-result" :class="{ error: inviteError }">{{ inviteResult }}</div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-ghost" @click="showInvite = false">Cancel</button>
          <button class="btn btn-primary" :disabled="!inviteEmail.trim() || inviting" @click="sendInvite">
            <span v-if="inviting" class="spinner" />
            <span v-else>Send invite</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })

const route = useRoute()
const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const members = ref<any[]>([])
const loading = ref(true)
const workspaceName = ref('')
const inviteToken   = ref('')
const inviteEnabled = ref(true)
const copied        = ref(false)
const showInvite    = ref(false)
const inviteEmail   = ref('')
const inviteRole    = ref('member')
const inviting      = ref(false)
const inviteResult  = ref('')
const inviteError   = ref(false)


const inviteUrl = computed(() => inviteToken.value
  ? `${typeof window !== 'undefined' ? window.location.origin : ''}/join/${inviteToken.value}` : '')

const isOwner = computed(() => members.value.find(m => m.user_id === user.value?.id)?.role === 'owner')

function initials(u: any) {
  if (!u) return '?'
  const name = u.full_name || u.email || ''
  return name.split(/[\s@]/).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444']
function avatarColor(email?: string) {
  if (!email) return AVATAR_COLORS[0]
  return AVATAR_COLORS[email.charCodeAt(0) % AVATAR_COLORS.length]
}

async function loadData() {
  loading.value = true
  const { data: ws } = await supabase
    .from('workspaces')
    .select('name, invite_token, invite_enabled')
    .eq('id', workspaceId)
    .single()
  if (ws) {
    workspaceName.value = ws.name
    inviteToken.value   = ws.invite_token || ''
    inviteEnabled.value = ws.invite_enabled ?? true
    if (!ws.invite_token) await regenLink(true)
  }
  try {
    const data = await $fetch<any[]>(`/api/workspace/members?workspace_id=${workspaceId}`)
    members.value = data || []
  } catch {}
  loading.value = false
}


async function copyLink() {
  await navigator.clipboard.writeText(inviteUrl.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

async function regenLink(silent = false) {
  if (!silent && !confirm('Regenerate invite link? The old link will stop working.')) return
  try {
    const res = await $fetch<any>('/api/workspace/invite-manage', { method: 'POST', body: { workspace_id: workspaceId, action: 'regenerate' } })
    inviteToken.value   = res.invite_token
    inviteEnabled.value = true
  } catch {}
}

async function toggleInvite() {
  const action = inviteEnabled.value ? 'disable' : 'enable'
  await $fetch('/api/workspace/invite-manage', { method: 'POST', body: { workspace_id: workspaceId, action } })
  inviteEnabled.value = !inviteEnabled.value
}

async function sendInvite() {
  if (!inviteEmail.value.trim()) return
  inviting.value = true; inviteResult.value = ''; inviteError.value = false
  try {
    const res = await $fetch<any>('/api/workspace/invite', { method: 'POST', body: { workspace_id: workspaceId, email: inviteEmail.value.trim(), role: inviteRole.value, invited_by: user.value?.id } })
    inviteResult.value = res.message
    inviteEmail.value  = ''
    await loadData()
  } catch (e: any) {
    inviteResult.value = e?.data?.message || 'Failed to invite'
    inviteError.value  = true
  } finally { inviting.value = false }
}

async function removeMember(userId: string) {
  if (!confirm('Remove this member from the workspace?')) return
  try {
    await $fetch('/api/workspace/remove-member', { method: 'POST', body: { workspace_id: workspaceId, user_id: userId, requester_id: user.value?.id } })
    members.value = members.value.filter(m => m.user_id !== userId)
  } catch (e: any) { alert(e?.data?.message || 'Failed to remove') }
}

onMounted(loadData)
</script>

<style scoped>
.settings-shell { background: var(--bg); }
.settings-wrap  { max-width: 660px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }

.settings-header { padding-bottom: 4px; }
.ws-name-block  { display: flex; align-items: center; gap: 14px; }
.ws-avatar      { width: 48px; height: 48px; border-radius: 12px; background: var(--accent); color: #fff; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.settings-header h1 { font-size: 20px; font-weight: 600; color: var(--text-1); margin-bottom: 3px; }
.ws-id { font-size: 11px; color: var(--text-3); font-family: var(--mono); background: var(--surface-2); padding: 2px 7px; border-radius: 4px; }

.settings-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; }
.card-header   { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 20px; gap: 16px; border-bottom: 1px solid var(--border-soft); }
.card-title    { font-size: 14px; font-weight: 600; color: var(--text-1); margin-bottom: 3px; }
.card-sub      { font-size: 13px; color: var(--text-2); }

/* Toggle */
.toggle-wrap  { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.toggle-label { font-size: 12px; color: var(--text-3); }
.toggle       { width: 40px; height: 22px; border-radius: 11px; background: var(--border); border: none; cursor: pointer; position: relative; transition: background .2s; padding: 0; }
.toggle.on    { background: var(--accent); }
.toggle-knob  { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .2s; display: block; }
.toggle.on .toggle-knob { transform: translateX(18px); }

/* Invite link */
.link-box         { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.link-url         { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-sm); }
.link-url span    { font-size: 12px; color: var(--text-2); font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.link-url svg     { color: var(--text-3); flex-shrink: 0; }
.link-actions     { display: flex; gap: 8px; }
.link-generating  { display: flex; align-items: center; gap: 10px; padding: 16px 20px; font-size: 13px; color: var(--text-3); }
.link-disabled    { padding: 16px 20px; font-size: 13px; color: var(--text-3); font-style: italic; }

/* Members */
.members-list    { display: flex; flex-direction: column; }
.members-loading, .members-empty { display: flex; align-items: center; gap: 10px; padding: 20px; font-size: 13px; color: var(--text-3); }
.member-row      { display: flex; align-items: center; gap: 12px; padding: 12px 20px; border-top: 1px solid var(--border-soft); }
.member-avatar   { width: 36px; height: 36px; border-radius: 50%; color: #fff; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.member-info     { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.member-name     { font-size: 13px; font-weight: 500; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.member-email    { font-size: 11px; color: var(--text-3); }
.role-badge      { font-size: 11px; font-weight: 500; padding: 2px 9px; border-radius: 20px; }
.role-owner      { background: var(--amber-soft); color: var(--amber-text); }
.role-member     { background: var(--accent-soft); color: var(--accent); }
.role-viewer     { background: var(--surface-2);   color: var(--text-3); }
.remove-btn      { font-size: 12px; padding: 4px 10px; }

/* Modal overrides */
.invite-result       { padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13px; background: var(--green-soft); color: var(--green-text); }
.invite-result.error { background: var(--red-soft); color: var(--red-text); }
.select              { appearance: auto; }

</style>