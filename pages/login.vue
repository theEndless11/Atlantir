<template>
  <div class="auth-page">
    <div class="auth-bg" />
    <div class="auth-card-wrap">
      <div class="brand">
        <div class="brand-icon">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect x="2"  y="2"  width="11" height="11" rx="3" fill="#6366f1"/>
            <rect x="15" y="2"  width="11" height="11" rx="3" fill="#6366f1" opacity="0.5"/>
            <rect x="2"  y="15" width="11" height="11" rx="3" fill="#6366f1" opacity="0.5"/>
            <rect x="15" y="15" width="11" height="11" rx="3" fill="#6366f1" opacity="0.25"/>
          </svg>
        </div>
        <span>Atlantir</span>
      </div>

      <div class="auth-card">
        <h1>Welcome back</h1>
        <p>Sign in to your workspace</p>

        <button class="btn-google" :disabled="loading" @click="signInGoogle">
          <svg width="17" height="17" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div class="auth-divider"><span>or</span></div>

        <div class="field">
          <label>Email</label>
          <input v-model="email" class="input" type="email" placeholder="you@company.com"
            autocomplete="email" :class="{ 'input-error': errors.email }" @input="errors.email = ''" />
          <span v-if="errors.email" class="field-error-msg">{{ errors.email }}</span>
        </div>

        <div class="field">
          <div class="field-top-row">
            <label>Password</label>
            <NuxtLink to="/reset-password" class="forgot">Forgot?</NuxtLink>
          </div>
          <div class="input-wrap">
            <input v-model="password" class="input" :type="showPass ? 'text' : 'password'"
              placeholder="••••••••" autocomplete="current-password"
              :class="{ 'input-error': errors.password }"
              @keyup.enter="signIn" @input="errors.password = ''" />
            <button class="eye-btn" tabindex="-1" @click="showPass = !showPass">
              <svg v-if="!showPass" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
          <span v-if="errors.password" class="field-error-msg">{{ errors.password }}</span>
        </div>

        <div v-if="authError" class="alert-error">{{ authError }}</div>

        <button class="btn btn-primary full-btn" :disabled="loading" @click="signIn">
          <span v-if="loading" class="spinner" />
          <span v-else>Sign in</span>
        </button>

        <p class="switch-link">No account? <NuxtLink to="/register">Create one free →</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ auth: false })
const supabase = useSupabaseClient()
const email    = ref('')
const password = ref('')
const showPass = ref(false)
const loading  = ref(false)
const authError = ref('')
const errors   = ref({ email: '', password: '' })

function validate() {
  let ok = true
  if (!email.value.includes('@'))      { errors.value.email    = 'Enter a valid email'; ok = false }
  if (password.value.length < 6)       { errors.value.password = 'At least 6 characters'; ok = false }
  return ok
}

async function signIn() {
  if (!validate()) return
  loading.value = true; authError.value = ''
  const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  if (error) { authError.value = error.message; loading.value = false; return }
  navigateTo('/')
}

async function signInGoogle() {
  loading.value = true
  await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
}
</script>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); position: relative; overflow: hidden; }
.auth-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% -20%, rgba(99,102,241,.12), transparent); pointer-events: none; }
.auth-card-wrap { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100%; max-width: 400px; padding: 24px 16px; }
.brand { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; color: var(--text-1); }
.brand-icon { display: flex; }
.auth-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; width: 100%; box-shadow: 0 4px 24px rgba(0,0,0,.06); display: flex; flex-direction: column; gap: 16px; }
.auth-card h1 { font-size: 20px; font-weight: 600; color: var(--text-1); }
.auth-card > p { font-size: 14px; color: var(--text-2); margin-top: -10px; }
.btn-google { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 9px 16px; border: 1.5px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text-1); font-size: 14px; font-weight: 500; cursor: pointer; transition: all .15s; }
.btn-google:hover { background: var(--surface-2); border-color: var(--text-3); }
.btn-google:disabled { opacity: .5; cursor: not-allowed; }
.auth-divider { display: flex; align-items: center; gap: 12px; }
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.auth-divider span { font-size: 12px; color: var(--text-3); }
.field-top-row { display: flex; justify-content: space-between; align-items: center; }
.forgot { font-size: 12px; color: var(--accent); }
.forgot:hover { text-decoration: underline; }
.input-wrap { position: relative; }
.input-wrap .input { padding-right: 36px; }
.eye-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--text-3); display: flex; align-items: center; }
.alert-error { padding: 10px 12px; background: var(--red-soft); border: 1px solid #fca5a5; border-radius: 8px; font-size: 13px; color: var(--red-text); }
.full-btn { width: 100%; justify-content: center; padding: 10px; }
.switch-link { text-align: center; font-size: 13px; color: var(--text-2); }
.switch-link a { color: var(--accent); font-weight: 500; }
.switch-link a:hover { text-decoration: underline; }
</style>
