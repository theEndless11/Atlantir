<template>
  <Teleport to="body">
    <!-- Floating trigger -->
    <button
      v-if="!isActive"
      class="voice-fab"
      :class="{ 'fab-listening': isListening }"
      @click="openVoiceMode"
      title="Voice assistant"
    >
      <div class="fab-pulse" />
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="fab-wave">
        <rect x="1"  y="9"  width="2" height="6"  rx="1" fill="currentColor" opacity="0.5" class="fw fw1"/>
        <rect x="5"  y="5"  width="2" height="14" rx="1" fill="currentColor" opacity="0.7" class="fw fw2"/>
        <rect x="9"  y="2"  width="2" height="20" rx="1" fill="currentColor" class="fw fw3"/>
        <rect x="13" y="5"  width="2" height="14" rx="1" fill="currentColor" opacity="0.7" class="fw fw4"/>
        <rect x="17" y="8"  width="2" height="8"  rx="1" fill="currentColor" opacity="0.5" class="fw fw5"/>
        <rect x="21" y="10" width="2" height="4"  rx="1" fill="currentColor" opacity="0.3" class="fw fw6"/>
      </svg>
    </button>

    <Transition name="vm-fade">
      <div v-if="isActive" class="vm-backdrop" @click.self="closeVoiceMode">
        <div class="vm-panel">

          <!-- Header -->
          <div class="vm-header">
            <div class="vm-logo">
              <div class="vm-logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="logo-wave">
                  <rect x="1"  y="9"  width="2" height="6"  rx="1" fill="white" opacity="0.4" class="lw lw1"/>
                  <rect x="5"  y="5"  width="2" height="14" rx="1" fill="white" opacity="0.65" class="lw lw2"/>
                  <rect x="9"  y="2"  width="2" height="20" rx="1" fill="white" class="lw lw3"/>
                  <rect x="13" y="5"  width="2" height="14" rx="1" fill="white" opacity="0.65" class="lw lw4"/>
                  <rect x="17" y="8"  width="2" height="8"  rx="1" fill="white" opacity="0.4" class="lw lw5"/>
                  <rect x="21" y="10" width="2" height="4"  rx="1" fill="white" opacity="0.25" class="lw lw6"/>
                </svg>
              </div>
              <div class="vm-logo-text">
                <span class="vm-title">Voice Assistant</span>
                <span class="vm-subtitle">Atlantir Workspace AI</span>
              </div>
            </div>
            <button class="vm-close" @click="closeVoiceMode">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Visualizer -->
          <div class="vm-visualizer" :class="orbState">
            <div class="vis-rings">
              <div class="vis-ring r1" />
              <div class="vis-ring r2" />
              <div class="vis-ring r3" />
            </div>
            <div class="vis-orb">
              <div v-if="orbState === 'idle'" class="vis-idle-bars">
                <span v-for="i in 7" :key="i" class="idle-bar" :style="'--i:' + i" />
              </div>
              <div v-else-if="orbState === 'listening'" class="vis-wave">
                <span v-for="i in 7" :key="i" class="wave-bar" :style="'--i:' + i" />
              </div>
              <div v-else-if="orbState === 'processing'" class="vis-processing">
                <span /><span /><span />
              </div>
              <div v-else-if="orbState === 'speaking'" class="vis-speaking">
                <span v-for="i in 5" :key="i" class="speak-bar" :style="'--i:' + i" />
              </div>
            </div>
          </div>

          <!-- Status label -->
          <div class="vm-status" :class="orbState">
            <span v-if="isListening">{{ interimText || transcript || 'Listening…' }}</span>
            <span v-else-if="isProcessing">Processing your request…</span>
            <span v-else-if="isSpeaking">Speaking…</span>
            <span v-else>Tap the button to speak</span>
          </div>

          <!-- Debug transcription panel -->
          <div class="vm-debug">
            <div class="vm-debug-row">
              <span class="vm-debug-label">State:</span>
              <span class="vm-debug-val" :class="orbState">{{ orbState }}</span>
            </div>
            <div class="vm-debug-row" v-if="interimText">
              <span class="vm-debug-label">Hearing:</span>
              <span class="vm-debug-val interim">{{ interimText }}</span>
            </div>
            <div class="vm-debug-row" v-if="transcript">
              <span class="vm-debug-label">You said:</span>
              <span class="vm-debug-val user">{{ transcript }}</span>
            </div>
            <div class="vm-debug-row" v-if="conversation.length">
              <span class="vm-debug-label">Bot said:</span>
              <span class="vm-debug-val bot">{{ conversation[conversation.length - 1]?.role === 'assistant' ? conversation[conversation.length - 1].text : '—' }}</span>
            </div>
            <div class="vm-debug-row" v-if="error">
              <span class="vm-debug-label">Error:</span>
              <span class="vm-debug-val error">{{ error }}</span>
            </div>
          </div>

          <!-- Conversation -->
          <div v-if="conversation.length" ref="convEl" class="vm-conversation">
            <div v-for="msg in conversation" :key="msg.id" class="vm-msg" :class="msg.role">
              <div v-if="msg.role === 'assistant'" class="vm-avatar">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="9" width="2" height="6" rx="1" fill="currentColor" opacity="0.4"/>
                  <rect x="5" y="5" width="2" height="14" rx="1" fill="currentColor" opacity="0.7"/>
                  <rect x="9" y="2" width="2" height="20" rx="1" fill="currentColor"/>
                  <rect x="13" y="5" width="2" height="14" rx="1" fill="currentColor" opacity="0.7"/>
                  <rect x="17" y="8" width="2" height="8" rx="1" fill="currentColor" opacity="0.4"/>
                </svg>
              </div>
              <div class="vm-bubble">{{ msg.text }}</div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="vm-empty">
            <p class="vm-hint">Ask me anything about your workspace</p>
            <div class="vm-pills">
              <button v-for="q in quickPhrases" :key="q" class="vm-pill" @click="sendQuick(q)">{{ q }}</button>
            </div>
          </div>

          <!-- Controls -->
          <div class="vm-controls">
            <button
              class="vm-mic"
              :class="{ 'mic-listening': isListening, 'mic-speaking': isSpeaking, 'mic-processing': isProcessing }"
              :disabled="isProcessing"
              @click="toggleMic"
            >
              <div class="mic-rings" v-if="isListening">
                <span class="mr mr1"/><span class="mr mr2"/>
              </div>
              <svg v-if="!isListening && !isProcessing" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              <svg v-else-if="isListening" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="3"/>
              </svg>
              <div v-else class="mic-spinner" />
              <span class="mic-label">{{ micLabel }}</span>
            </button>
            <button v-if="isSpeaking" class="vm-stop" @click="stopSpeaking">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              Stop speaking
            </button>
          </div>

          <div v-if="error" class="vm-error">{{ error }}</div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ workspaceId: string }>()

