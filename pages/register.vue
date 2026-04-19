<template>
  <div class="auth-root">
    <div class="bg-grid" />
    <div class="bg-glow" />

    <div class="auth-wrap">
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
        <div class="card-head">
          <h1>Create your account</h1>
          <p>Start working with your AI team today</p>
        </div>

        <button class="btn-google" :disabled="loading" @click="signInGoogle">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>

        <div class="divider"><span>or</span></div>

        <div v-if="!sent" class="form">
          <div class="field">
            <label>Full name</label>
            <input v-model="fullName" type="text" placeholder="Alex Johnson"
              :class="{ 'input-error': errors.fullName }" @input="errors.fullName = ''" />
            <span v-if="errors.fullName" class="field-error">{{ errors.fullName }}</span>
          </div>

          <div class="field">
            <label>Work email</label>
            <input v-model="email" type="email" placeholder="you@company.com"
              :class="{ 'input-error': errors.email }" @input="errors.email = ''" />
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>

          <div class="field">
            <label>Password</label>
            <div class="input-wrap">
              <input v-model="password" :type="showPass ? 'text' : 'password'" placeholder="Min. 8 characters"
                :class="{ 'input-error': errors.password }" @input="errors.password = ''" />
              <button class="eye-btn" tabindex="-1" @click="showPass = !showPass">
                <svg v-if="!showPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <div v-if="password" class="strength-bar">
              <div class="strength-fill" :style="{ width: strengthPct + '%', background: strengthColor }" />
            </div>
            <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
          </div>

          <div v-if="authError" class="alert-error">{{ authError }}</div>

          <button class="btn-primary" :disabled="loading" @click="signUp">
            <span v-if="loading" class="spinner" />
            <span v-else>Create account</span>
          </button>

          <p class="terms">By signing up you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
        </div>

        <div v-else class="sent-state">
          <div class="sent-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5">
              <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>
            </svg>
          </div>
          <h2>Check your inbox</h2>
          <p>We sent a confirmation link to <strong>{{ email }}</strong>. Click it to activate your account.</p>
          <button class="btn-outline" @click="sent = false">Use a different email</button>
        </div>

        <p v-if="!sent" class="switch-link">Already have an account? <NuxtLink to="/login">Sign in</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ auth: false })
const supabase = useSupabaseClient()
const fullName = ref('')
const email = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const authError = ref('')
const sent = ref(false)
const errors = ref({ fullName: '', email: '', password: '' })

const strengthPct = computed(() => {
  const p = password.value
  let s = 0
  if (p.length >= 8) s += 25
  if (/[A-Z]/.test(p)) s += 25
  if (/[0-9]/.test(p)) s += 25
  if (/[^A-Za-z0-9]/.test(p)) s += 25
  return s
})
const strengthColor = computed(() => {
  if (strengthPct.value <= 25) return '#f87171'
  if (strengthPct.value <= 50) return '#fb923c'
  if (strengthPct.value <= 75) return '#facc15'
  return '#4ade80'
})

function validate() {
  let ok = true
  if (!fullName.value.trim()) { errors.value.fullName = 'Name is required'; ok = false }
  if (!email.value.includes('@')) { errors.value.email = 'Enter a valid email'; ok = false }
  if (password.value.length < 8) { errors.value.password = 'At least 8 characters'; ok = false }
  return ok
}
async function signUp() {
  if (!validate()) return
  loading.value = true; authError.value = ''
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: { full_name: fullName.value },
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
  if (error) authError.value = error.message
  else sent.value = true
  loading.value = false
}
async function signInGoogle() {
  loading.value = true
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
.auth-root {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: #080b12; font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden;
}
.bg-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}
.bg-glow {
  position: absolute; width: 700px; height: 700px; border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%);
  top: -200px; left: 50%; transform: translateX(-50%); pointer-events: none;
}
.auth-wrap {
  position: relative; z-index: 1; display: flex; flex-direction: column;
  align-items: center; gap: 28px; width: 100%; padding: 24px;
}
.brand { display: flex; align-items: center; gap: 10px; color: white; }
.brand-mark { color: #818cf8; }
.brand-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
.card {
  background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px; padding: 36px; width: 100%; max-width: 400px; backdrop-filter: blur(16px);
}
.card-head { margin-bottom: 24px; }
.card-head h1 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 600; color: #f1f5f9; margin: 0 0 6px; letter-spacing: -0.02em; }
.card-head p { font-size: 14px; color: #64748b; margin: 0; }
.btn-google {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 11px; border-radius: 10px; background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0;
  font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: background 0.15s;
}
.btn-google:hover:not(:disabled) { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.18); }
.btn-google:disabled { opacity: 0.5; cursor: not-allowed; }
.divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
.divider span { font-size: 12px; color: var(--text-2); }
.form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-top { display: flex; align-items: center; justify-content: space-between; }
label { font-size: 13px; font-weight: 500; color: var(--text-3); }
.input-wrap { position: relative; }
input {
  width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #f1f5f9;
  font-size: 14px; font-family: 'DM Sans', sans-serif; transition: border-color 0.15s; box-sizing: border-box;
}
input:focus { outline: none; border-color: var(--accent); }
input.input-error { border-color: #f87171; }
input::placeholder { color: #2d3748; }
.input-wrap input { padding-right: 40px; }
.eye-btn {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: var(--text-2); padding: 0;
}
.strength-bar { height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; margin-top: 6px; }
.strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
.field-error { font-size: 12px; color: #f87171; }
.alert-error { padding: 10px 14px; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 8px; font-size: 13px; color: #fca5a5; }
.btn-primary {
  width: 100%; padding: 11px; background: var(--accent); color: white; border: none;
  border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer;
  font-family: 'DM Sans', sans-serif; transition: background 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.btn-primary:hover:not(:disabled) { background: var(--accent-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.terms { font-size: 11px; color: var(--text-2); text-align: center; margin: 0; }
.terms a { color: var(--accent); text-decoration: none; }
.sent-state { text-align: center; padding: 12px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.sent-icon { width: 64px; height: 64px; background: rgba(99,102,241,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.sent-state h2 { font-family: 'Syne', sans-serif; font-size: 18px; color: #f1f5f9; margin: 0; }
.sent-state p { font-size: 14px; color: #64748b; margin: 0; line-height: 1.6; }
.sent-state strong { color: var(--text-3); }
.btn-outline { padding: 9px 20px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--text-3); font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.btn-outline:hover { border-color: rgba(255,255,255,0.2); color: #e2e8f0; }
.switch-link { text-align: center; font-size: 13px; color: var(--text-2); margin: 20px 0 0; }
.switch-link a { color: var(--accent); text-decoration: none; }
.switch-link a:hover { color: #818cf8; }
</style>