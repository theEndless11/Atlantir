<template>
  <div class="join-root">
    <div class="bg-grid" />
    <div class="bg-glow" />

    <div class="join-wrap">
      <div class="brand">
        <div class="brand-mark">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="11" height="11" rx="3" fill="currentColor"/>
            <rect x="15" y="2" width="11" height="11" rx="3" fill="currentColor" opacity="0.5"/>
            <rect x="2" y="15" width="11" height="11" rx="3" fill="currentColor" opacity="0.5"/>
            <rect x="15" y="15" width="11" height="11" rx="3" fill="currentColor" opacity="0.25"/>
          </svg>
        </div>
        <span class="brand-name">Atlantir</span>
      </div>

      <div class="card">
        <!-- Loading -->
        <div v-if="loading" class="state-center">
          <div class="spinner" />
          <p>Loading invite...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="state-center error">
          <div class="state-icon">✕</div>
          <h2>Invalid invite</h2>
          <p>{{ error }}</p>
          <NuxtLink to="/login" class="btn-primary">Go to login</NuxtLink>
        </div>

        <!-- Join prompt (not logged in) -->
        <div v-else-if="workspace && !user" class="join-content">
          <div class="workspace-badge">
            <div class="ws-avatar">{{ workspace.name.slice(0, 2).toUpperCase() }}</div>
            <div>
              <div class="ws-name">{{ workspace.name }}</div>
              <div class="ws-meta">{{ workspace.member_count }} member{{ workspace.member_count !== 1 ? 's' : '' }}</div>
            </div>
          </div>
          <h2>You've been invited</h2>
          <p>Sign in or create an account to join <strong>{{ workspace.name }}</strong></p>
          <div class="auth-form">
            <input v-model="email" type="email" placeholder="your@email.com" />
            <input v-model="password" type="password" placeholder="Password" />
            <p v-if="authError" class="field-error">{{ authError }}</p>
            <button class="btn-primary" :disabled="joining" @click="signInAndJoin">
              {{ joining ? 'Joining...' : 'Sign in & join workspace' }}
            </button>
            <div class="divider"><span>or</span></div>
            <button class="btn-google" @click="signInGoogleAndJoin">
              <svg width="16" height="16" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>

        <!-- Already logged in — confirm join -->
        <div v-else-if="workspace && user && !joined" class="join-content">
          <div class="workspace-badge">
            <div class="ws-avatar">{{ workspace.name.slice(0, 2).toUpperCase() }}</div>
            <div>
              <div class="ws-name">{{ workspace.name }}</div>
              <div class="ws-meta">{{ workspace.member_count }} member{{ workspace.member_count !== 1 ? 's' : '' }}</div>
            </div>
          </div>
          <h2>Join workspace?</h2>
          <p>You're joining as <strong>{{ user.email }}</strong></p>
          <button class="btn-primary" :disabled="joining" @click="joinWorkspace">
            {{ joining ? 'Joining...' : `Join ${workspace.name}` }}
          </button>
          <p v-if="authError" class="field-error">{{ authError }}</p>
        </div>

        <!-- Success -->
        <div v-else-if="joined" class="state-center">
          <div class="state-icon success">✓</div>
          <h2>You're in!</h2>
          <p>Welcome to <strong>{{ workspace?.name }}</strong></p>
          <NuxtLink :to="`/workspace/${workspace?.id}`" class="btn-primary">Open workspace</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ auth: false })

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const token = route.params.token as string
const workspace = ref<any>(null)
const loading = ref(true)
const error = ref('')
const joining = ref(false)
const joined = ref(false)
const email = ref('')
const password = ref('')
const authError = ref('')

onMounted(async () => {
  try {
    workspace.value = await $fetch<any>(`/api/workspace/invite-info?token=${token}`)
  } catch (e: any) {
    error.value = e?.data?.message || 'This invite link is invalid or has expired'
  } finally {
    loading.value = false
  }

  // If already logged in, check if already a member
  if (user.value && workspace.value) {
    await joinWorkspace()
  }
})

async function joinWorkspace() {
  if (!user.value || !workspace.value) return
  joining.value = true
  authError.value = ''
  try {
    await $fetch('/api/workspace/join', {
      method: 'POST',
      body: {
        token,
        user_id: user.value.id,
        email: user.value.email,
        full_name: user.value.user_metadata?.full_name
      }
    })
    joined.value = true
  } catch (e: any) {
    authError.value = e?.data?.message || 'Failed to join workspace'
  } finally {
    joining.value = false
  }
}

async function signInAndJoin() {
  joining.value = true
  authError.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  if (err) {
    // Try sign up
    const { error: signUpErr } = await supabase.auth.signUp({ email: email.value, password: password.value })
    if (signUpErr) { authError.value = signUpErr.message; joining.value = false; return }
  }
  await joinWorkspace()
}

async function signInGoogleAndJoin() {
  // Store token so callback can join after OAuth
  sessionStorage.setItem('pending_invite_token', token)
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
.join-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #080b12; font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; }
.bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 48px 48px; }
.bg-glow { position: absolute; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%); top: -200px; left: 50%; transform: translateX(-50%); pointer-events: none; }
.join-wrap { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 28px; width: 100%; padding: 24px; }
.brand { display: flex; align-items: center; gap: 10px; color: white; }
.brand-mark { color: #818cf8; }
.brand-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
.card { background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 36px; width: 100%; max-width: 420px; backdrop-filter: blur(16px); }
.state-center { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.state-center p { font-size: 14px; color: #64748b; margin: 0; }
.state-icon { width: 52px; height: 52px; border-radius: 50%; background: rgba(239,68,68,0.15); color: #f87171; font-size: 22px; display: flex; align-items: center; justify-content: center; }
.state-icon.success { background: rgba(16,185,129,0.15); color: #34d399; }
.state-center h2 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 600; color: #f1f5f9; margin: 0; }
.state-center.error .state-icon { background: rgba(239,68,68,0.15); color: #f87171; }
.spinner { width: 28px; height: 28px; border-radius: 50%; border: 2px solid rgba(129,140,248,0.2); border-top-color: #818cf8; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.workspace-badge { display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; margin-bottom: 20px; }
.ws-avatar { width: 42px; height: 42px; border-radius: 10px; background: #6366f1; color: white; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ws-name { font-size: 15px; font-weight: 600; color: #f1f5f9; }
.ws-meta { font-size: 12px; color: #64748b; margin-top: 2px; }
.join-content h2 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 600; color: #f1f5f9; margin: 0 0 6px; }
.join-content > p { font-size: 14px; color: #64748b; margin: 0 0 20px; }
.join-content strong { color: #94a3b8; }
.auth-form { display: flex; flex-direction: column; gap: 10px; }
input { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #f1f5f9; font-size: 14px; font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
input:focus { outline: none; border-color: #6366f1; }
input::placeholder { color: #2d3748; }
.btn-primary { width: 100%; padding: 11px; background: #6366f1; color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; text-decoration: none; display: block; text-align: center; }
.btn-primary:hover:not(:disabled) { background: #4f46e5; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.divider { display: flex; align-items: center; gap: 10px; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
.divider span { font-size: 12px; color: #475569; }
.btn-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.btn-google:hover { background: rgba(255,255,255,0.1); }
.field-error { font-size: 12px; color: #f87171; margin: 0; }
</style>