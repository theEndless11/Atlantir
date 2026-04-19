<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="show" class="overlay-wrap">
        <div class="overlay">

          <!-- Header -->
          <div class="overlay-header">
            <div class="header-left">
              <div class="status-dot" :class="{ done: allDone, error: hasError }" />
              <span class="header-title">{{ taskTitle }}</span>
            </div>
            <div class="header-right">
              <button v-if="showThinking" class="btn-toggle" @click="showThinking = false">Hide thinking</button>
              <button v-else class="btn-toggle" @click="showThinking = true">Show thinking</button>
              <button class="btn-close" @click="close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Pipeline bar -->
          <div class="pipeline-bar">
            <template v-for="(step, i) in pipeline" :key="step.id">
              <div class="pipe-step" :class="step.status">
                <div class="pipe-bubble">
                  <span>{{ petEmoji(step.pet_name) }}</span>
                  <div v-if="step.status === 'running'" class="pipe-spinner" />
                </div>
                <div class="pipe-name">{{ step.pet_name }}</div>
              </div>
              <div v-if="i < pipeline.length - 1" class="pipe-arrow" :class="{ lit: step.status === 'completed' }" />
            </template>
            <div v-if="!pipeline.length" class="pipe-waiting">Initializing pipeline...</div>
          </div>

          <!-- Content area -->
          <div class="overlay-body">

            <!-- Thinking panel (collapsible) -->
            <Transition name="thinking">
              <div v-if="showThinking && thinkingUpdates.length" class="thinking-panel">
                <div class="thinking-label">Agent thinking</div>
                <div ref="thinkingEl" class="thinking-stream">
                  <div v-for="u in thinkingUpdates" :key="u.id" class="think-block">
                    <div class="think-header">
                      <span class="think-pet">{{ petEmoji(u.pet_name) }} {{ u.pet_name }}</span>
                      <span class="think-time">{{ formatTime(u.created_at) }}</span>
                    </div>
                    <div class="think-content">{{ u.content }}</div>
                  </div>
                  <div v-if="currentPet && !allDone" class="think-typing">
                    <span>{{ currentPet }}</span>
                    <div class="dots"><span/><span/><span/></div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Final output -->
            <div v-if="finalOutput" class="output-panel">
              <div class="output-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Final output
              </div>
              <div class="output-content" v-html="renderMd(finalOutput)" />
            </div>

            <!-- Working state when no output yet -->
            <div v-else-if="!allDone" class="working-state">
              <div class="working-pulse">
                <div class="pulse-ring" />
                <span class="working-emoji">{{ currentPetEmoji }}</span>
              </div>
              <div class="working-text">{{ currentPet || 'Starting...' }} is working</div>
            </div>
          </div>

          <!-- Footer -->
          <div class="overlay-footer">
            <div v-if="allDone && !hasError" class="footer-done">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Completed · saved to artifacts
            </div>
            <div v-else-if="hasError" class="footer-error">⚠ One or more steps failed</div>
            <div v-else class="footer-running">Running in background · you can close this</div>
            <button v-if="allDone" class="btn-primary" @click="close">Close</button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ show: boolean; taskId: string | null; taskTitle: string }>()
const emit = defineEmits(['close', 'done'])

const supabase = useSupabaseClient()
const pipeline = ref<any[]>([])
const allUpdates = ref<any[]>([])
const showThinking = ref(false)
const thinkingEl = ref<HTMLElement>()

const thinkingUpdates = computed(() => allUpdates.value.filter(u => u.update_type === 'progress'))
const finalOutput = computed(() => {
  // Last progress update from Link is the final clean output
  const linkUpdates = allUpdates.value.filter(u => u.pet_name === 'Link' && u.update_type === 'progress')
  return linkUpdates.length ? linkUpdates[linkUpdates.length - 1].content : ''
})

const allDone = computed(() =>
  pipeline.value.length > 0 &&
  pipeline.value.every(s => ['completed', 'failed', 'skipped'].includes(s.status))
)
const hasError = computed(() => pipeline.value.some(s => s.status === 'failed'))

const currentPet = computed(() => {
  const r = pipeline.value.find(s => s.status === 'running')
  return r ? `${petEmoji(r.pet_name)} ${r.pet_name}` : null
})
const currentPetEmoji = computed(() => {
  const r = pipeline.value.find(s => s.status === 'running')
  return r ? petEmoji(r.pet_name) : ''
})

