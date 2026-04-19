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
          <h1>Name your workspace</h1>
          <p>You can invite your team after setup</p>
        </div>
        <div class="form">
          <div class="field">
            <label>Workspace name</label>
            <input v-model="name" type="text" placeholder="e.g. Acme Co, My Projects…"
              :class="{ 'input-error': error }" @keyup.enter="create" @input="error = ''" />
            <span v-if="error" class="field-error">{{ error }}</span>
          </div>
          <button class="btn-primary" :disabled="!name.trim() || loading" @click="create">
            <span v-if="loading" class="spinner" />
            <span v-else>Create workspace →</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const name = ref('')
const loading = ref(false)
const error = ref('')

async function create() {
  if (!name.value.trim() || !user.value) return
  loading.value = true
  error.value = ''

  try {
    const ws = await $fetch('/api/workspaces/create', {
      method: 'POST',
      body: {
        name: name.value.trim(),
        user_id: user.value.id,
        email: user.value.email,
        full_name: user.value.user_metadata?.full_name || null,
        avatar_url: user.value.user_metadata?.avatar_url || null,
      }
    })
    navigateTo(`/workspace/${ws.id}`)
  } catch (err: any) {
    error.value = err?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
.auth-root { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #080b12; font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; }
.bg-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 48px 48px; }
.bg-glow { position: absolute; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%); top: -200px; left: 50%; transform: translateX(-50%); pointer-events: none; }
.auth-wrap { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 28px; width: 100%; padding: 24px; }
.brand { display: flex; align-items: center; gap: 10px; color: white; }
.brand-mark { color: #818cf8; }
.brand-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
.card { background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 36px; width: 100%; max-width: 400px; backdrop-filter: blur(16px); }
.card-head { margin-bottom: 24px; }
.card-head h1 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 600; color: #f1f5f9; margin: 0 0 6px; letter-spacing: -0.02em; }
.card-head p { font-size: 14px; color: #64748b; margin: 0; }
.form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 13px; font-weight: 500; color: var(--text-3); }
input { width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #f1f5f9; font-size: 14px; font-family: 'DM Sans', sans-serif; transition: border-color 0.15s; box-sizing: border-box; }
input:focus { outline: none; border-color: var(--accent); }
input.input-error { border-color: #f87171; }
input::placeholder { color: #2d3748; }
.field-error { font-size: 12px; color: #f87171; }
.btn-primary { width: 100%; padding: 11px; background: var(--accent); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s; display: flex; align-items: center; justify-content: center; }
.btn-primary:hover:not(:disabled) { background: var(--accent-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.spinner { width: 16px; height: 16px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>