const {
  isListening, isSpeaking, isProcessing, isActive,
  transcript, interimText, error, conversation,
  startListening, stopListening, speakText, stopSpeaking,
  processVoiceInput, activate, deactivate
} = useVoiceMode(props.workspaceId)

const convEl = ref<HTMLElement>()

// --- CONFIG ---
const SILENCE_DELAY = 1200 // ms before auto-send
let silenceTimer: ReturnType<typeof setTimeout> | null = null

// --- STATE ---
const orbState = computed(() => {
  if (isListening.value)  return 'listening'
  if (isProcessing.value) return 'processing'
  if (isSpeaking.value)   return 'speaking'
  return 'idle'
})

const micLabel = computed(() => {
  if (isListening.value)  return 'Listening… tap to stop'
  if (isProcessing.value) return 'Processing…'
  if (isSpeaking.value)   return 'Speaking…'
  return 'Tap to start'
})

const quickPhrases = [
  'What tasks are running?',
  'What tools are connected?',
  'What databases are linked?',
  'Summarize recent work',
]

// --- AUTO SCROLL ---
watch(conversation, async () => {
  await nextTick()
  if (convEl.value) convEl.value.scrollTop = convEl.value.scrollHeight
}, { deep: true })

// --- SILENCE DETECTION ---
watch(interimText, () => {
  if (!isListening.value) return

  if (silenceTimer) clearTimeout(silenceTimer)

  silenceTimer = setTimeout(() => {
    finalizeSpeech()
  }, SILENCE_DELAY)
})

