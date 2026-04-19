<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <span>New meeting</span>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <div class="tabs">
          <button :class="{ active: tab === 'live' }" @click="switchTab('live')">
            <span class="tab-dot" :class="{ recording: isRecording }" />
            Live recording
          </button>
          <button :class="{ active: tab === 'paste' }" @click="switchTab('paste')">Paste transcript</button>
          <button :class="{ active: tab === 'goal' }" @click="switchTab('goal')">Type a goal</button>
        </div>

        <div v-if="tab === 'live'" class="live-tab">
          <div class="recorder">
            <div class="rec-status" :class="{ active: isRecording }">
              <div v-if="isRecording" class="pulse-ring" />
              <div class="rec-dot" />
            </div>
            <div class="rec-info">
              <div class="rec-label">{{ isRecording ? 'Recording...' : 'Ready to record' }}</div>
              <div class="rec-sub">{{ isRecording ? 'Deepgram is transcribing in real-time' : 'Click start to capture your meeting' }}</div>
            </div>
            <button v-if="!isRecording" class="btn-record" @click="startRecording">Start</button>
            <button v-else class="btn-stop" @click="stopRecording">Stop</button>
          </div>
          <p v-if="deepgramError" class="rec-error">{{ deepgramError }}</p>
          <div v-if="isRecording || liveTranscript" class="transcript-preview">
            <div class="tp-label">Live transcript</div>
            <div class="tp-text">{{ liveTranscript }}<span v-if="interimText" class="interim"> {{ interimText }}</span></div>
          </div>
        </div>

        <div v-else-if="tab === 'paste'">
          <p class="hint">Paste your meeting transcript. The orchestrator will extract tasks automatically.</p>
          <textarea v-model="manualTranscript" class="transcript-input" placeholder="Paste transcript here..." rows="10" />
        </div>

        <div v-else>
          <p class="hint">Describe what you want to get done.</p>
          <textarea v-model="manualTranscript" class="transcript-input"
            placeholder="e.g. Prepare a competitive analysis of our top 3 rivals..." rows="6" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Cancel</button>
        <button class="btn-submit" :disabled="!canSubmit || processing" @click="submit">
          {{ processing ? 'Processing...' : 'Generate tasks' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ processing: boolean }>()
const emit = defineEmits(['submit', 'close'])

const tab = ref<'live' | 'paste' | 'goal'>('live')
const manualTranscript = ref('')
const liveTranscript = ref('')

const { transcript, interimText, isRecording, error: deepgramError, loadDevices, start, stop } = useDeepgram()

const canSubmit = computed(() => {
  if (tab.value === 'live') return liveTranscript.value.trim().length > 0 && !isRecording.value
  return manualTranscript.value.trim().length > 0
})

function switchTab(t: 'live' | 'paste' | 'goal') {
  if (isRecording.value) stop()
  tab.value = t
}

async function startRecording() {
  liveTranscript.value = ''
  await start()
}

function stopRecording() {
  stop()
  liveTranscript.value = transcript.value
}

onMounted(() => loadDevices())
watch(transcript, (v) => { liveTranscript.value = v })

function submit() {
  const text = tab.value === 'live' ? liveTranscript.value : manualTranscript.value
  if (!text.trim()) return
  emit('submit', text.trim())
}
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: white; border-radius: 12px; width: 580px; max-width: 95vw; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; font-weight: 500; font-size: 15px; }
.close-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #6b7280; }
.modal-body { padding: 20px; }
.tabs { display: flex; gap: 4px; margin-bottom: 16px; }
.tabs button { padding: 6px 14px; border-radius: 6px; border: 1px solid #e5e7eb; background: white; font-size: 13px; cursor: pointer; color: #6b7280; display: flex; align-items: center; gap: 6px; }
.tabs button.active { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; font-weight: 500; }
.tab-dot { width: 7px; height: 7px; border-radius: 50%; background: #d1d5db; }
.tab-dot.recording { background: #ef4444; animation: blink 1s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.live-tab { display: flex; flex-direction: column; gap: 14px; }
.recorder { display: flex; align-items: center; gap: 14px; padding: 14px; background: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb; }
.rec-status { position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rec-dot { width: 14px; height: 14px; border-radius: 50%; background: #d1d5db; }
.rec-status.active .rec-dot { background: #ef4444; }
.pulse-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid #ef4444; animation: pulse-ring 1.5s infinite; }
@keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(1.4);opacity:0} }
.rec-info { flex: 1; }
.rec-label { font-size: 13px; font-weight: 500; color: #111827; }
.rec-sub { font-size: 12px; color: #6b7280; margin-top: 2px; }
.btn-record { padding: 7px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; }
.btn-record:hover { background: #dc2626; }
.btn-stop { padding: 7px 16px; background: #374151; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; }
.rec-error { font-size: 13px; color: #dc2626; margin: 0; }
.transcript-preview { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
.tp-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; padding: 8px 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.tp-text { padding: 12px; font-size: 13px; line-height: 1.6; color: #374151; max-height: 180px; overflow-y: auto; white-space: pre-wrap; }
.interim { color: #9ca3af; }
.hint { font-size: 13px; color: #6b7280; margin: 0 0 10px; }
.transcript-input { width: 100%; resize: vertical; font-size: 13px; line-height: 1.6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; font-family: inherit; box-sizing: border-box; }
.transcript-input:focus { outline: none; border-color: #2563eb; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid #e5e7eb; }
.btn-cancel { padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; cursor: pointer; font-size: 13px; }
.btn-submit { padding: 8px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; }
.btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-submit:hover:not(:disabled) { background: #1d4ed8; }
</style>