const petEmojis: Record<string, string> = { Scout: '', Bolt: '⚡', Sage: '', Quill: '', Link: '' }
function petEmoji(name: string) { return petEmojis[name] || '' }
function formatTime(ts: string) { return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
function renderMd(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^# (.*)/gm, '<h3>$1</h3>')
    .replace(/^## (.*)/gm, '<h4>$1</h4>')
    .replace(/^- (.*)/gm, '<li>$1</li>')
    .replace(/\n/g, '<br>')
}

let channel: any = null

watch(() => props.taskId, async (id) => {
  if (!id) return
  pipeline.value = []
  allUpdates.value = []

  if (channel) supabase.removeChannel(channel)

  channel = supabase.channel(`overlay:${id}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'task_pipeline', filter: `task_id=eq.${id}` },
      (p) => {
        const step = p.new as any
        const idx = pipeline.value.findIndex(s => s.id === step.id)
        if (idx !== -1) pipeline.value[idx] = step
        else pipeline.value.push(step)
        pipeline.value.sort((a, b) => a.step_index - b.step_index)
      })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_updates', filter: `task_id=eq.${id}` },
      (p) => {
        allUpdates.value.push(p.new)
        nextTick(() => { if (thinkingEl.value) thinkingEl.value.scrollTop = thinkingEl.value.scrollHeight })
      })
    .subscribe()
}, { immediate: true })

watch(allDone, (done) => { if (done) emit('done') })
function close() { emit('close') }
</script>

<style scoped>
.overlay-wrap {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: flex-end; justify-content: center;
  padding-bottom: 0; pointer-events: none;
}
.overlay {
  width: 680px; max-width: 100vw; max-height: 70vh;
  background: white; border: 1px solid #e5e7eb;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.12);
  display: flex; flex-direction: column;
  pointer-events: all;
}

/* Transition */
.overlay-enter-active, .overlay-leave-active { transition: transform 0.25s ease, opacity 0.25s; }
.overlay-enter-from, .overlay-leave-to { transform: translateY(100%); opacity: 0; }

/* Header */
.overlay-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-bottom: 1px solid #f3f4f6; flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 8px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; animation: pulse 1.5s infinite; }
.status-dot.done { background: #10b981; animation: none; }
.status-dot.error { background: #ef4444; animation: none; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
.header-title { font-size: 14px; font-weight: 500; color: #111827; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.header-right { display: flex; align-items: center; gap: 8px; }
.btn-toggle { font-size: 12px; color: #6b7280; background: #f3f4f6; border: none; border-radius: 6px; padding: 4px 10px; cursor: pointer; }
.btn-toggle:hover { background: #e5e7eb; }
.btn-close { background: none; border: none; color: #9ca3af; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; }
.btn-close:hover { background: #f3f4f6; color: #374151; }

/* Pipeline bar */
.pipeline-bar {
  display: flex; align-items: center; gap: 6px;
  padding: 12px 18px; border-bottom: 1px solid #f9fafb; flex-shrink: 0; overflow-x: auto;
}
.pipe-step { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.pipe-bubble {
  width: 34px; height: 34px; border-radius: 50%;
  background: #f9fafb; border: 1.5px solid #e5e7eb;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; position: relative;
}
.pipe-step.running .pipe-bubble { border-color: #6366f1; background: #eef2ff; }
.pipe-step.completed .pipe-bubble { border-color: #10b981; background: #f0fdf4; }
.pipe-step.failed .pipe-bubble { border-color: #ef4444; background: #fef2f2; }
.pipe-step.waiting .pipe-bubble { opacity: 0.4; }
.pipe-spinner {
  position: absolute; inset: -3px; border-radius: 50%;
  border: 2px solid transparent; border-top-color: #6366f1;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.pipe-name { font-size: 10px; color: #9ca3af; }
.pipe-step.running .pipe-name { color: #6366f1; font-weight: 500; }
.pipe-step.completed .pipe-name { color: #10b981; }
.pipe-arrow { flex: 1; max-width: 32px; height: 1.5px; background: #e5e7eb; transition: background 0.3s; }
.pipe-arrow.lit { background: #10b981; }
.pipe-waiting { font-size: 12px; color: #d1d5db; font-style: italic; }

/* Body */
.overlay-body { flex: 1; overflow: hidden; display: flex; flex-direction: column; min-height: 0; }

/* Thinking panel */
.thinking-panel { border-bottom: 1px solid #f3f4f6; flex-shrink: 0; max-height: 180px; display: flex; flex-direction: column; }
.thinking-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; padding: 8px 18px 4px; }
.thinking-stream { flex: 1; overflow-y: auto; padding: 0 18px 10px; display: flex; flex-direction: column; gap: 10px; }
.think-block { display: flex; flex-direction: column; gap: 3px; }
.think-header { display: flex; align-items: center; gap: 6px; }
.think-pet { font-size: 11px; font-weight: 600; color: #374151; }
.think-time { font-size: 10px; color: #d1d5db; }
.think-content { font-size: 12px; color: #6b7280; line-height: 1.6; background: #f9fafb; padding: 8px 10px; border-radius: 6px; white-space: pre-wrap; max-height: 80px; overflow-y: auto; }
.think-typing { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #9ca3af; }
.dots { display: flex; gap: 3px; }
.dots span { width: 4px; height: 4px; background: #9ca3af; border-radius: 50%; animation: bounce 1.2s infinite; }
.dots span:nth-child(2) { animation-delay: 0.2s; }
.dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }

/* Transition for thinking panel */
.thinking-enter-active, .thinking-leave-active { transition: max-height 0.3s ease, opacity 0.2s; overflow: hidden; }
.thinking-enter-from, .thinking-leave-to { max-height: 0; opacity: 0; }

/* Output */
.output-panel { flex: 1; overflow-y: auto; padding: 16px 18px; }
.output-label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: #10b981; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
.output-content { font-size: 14px; line-height: 1.8; color: #374151; white-space: pre-wrap; }
.output-content :deep(strong) { font-weight: 600; color: #111827; }
.output-content :deep(h3) { font-size: 15px; font-weight: 600; margin: 12px 0 6px; }
.output-content :deep(h4) { font-size: 14px; font-weight: 600; margin: 10px 0 4px; }
.output-content :deep(li) { margin-left: 16px; list-style: disc; }

/* Working state */
.working-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
.working-pulse { position: relative; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; }
.pulse-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid #6366f1; animation: ripple 1.5s infinite; }
@keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(1.4);opacity:0} }
.working-emoji { font-size: 24px; }
.working-text { font-size: 13px; color: #6b7280; }

/* Footer */
.overlay-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 18px; border-top: 1px solid #f3f4f6; flex-shrink: 0;
}
.footer-done { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #10b981; }
.footer-error { font-size: 13px; color: #ef4444; }
.footer-running { font-size: 12px; color: #9ca3af; }
.btn-primary { padding: 7px 18px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; }
.btn-primary:hover { background: #4f46e5; }
</style>