// --- FINAL TRANSCRIPT WATCH (fallback) ---
watch(transcript, (val) => {
  if (!isListening.value || !val) return

  if (silenceTimer) clearTimeout(silenceTimer)

  silenceTimer = setTimeout(() => {
    finalizeSpeech()
  }, SILENCE_DELAY)
})

// --- FINALIZE SPEECH ---
function finalizeSpeech() {
  if (!isListening.value) return

  stopListening()

  const text = transcript.value.trim()
  if (!text) return

  processVoiceInput(text)
}

// --- AUTO RESUME AFTER RESPONSE ---
watch(isSpeaking, (val) => {
  if (!val && isActive.value) {
    // resume listening after assistant finishes
    startListening()
  }
})

// --- OPEN / CLOSE ---
function openVoiceMode() {
  activate()
  nextTick(() => startListening())
}

function closeVoiceMode() {
  stopListening()
  stopSpeaking()
  deactivate()
}

// --- MIC TOGGLE ---
function toggleMic() {
  if (isListening.value || isSpeaking.value || isProcessing.value) {
    // full stop
    stopListening()
    stopSpeaking()
    if (silenceTimer) clearTimeout(silenceTimer)
  } else {
    startListening()
  }
}

// --- QUICK SEND ---
function sendQuick(text: string) {
  conversation.value.push({
    id: Date.now().toString(),
    role: 'user',
    text,
    timestamp: new Date()
  })

  processVoiceInput(text)
}
</script>

<style scoped>
/* FAB */
.voice-fab {
  position: fixed; bottom: 54px; right: 68px;
  width: 52px; height: 52px; border-radius: 50%;
  background: linear-gradient(135deg, #c33aed 0%, #db5427 100%);
  /*background: linear-gradient(145deg, #7c3aed 0%, #db2777 100%); */
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff; z-index: 400;
  box-shadow: 0 6px 16px rgba(0,0,0,.18);
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
  overflow: visible;
}

.voice-fab:hover {
  transform: scale(1.06) translateY(-1px);
  box-shadow: 0 10px 22px rgba(0,0,0,.22);
}
.voice-fab.fab-listening {
  background: linear-gradient(145deg, #f97316 0%, #ef4444 100%);
  box-shadow: 0 8px 20px rgba(239,68,68,.35);
}

.fab-pulse {
  position: absolute; inset: -2px; border-radius: 50%;
  background: inherit;
  animation: fab-glow 3s ease-in-out infinite;
  pointer-events: none;
}

/* stronger + faster pulse when listening */
.fab-listening .fab-pulse {
  animation: fab-glow-fast .9s ease-in-out infinite;
}

@keyframes fab-glow {
  0%,100% { opacity: 0; transform: scale(1); }
  50% { opacity: .18; transform: scale(1.08); }
}

@keyframes fab-glow-fast {
  0%,100% { opacity: .2; transform: scale(1); }
  50% { opacity: .4; transform: scale(1.14); }
}
/* Backdrop */
.vm-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.65);
  backdrop-filter: blur(14px) saturate(1.5);
  z-index: 800;
  display: flex; align-items: center; justify-content: center;
}
.vm-fade-enter-active, .vm-fade-leave-active { transition: opacity .2s, transform .22s cubic-bezier(.34,1.56,.64,1); }
.vm-fade-enter-from, .vm-fade-leave-to { opacity: 0; transform: scale(.93) translateY(10px); }

/* Panel */
.vm-panel {
  width: 448px; max-width: 95vw;
  background: linear-gradient(180deg, rgba(12,8,28,.98) 0%, rgba(8,6,18,.99) 100%);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 28px;
  box-shadow: 0 48px 120px rgba(0,0,0,.7), 0 0 0 1px rgba(124,58,237,.12), inset 0 1px 0 rgba(255,255,255,.04);
  display: flex; flex-direction: column;
  overflow: hidden; max-height: 90vh;
}

/* Header */
.vm-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 22px 16px;
  border-bottom: 1px solid rgba(255,255,255,.055);
}
.vm-logo { display: flex; align-items: center; gap: 12px; }
.vm-logo-icon {
  width: 32px; height: 32px; border-radius: 9px;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.1);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.vm-logo-text { display: flex; flex-direction: column; gap: 2px; }
.vm-title { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -.015em; }
.vm-subtitle { font-size: 11px; color: rgba(255,255,255,.3); font-weight: 500; letter-spacing: .01em; }
.vm-close {
  width: 32px; height: 32px; border-radius: 9px;
  background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.07);
  color: rgba(255,255,255,.38); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
.vm-close:hover { background: rgba(255,255,255,.1); color: #fff; }

/* Visualizer */
.vm-visualizer {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  height: 164px;
}
.vis-rings { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.vis-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(124,58,237,.12); transition: border-color .35s; }
.r1 { width: 148px; height: 148px; }
.r2 { width: 112px; height: 112px; }
.r3 { width: 82px;  height: 82px;  }

.vm-visualizer.listening .vis-ring { border-color: rgba(124,58,237,.45); }
.vm-visualizer.listening .r1 { animation: ring-out 2.2s ease-out infinite; }
.vm-visualizer.listening .r2 { animation: ring-out 2.2s ease-out infinite .4s; }
.vm-visualizer.listening .r3 { animation: ring-out 2.2s ease-out infinite .8s; }
.vm-visualizer.speaking .vis-ring { border-color: rgba(16,185,129,.4); }
.vm-visualizer.speaking .r1 { animation: ring-out 1.6s ease-out infinite; }
.vm-visualizer.speaking .r2 { animation: ring-out 1.6s ease-out infinite .28s; }
.vm-visualizer.speaking .r3 { animation: ring-out 1.6s ease-out infinite .56s; }
@keyframes ring-out { 0%{transform:scale(.88);opacity:.9} 100%{transform:scale(1.18);opacity:0} }

.vis-orb {
  width: 76px; height: 76px; border-radius: 50%; position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  background: rgba(124,58,237,.12);
  border: 1.5px solid rgba(124,58,237,.28);
  box-shadow: 0 0 36px rgba(124,58,237,.18), inset 0 1px 0 rgba(255,255,255,.07);
  transition: all .3s ease;
}
.vm-visualizer.listening .vis-orb {
  background: rgba(124,58,237,.38); border-color: rgba(124,58,237,.75);
  box-shadow: 0 0 48px rgba(124,58,237,.55), inset 0 1px 0 rgba(255,255,255,.1);
}
.vm-visualizer.speaking .vis-orb {
  background: rgba(16,185,129,.3); border-color: rgba(16,185,129,.6);
  box-shadow: 0 0 44px rgba(16,185,129,.4);
}

/* Idle bars */
.vis-idle-bars { display: flex; gap: 3.5px; align-items: center; }
.idle-bar {
  display: block; width: 3px; border-radius: 2px;
  background: rgba(167,139,250,.45);
  height: 8px;
}
.idle-bar:nth-child(1) { height:6px }
.idle-bar:nth-child(2) { height:12px }
.idle-bar:nth-child(3) { height:18px }
.idle-bar:nth-child(4) { height:22px }
.idle-bar:nth-child(5) { height:18px }
.idle-bar:nth-child(6) { height:12px }
.idle-bar:nth-child(7) { height:6px }

/* Listening wave */
.vis-wave { display: flex; gap: 3.5px; align-items: center; }
.wave-bar {
  display: block; width: 3.5px; border-radius: 3px; background: #a78bfa;
  animation: wv .75s ease-in-out infinite alternate;
  height: 6px;
}
.wave-bar:nth-child(1){animation-delay:0s}
.wave-bar:nth-child(2){animation-delay:.07s}
.wave-bar:nth-child(3){animation-delay:.14s}
.wave-bar:nth-child(4){animation-delay:.21s}
.wave-bar:nth-child(5){animation-delay:.14s}
.wave-bar:nth-child(6){animation-delay:.07s}
.wave-bar:nth-child(7){animation-delay:0s}
@keyframes wv { 0%{height:4px;opacity:.45} 100%{height:28px;opacity:1} }

/* Processing */
.vis-processing { display: flex; gap: 6px; align-items: center; }
.vis-processing span { width: 7px; height: 7px; border-radius: 50%; background: #7c3aed; animation: pdot 1.2s infinite; }
.vis-processing span:nth-child(2){animation-delay:.2s}
.vis-processing span:nth-child(3){animation-delay:.4s}
@keyframes pdot { 0%,80%,100%{transform:scale(.45);opacity:.35} 40%{transform:scale(1);opacity:1} }

/* Speaking */
.vis-speaking { display: flex; gap: 4px; align-items: center; }
.speak-bar {
  display: block; width: 3.5px; border-radius: 3px; background: #34d399;
  animation: spk .55s ease-in-out infinite alternate;
}
.speak-bar:nth-child(1){animation-delay:0s;height:8px}
.speak-bar:nth-child(2){animation-delay:.1s;height:16px}
.speak-bar:nth-child(3){animation-delay:.2s;height:24px}
.speak-bar:nth-child(4){animation-delay:.1s;height:16px}
.speak-bar:nth-child(5){animation-delay:0s;height:8px}
@keyframes spk { 0%{height:4px} 100%{height:26px} }

/* Status */
.vm-status {
  text-align: center; font-size: 13.5px; font-weight: 500;
  color: rgba(255,255,255,.32); padding: 0 24px 22px; transition: color .25s; min-height: 22px;
}
.vm-status.listening { color: #c4b5fd; }
.vm-status.speaking  { color: #6ee7b7; }
.vm-status.processing { color: rgba(255,255,255,.5); }

/* Conversation */
.vm-conversation {
  flex: 1; overflow-y: auto; padding: 14px 18px 4px;
  display: flex; flex-direction: column; gap: 10px;
  max-height: 210px;
  border-top: 1px solid rgba(255,255,255,.05);
}
.vm-conversation::-webkit-scrollbar { width: 3px; }
.vm-conversation::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 3px; }

.vm-msg { display: flex; align-items: flex-end; gap: 8px; }
.vm-msg.user { justify-content: flex-end; }
.vm-msg.assistant { justify-content: flex-start; }

.vm-avatar {
  width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  display: flex; align-items: center; justify-content: center;
  color: white; margin-bottom: 1px;
}
.vm-bubble {
  max-width: 78%; padding: 10px 14px; font-size: 13px; line-height: 1.55;
}
.vm-msg.user .vm-bubble {
  background: rgba(109,40,217,.25); border: 1px solid rgba(109,40,217,.32);
  color: #ddd6fe; border-radius: 16px 16px 4px 16px;
}
.vm-msg.assistant .vm-bubble {
  background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.08);
  color: rgba(255,255,255,.82); border-radius: 16px 16px 16px 4px;
}

/* Empty */
.vm-empty {
  padding: 14px 20px 4px; border-top: 1px solid rgba(255,255,255,.05);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.vm-hint { font-size: 12px; color: rgba(255,255,255,.28); }
.vm-pills { display: flex; flex-wrap: wrap; gap: 7px; justify-content: center; }
.vm-pill {
  font-size: 11.5px; padding: 6px 13px;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
  border-radius: 20px; color: rgba(255,255,255,.45); cursor: pointer; transition: all .15s;
}
.vm-pill:hover { background: rgba(124,58,237,.2); border-color: rgba(124,58,237,.4); color: #c4b5fd; transform: translateY(-1px); }

/* Controls */
.vm-controls {
  padding: 18px 20px 22px; display: flex; flex-direction: column; align-items: center; gap: 10px;
  border-top: 1px solid rgba(255,255,255,.05);
}
.vm-mic {
  position: relative;
  display: flex; align-items: center; gap: 10px;
  padding: 14px 34px; border-radius: 50px;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff; border: none; cursor: pointer;
  font-size: 14px; font-weight: 600; letter-spacing: .01em;
  transition: all .2s cubic-bezier(.34,1.56,.64,1);
  box-shadow: 0 6px 24px rgba(79,70,229,.45), 0 2px 8px rgba(0,0,0,.3);
  overflow: visible;
}
.vm-mic:hover:not(:disabled) { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 32px rgba(79,70,229,.6); }
.vm-mic.mic-listening { background: linear-gradient(135deg, #dc2626, #b91c1c); box-shadow: 0 6px 24px rgba(220,38,38,.5); animation: mic-pulse 1.5s ease-in-out infinite; }
.vm-mic.mic-processing { opacity: .55; cursor: not-allowed; }
.mic-label { position: relative; z-index: 1; }
@keyframes mic-pulse { 0%,100%{box-shadow:0 6px 24px rgba(220,38,38,.5)} 50%{box-shadow:0 6px 32px rgba(220,38,38,.8)} }

.mic-rings { position: absolute; inset: -6px; pointer-events: none; }
.mr { position: absolute; inset: 0; border-radius: 50px; border: 2px solid rgba(220,38,38,.45); }
.mr1 { animation: mr-out 1.4s ease-out infinite; }
.mr2 { animation: mr-out 1.4s ease-out infinite .5s; }
@keyframes mr-out { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(1.45);opacity:0} }

.mic-spinner {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.28); border-top-color: #fff;
  animation: spin .8s linear infinite;
}
@keyframes spin { to{transform:rotate(360deg)} }

.vm-stop {
  display: flex; align-items: center; gap: 7px; padding: 7px 16px; border-radius: 20px;
  background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.09);
  color: rgba(255,255,255,.45); font-size: 12px; cursor: pointer; transition: all .13s;
}
.vm-stop:hover { background: rgba(239,68,68,.14); color: #f87171; border-color: rgba(239,68,68,.28); }

.vm-error {
  margin: 0 20px 16px; padding: 10px 14px;
  background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.22);
  border-radius: 10px; color: #f87171; font-size: 12px; text-align: center;
}
/* Animated waveform on logo icon */
.logo-wave .lw { transform-origin: center bottom; animation: logo-wv 2.4s ease-in-out infinite; }
.logo-wave .lw1 { animation-delay: 0s; }
.logo-wave .lw2 { animation-delay: .15s; }
.logo-wave .lw3 { animation-delay: .3s; }
.logo-wave .lw4 { animation-delay: .15s; }
.logo-wave .lw5 { animation-delay: 0s; }
.logo-wave .lw6 { animation-delay: .1s; }
@keyframes logo-wv {
  0%, 100% { transform: scaleY(0.6); opacity: 0.4; }
  50%       { transform: scaleY(1);   opacity: 1; }
}

/* FAB waveform animation */
.fab-wave .fw { transform-origin: center bottom; animation: fab-wv 1.8s ease-in-out infinite; }
.fab-wave .fw1 { animation-delay: 0s; }
.fab-wave .fw2 { animation-delay: .1s; }
.fab-wave .fw3 { animation-delay: .2s; }
.fab-wave .fw4 { animation-delay: .1s; }
.fab-wave .fw5 { animation-delay: 0s; }
.fab-wave .fw6 { animation-delay: .05s; }
@keyframes fab-wv {
  0%, 100% { transform: scaleY(0.55); }
  50%       { transform: scaleY(1); }
}


/* Debug panel */
.vm-debug {
  margin: 0 18px 12px;
  padding: 10px 14px;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11.5px;
  font-family: monospace;
}
.vm-debug-row { display: flex; gap: 8px; align-items: flex-start; }
.vm-debug-label { color: rgba(255,255,255,.3); min-width: 62px; flex-shrink: 0; }
.vm-debug-val { color: rgba(255,255,255,.6); word-break: break-word; }
.vm-debug-val.listening { color: #c4b5fd; }
.vm-debug-val.speaking  { color: #6ee7b7; }
.vm-debug-val.processing { color: #fbbf24; }
.vm-debug-val.interim   { color: #93c5fd; font-style: italic; }
.vm-debug-val.user      { color: #ddd6fe; }
.vm-debug-val.bot       { color: #6ee7b7; }
.vm-debug-val.error     { color: #f87171; }

</style>