<template>
  <Teleport to="body">
    <!-- Floating FAB -->
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
        <rect x="9"  y="2"  width="2" height="20" rx="1" fill="currentColor"               class="fw fw3"/>
        <rect x="13" y="5"  width="2" height="14" rx="1" fill="currentColor" opacity="0.7" class="fw fw4"/>
        <rect x="17" y="8"  width="2" height="8"  rx="1" fill="currentColor" opacity="0.5" class="fw fw5"/>
        <rect x="21" y="10" width="2" height="4"  rx="1" fill="currentColor" opacity="0.3" class="fw fw6"/>
      </svg>
    </button>

    <Transition name="vm-fade">
      <div v-if="isActive" class="vm-fullscreen">

        <!-- Aurora background blobs -->
        <div class="vm-aurora">
          <div class="aurora-blob ab1" />
          <div class="aurora-blob ab2" />
          <div class="aurora-blob ab3" />
          <div class="aurora-blob ab4" />
        </div>

        <!-- Grain overlay -->
        <canvas ref="grainCanvas" class="vm-grain" />

        <!-- Top bar -->
        <header class="vm-topbar">
          <div class="vm-logo">
            <div class="vm-logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="logo-wave">
                <rect x="1"  y="9"  width="2" height="6"  rx="1" fill="white" opacity="0.4"  class="lw lw1"/>
                <rect x="5"  y="5"  width="2" height="14" rx="1" fill="white" opacity="0.65" class="lw lw2"/>
                <rect x="9"  y="2"  width="2" height="20" rx="1" fill="white"                class="lw lw3"/>
                <rect x="13" y="5"  width="2" height="14" rx="1" fill="white" opacity="0.65" class="lw lw4"/>
                <rect x="17" y="8"  width="2" height="8"  rx="1" fill="white" opacity="0.4"  class="lw lw5"/>
                <rect x="21" y="10" width="2" height="4"  rx="1" fill="white" opacity="0.25" class="lw lw6"/>
              </svg>
            </div>
            <div class="vm-logo-text">
              <span class="vm-title">Voice Assistant</span>
              <span class="vm-subtitle">Atlantir Workspace AI</span>
            </div>
          </div>
          <button class="vm-close" @click="closeVoiceMode">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </header>

        <!-- Center stage -->
        <div class="vm-stage">

          <!-- Orb visualizer -->
          <div class="vm-orb-wrap" :class="orbState">
            <div class="orb-ring r1" />
            <div class="orb-ring r2" />
            <div class="orb-ring r3" />
            <div class="orb-ring r4" />
            <div class="orb-core">
              <!-- Idle: static equalizer shape -->
              <div v-if="orbState === 'idle'" class="vis-idle">
                <span v-for="i in 9" :key="i" class="idle-bar" :style="`--i:${i}`" />
              </div>
              <!-- Listening: animated tall bars -->
              <div v-else-if="orbState === 'listening'" class="vis-listen">
                <span v-for="i in 9" :key="i" class="listen-bar" :style="`--i:${i}`" />
              </div>
              <!-- Processing: orbiting dots -->
              <div v-else-if="orbState === 'processing'" class="vis-process">
                <span /><span /><span /><span />
              </div>
              <!-- Speaking: flowing wave -->
              <div v-else-if="orbState === 'speaking'" class="vis-speak">
                <span v-for="i in 7" :key="i" class="speak-bar" :style="`--i:${i}`" />
              </div>
            </div>
          </div>

          <!-- Status text -->
          <div class="vm-state-label" :class="orbState">
            <Transition name="label-swap" mode="out-in">
              <span v-if="isListening"   key="l">{{ interimText || transcript || 'Listening…' }}</span>
              <span v-else-if="isProcessing" key="p">Processing…</span>
              <span v-else-if="isSpeaking"   key="s">Speaking…</span>
              <span v-else                   key="i">Tap to speak</span>
            </Transition>
          </div>
        </div>

        <!-- Conversation feed -->
        <div class="vm-feed-wrap">
          <div v-if="conversation.length" ref="convEl" class="vm-feed">
            <div v-for="msg in conversation" :key="msg.id" class="vm-msg" :class="msg.role">
              <div v-if="msg.role === 'assistant'" class="vm-avatar">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="1"  y="9"  width="2" height="6"  rx="1" fill="currentColor" opacity="0.4"/>
                  <rect x="5"  y="5"  width="2" height="14" rx="1" fill="currentColor" opacity="0.7"/>
                  <rect x="9"  y="2"  width="2" height="20" rx="1" fill="currentColor"/>
                  <rect x="13" y="5"  width="2" height="14" rx="1" fill="currentColor" opacity="0.7"/>
                  <rect x="17" y="8"  width="2" height="8"  rx="1" fill="currentColor" opacity="0.4"/>
                </svg>
              </div>
              <div class="vm-bubble">{{ msg.text }}</div>
            </div>
          </div>

          <!-- Empty: quick phrases -->
          <div v-else class="vm-empty">
            <p class="vm-hint">Ask me anything about your workspace</p>
            <div class="vm-pills">
              <button v-for="q in quickPhrases" :key="q" class="vm-pill" @click="sendQuick(q)">{{ q }}</button>
            </div>
          </div>
        </div>

        <!-- Bottom controls -->
        <div class="vm-controls">
          <button
            class="vm-mic-btn"
            :class="{
              'state-listening':  isListening,
              'state-speaking':   isSpeaking,
              'state-processing': isProcessing,
            }"
            :disabled="isProcessing"
            @click="toggleMic"
          >
            <div class="mic-halo" v-if="isListening">
              <span /><span /><span />
            </div>

            <!-- Mic icon -->
            <svg v-if="!isListening && !isProcessing && !isSpeaking"
              width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
            </svg>

            <!-- Stop icon when listening -->
            <svg v-else-if="isListening"
              width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="3"/>
            </svg>

            <!-- Spinner when processing -->
            <div v-else-if="isProcessing" class="mic-spinner" />

            <!-- Wave when speaking -->
            <svg v-else-if="isSpeaking"
              width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 5L6 9H2v6h4l5 4V5z"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </button>

          <div class="vm-mic-label" :class="orbState">{{ micLabel }}</div>

          <button v-if="isSpeaking" class="vm-stop-btn" @click="stopSpeaking">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
            Stop
          </button>
        </div>

        <!-- Debug panel (remove in production) -->
        <div class="vm-debug" v-if="showDebug">
          <div class="vm-debug-row"><span class="dl">State</span><span class="dv" :class="orbState">{{ orbState }}</span></div>
          <div class="vm-debug-row" v-if="interimText"><span class="dl">Hearing</span><span class="dv interim">{{ interimText }}</span></div>
          <div class="vm-debug-row" v-if="transcript"><span class="dl">You said</span><span class="dv user">{{ transcript }}</span></div>
          <div class="vm-debug-row" v-if="lastBotMsg"><span class="dl">Bot said</span><span class="dv bot">{{ lastBotMsg }}</span></div>
          <div class="vm-debug-row" v-if="error"><span class="dl">Error</span><span class="dv err">{{ error }}</span></div>
        </div>

        <div v-if="error" class="vm-error">{{ error }}</div>

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
  processVoiceInput, activate, deactivate,
} = useVoiceMode(props.workspaceId)

const convEl      = ref<HTMLElement>()
const grainCanvas = ref<HTMLCanvasElement>()
const showDebug   = ref(true) // toggle to false in production

const orbState = computed(() => {
  if (isListening.value)  return 'listening'
  if (isProcessing.value) return 'processing'
  if (isSpeaking.value)   return 'speaking'
  return 'idle'
})

const micLabel = computed(() => {
  if (isListening.value)  return 'Tap to send'
  if (isProcessing.value) return 'Processing…'
  if (isSpeaking.value)   return 'Speaking'
  return 'Tap to speak'
})

const lastBotMsg = computed(() => {
  const last = [...conversation.value].reverse().find(m => m.role === 'assistant')
  return last?.text ?? ''
})

const quickPhrases = [
  'What tasks are running?',
  'What tools are connected?',
  'What databases are linked?',
  'Summarize recent work',
]

// Auto-scroll conversation
watch(conversation, async () => {
  await nextTick()
  if (convEl.value) convEl.value.scrollTop = convEl.value.scrollHeight
}, { deep: true })

// Grain canvas
onMounted(() => {
  const canvas = grainCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  let raf: number

  function drawGrain() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const img = ctx.createImageData(canvas.width, canvas.height)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255
      img.data[i] = img.data[i+1] = img.data[i+2] = v
      img.data[i+3] = 18 // very faint
    }
    ctx.putImageData(img, 0, 0)
    raf = requestAnimationFrame(drawGrain)
  }

  drawGrain()
  onUnmounted(() => cancelAnimationFrame(raf))
})

function openVoiceMode() {
  activate()
  nextTick(() => startListening())
}

function closeVoiceMode() { deactivate() }

function toggleMic() {
  if (isListening.value) {
    stopListening()
    const text = transcript.value.trim()
    if (text) processVoiceInput(text)
  } else if (!isSpeaking.value && !isProcessing.value) {
    startListening()
  }
}

function sendQuick(text: string) {
  conversation.value.push({ id: Date.now().toString(), role: 'user', text, timestamp: new Date() })
  processVoiceInput(text)
}
</script>

<style scoped>
/* ─── FAB ─────────────────────────────────────────────────── */
.voice-fab {
  position: fixed; bottom: 54px; right: 68px;
  width: 52px; height: 52px; border-radius: 50%;
  background: linear-gradient(135deg, #c33aed, #db5427);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #fff; z-index: 400;
  box-shadow: 0 6px 16px rgba(0,0,0,.25);
  transition: transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
  overflow: visible;
}
.voice-fab:hover { transform: scale(1.07) translateY(-1px); box-shadow: 0 10px 24px rgba(0,0,0,.28); }
.voice-fab.fab-listening {
  background: linear-gradient(145deg, #f97316, #ef4444);
  box-shadow: 0 8px 20px rgba(239,68,68,.4);
}
.fab-pulse {
  position: absolute; inset: -2px; border-radius: 50%; background: inherit;
  animation: fab-glow 3s ease-in-out infinite; pointer-events: none;
}
.fab-listening .fab-pulse { animation: fab-glow-fast .9s ease-in-out infinite; }
@keyframes fab-glow      { 0%,100%{opacity:0;transform:scale(1)} 50%{opacity:.18;transform:scale(1.08)} }
@keyframes fab-glow-fast { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:.4;transform:scale(1.14)} }

/* FAB waveform */
.fab-wave .fw { transform-origin: center bottom; animation: fab-wv 1.8s ease-in-out infinite; }
.fab-wave .fw1{animation-delay:0s} .fab-wave .fw2{animation-delay:.1s}
.fab-wave .fw3{animation-delay:.2s} .fab-wave .fw4{animation-delay:.1s}
.fab-wave .fw5{animation-delay:0s}  .fab-wave .fw6{animation-delay:.05s}
@keyframes fab-wv { 0%,100%{transform:scaleY(.55)} 50%{transform:scaleY(1)} }

/* ─── FULL SCREEN ─────────────────────────────────────────── */
.vm-fullscreen {
  position: fixed; inset: 0;
  background: #07050f;
  display: flex; flex-direction: column;
  align-items: center;
  z-index: 900;
  overflow: hidden;
}

/* Transition */
.vm-fade-enter-active { transition: opacity .25s ease, transform .3s cubic-bezier(.34,1.56,.64,1); }
.vm-fade-leave-active { transition: opacity .2s ease, transform .2s ease; }
.vm-fade-enter-from, .vm-fade-leave-to { opacity: 0; transform: scale(.96); }

/* ─── AURORA ─────────────────────────────────────────────── */
.vm-aurora { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.aurora-blob {
  position: absolute; border-radius: 50%;
  filter: blur(90px); opacity: .55;
  animation: drift 18s ease-in-out infinite alternate;
}
.ab1 { width: 560px; height: 560px; top: -160px; left: -100px; background: radial-gradient(circle, #7c3aed 0%, transparent 70%); animation-duration: 20s; }
.ab2 { width: 480px; height: 480px; top: -80px; right: -120px; background: radial-gradient(circle, #db2777 0%, transparent 70%); animation-duration: 16s; animation-delay: -6s; }
.ab3 { width: 400px; height: 400px; bottom: -100px; left: 10%; background: radial-gradient(circle, #2563eb 0%, transparent 70%); animation-duration: 22s; animation-delay: -10s; }
.ab4 { width: 340px; height: 340px; bottom: 60px; right: 5%; background: radial-gradient(circle, #0d9488 0%, transparent 70%); animation-duration: 14s; animation-delay: -3s; }
@keyframes drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(40px,30px) scale(1.08)} }

/* ─── GRAIN ──────────────────────────────────────────────── */
.vm-grain {
  position: absolute; inset: 0; pointer-events: none;
  mix-blend-mode: overlay; opacity: .4;
  z-index: 1;
}

/* ─── TOP BAR ────────────────────────────────────────────── */
.vm-topbar {
  position: relative; z-index: 10;
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  padding: 24px 32px 0;
}
.vm-logo { display: flex; align-items: center; gap: 12px; }
.vm-logo-icon {
  width: 34px; height: 34px; border-radius: 10px;
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.12);
  display: flex; align-items: center; justify-content: center;
}
.vm-logo-text { display: flex; flex-direction: column; gap: 1px; }
.vm-title    { font-size: 15px; font-weight: 700; color: #fff; letter-spacing: -.015em; }
.vm-subtitle { font-size: 11px; color: rgba(255,255,255,.3); font-weight: 500; letter-spacing: .01em; }
.vm-close {
  width: 34px; height: 34px; border-radius: 10px;
  background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08);
  color: rgba(255,255,255,.4); cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
.vm-close:hover { background: rgba(255,255,255,.12); color: #fff; }

/* Logo wave */
.logo-wave .lw { transform-origin: center bottom; animation: logo-wv 2.4s ease-in-out infinite; }
.logo-wave .lw1{animation-delay:0s}   .logo-wave .lw2{animation-delay:.15s}
.logo-wave .lw3{animation-delay:.3s}  .logo-wave .lw4{animation-delay:.15s}
.logo-wave .lw5{animation-delay:0s}   .logo-wave .lw6{animation-delay:.1s}
@keyframes logo-wv { 0%,100%{transform:scaleY(.6);opacity:.4} 50%{transform:scaleY(1);opacity:1} }

/* ─── STAGE (orb area) ───────────────────────────────────── */
.vm-stage {
  position: relative; z-index: 10;
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 36px;
}

/* Orb wrap + rings */
.vm-orb-wrap {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 260px; height: 260px;
}

.orb-ring {
  position: absolute; border-radius: 50%;
  border: 1px solid rgba(124,58,237,.12);
  transition: border-color .4s, transform .4s;
}
.r1 { width: 260px; height: 260px; }
.r2 { width: 210px; height: 210px; }
.r3 { width: 162px; height: 162px; }
.r4 { width: 118px; height: 118px; }

/* Listening rings */
.vm-orb-wrap.listening .orb-ring { border-color: rgba(124,58,237,.5); }
.vm-orb-wrap.listening .r1 { animation: ring-pulse 2.4s ease-out infinite; }
.vm-orb-wrap.listening .r2 { animation: ring-pulse 2.4s ease-out infinite .4s; }
.vm-orb-wrap.listening .r3 { animation: ring-pulse 2.4s ease-out infinite .8s; }
.vm-orb-wrap.listening .r4 { animation: ring-pulse 2.4s ease-out infinite 1.2s; }

/* Speaking rings */
.vm-orb-wrap.speaking .orb-ring { border-color: rgba(16,185,129,.45); }
.vm-orb-wrap.speaking .r1 { animation: ring-pulse 1.6s ease-out infinite; }
.vm-orb-wrap.speaking .r2 { animation: ring-pulse 1.6s ease-out infinite .28s; }
.vm-orb-wrap.speaking .r3 { animation: ring-pulse 1.6s ease-out infinite .56s; }
.vm-orb-wrap.speaking .r4 { animation: ring-pulse 1.6s ease-out infinite .84s; }

@keyframes ring-pulse { 0%{transform:scale(.88);opacity:.85} 100%{transform:scale(1.12);opacity:0} }

/* Core orb */
.orb-core {
  width: 100px; height: 100px; border-radius: 50%;
  background: rgba(124,58,237,.1);
  border: 1.5px solid rgba(124,58,237,.3);
  box-shadow: 0 0 60px rgba(124,58,237,.2), inset 0 1px 0 rgba(255,255,255,.07);
  display: flex; align-items: center; justify-content: center;
  transition: all .35s ease; position: relative; z-index: 2;
}
.vm-orb-wrap.listening .orb-core {
  background: rgba(124,58,237,.38); border-color: rgba(147,77,255,.8);
  box-shadow: 0 0 80px rgba(124,58,237,.6), 0 0 120px rgba(124,58,237,.25), inset 0 1px 0 rgba(255,255,255,.1);
  transform: scale(1.06);
}
.vm-orb-wrap.speaking .orb-core {
  background: rgba(16,185,129,.28); border-color: rgba(52,211,153,.7);
  box-shadow: 0 0 70px rgba(16,185,129,.45); transform: scale(1.04);
}
.vm-orb-wrap.processing .orb-core {
  background: rgba(124,58,237,.15); border-color: rgba(124,58,237,.4);
  box-shadow: 0 0 50px rgba(124,58,237,.3);
  animation: orb-breathe 1.8s ease-in-out infinite;
}
@keyframes orb-breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }

/* ─── VISUALIZER STATES ──────────────────────────────────── */
/* Idle bars */
.vis-idle { display: flex; gap: 3px; align-items: flex-end; height: 32px; }
.idle-bar {
  display: block; width: 3px; border-radius: 2px;
  background: rgba(167,139,250,.5);
}
.idle-bar:nth-child(1){height:8px}  .idle-bar:nth-child(2){height:14px}
.idle-bar:nth-child(3){height:22px} .idle-bar:nth-child(4){height:28px}
.idle-bar:nth-child(5){height:32px} .idle-bar:nth-child(6){height:28px}
.idle-bar:nth-child(7){height:22px} .idle-bar:nth-child(8){height:14px}
.idle-bar:nth-child(9){height:8px}

/* Listening bars */
.vis-listen { display: flex; gap: 3px; align-items: center; }
.listen-bar {
  display: block; width: 3.5px; border-radius: 3px; background: #a78bfa;
  animation: wv .65s ease-in-out infinite alternate;
  animation-delay: calc((var(--i) - 1) * .07s);
  height: 6px;
}
@keyframes wv { 0%{height:4px;opacity:.4} 100%{height:34px;opacity:1} }

/* Processing dots */
.vis-process {
  display: flex; gap: 7px; align-items: center;
  animation: proc-orbit 2s linear infinite;
}
.vis-process span {
  width: 7px; height: 7px; border-radius: 50%; background: #7c3aed;
  animation: pdot 1.2s infinite;
}
.vis-process span:nth-child(1){animation-delay:0s}
.vis-process span:nth-child(2){animation-delay:.2s}
.vis-process span:nth-child(3){animation-delay:.4s}
.vis-process span:nth-child(4){animation-delay:.6s}
@keyframes pdot { 0%,80%,100%{transform:scale(.4);opacity:.3} 40%{transform:scale(1);opacity:1} }

/* Speaking bars */
.vis-speak { display: flex; gap: 4px; align-items: center; }
.speak-bar {
  display: block; width: 4px; border-radius: 3px; background: #34d399;
  animation: spk .5s ease-in-out infinite alternate;
  animation-delay: calc((var(--i) - 1) * .1s);
  height: 8px;
}
@keyframes spk { 0%{height:4px;opacity:.5} 100%{height:30px;opacity:1} }

/* ─── STATE LABEL ────────────────────────────────────────── */
.vm-state-label {
  font-size: 17px; font-weight: 500; letter-spacing: -.01em;
  color: rgba(255,255,255,.28); transition: color .3s;
  min-height: 26px; text-align: center; max-width: 340px;
}
.vm-state-label.listening  { color: #c4b5fd; }
.vm-state-label.speaking   { color: #6ee7b7; }
.vm-state-label.processing { color: rgba(255,255,255,.55); }

/* Label crossfade */
.label-swap-enter-active { transition: opacity .2s, transform .2s; }
.label-swap-leave-active { transition: opacity .15s, transform .15s; }
.label-swap-enter-from   { opacity: 0; transform: translateY(6px); }
.label-swap-leave-to     { opacity: 0; transform: translateY(-6px); }

/* ─── FEED / CONVERSATION ────────────────────────────────── */
.vm-feed-wrap {
  position: relative; z-index: 10;
  width: 100%; max-width: 640px; padding: 0 24px;
}
.vm-feed {
  max-height: 200px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 10px;
  padding: 16px 0 4px;
  border-top: 1px solid rgba(255,255,255,.06);
}
.vm-feed::-webkit-scrollbar { width: 3px; }
.vm-feed::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 3px; }

.vm-msg { display: flex; align-items: flex-end; gap: 8px; }
.vm-msg.user      { justify-content: flex-end; }
.vm-msg.assistant { justify-content: flex-start; }

.vm-avatar {
  width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  display: flex; align-items: center; justify-content: center; color: white;
}
.vm-bubble {
  max-width: 78%; padding: 10px 14px;
  font-size: 13.5px; line-height: 1.55;
}
.vm-msg.user .vm-bubble {
  background: rgba(109,40,217,.22); border: 1px solid rgba(109,40,217,.3);
  color: #ddd6fe; border-radius: 16px 16px 4px 16px;
}
.vm-msg.assistant .vm-bubble {
  background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.08);
  color: rgba(255,255,255,.82); border-radius: 16px 16px 16px 4px;
}

/* Empty state */
.vm-empty {
  padding: 16px 0 4px;
  border-top: 1px solid rgba(255,255,255,.06);
  display: flex; flex-direction: column; align-items: center; gap: 14px;
}
.vm-hint { font-size: 12.5px; color: rgba(255,255,255,.25); }
.vm-pills { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.vm-pill {
  font-size: 12px; padding: 7px 15px;
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08);
  border-radius: 20px; color: rgba(255,255,255,.42); cursor: pointer; transition: all .15s;
}
.vm-pill:hover {
  background: rgba(124,58,237,.2); border-color: rgba(124,58,237,.4);
  color: #c4b5fd; transform: translateY(-1px);
}

/* ─── CONTROLS ───────────────────────────────────────────── */
.vm-controls {
  position: relative; z-index: 10;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 20px 20px 40px;
}

.vm-mic-btn {
  position: relative;
  width: 72px; height: 72px; border-radius: 50%;
  background: linear-gradient(145deg, #7c3aed, #4f46e5);
  border: none; cursor: pointer; color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 30px rgba(79,70,229,.5), 0 2px 8px rgba(0,0,0,.3);
  transition: all .2s cubic-bezier(.34,1.56,.64,1);
  overflow: visible;
}
.vm-mic-btn:hover:not(:disabled) { transform: scale(1.07); box-shadow: 0 12px 40px rgba(79,70,229,.65); }
.vm-mic-btn.state-listening {
  background: linear-gradient(145deg, #dc2626, #b91c1c);
  box-shadow: 0 8px 30px rgba(220,38,38,.55);
  animation: mic-pulse 1.4s ease-in-out infinite;
}
.vm-mic-btn.state-speaking {
  background: linear-gradient(145deg, #059669, #0d9488);
  box-shadow: 0 8px 30px rgba(5,150,105,.5);
}
.vm-mic-btn.state-processing { opacity: .5; cursor: not-allowed; }
@keyframes mic-pulse { 0%,100%{box-shadow:0 8px 30px rgba(220,38,38,.55)} 50%{box-shadow:0 8px 44px rgba(220,38,38,.9)} }

/* Halo rings on listening */
.mic-halo { position: absolute; inset: -8px; pointer-events: none; }
.mic-halo span {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1.5px solid rgba(220,38,38,.45);
}
.mic-halo span:nth-child(1) { animation: halo 1.6s ease-out infinite; }
.mic-halo span:nth-child(2) { animation: halo 1.6s ease-out infinite .45s; }
.mic-halo span:nth-child(3) { animation: halo 1.6s ease-out infinite .9s; }
@keyframes halo { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(1.6);opacity:0} }

.mic-spinner {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,.25); border-top-color: #fff;
  animation: spin .8s linear infinite;
}
@keyframes spin { to{transform:rotate(360deg)} }

.vm-mic-label {
  font-size: 12.5px; font-weight: 500;
  color: rgba(255,255,255,.28); letter-spacing: .03em; text-transform: uppercase;
  transition: color .3s;
}
.vm-mic-label.listening  { color: #c4b5fd; }
.vm-mic-label.speaking   { color: #6ee7b7; }
.vm-mic-label.processing { color: rgba(255,255,255,.5); }

.vm-stop-btn {
  display: flex; align-items: center; gap: 7px; padding: 7px 18px; border-radius: 20px;
  background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
  color: rgba(255,255,255,.4); font-size: 12px; cursor: pointer; transition: all .13s;
}
.vm-stop-btn:hover { background: rgba(239,68,68,.14); color: #f87171; border-color: rgba(239,68,68,.28); }

/* ─── ERROR ──────────────────────────────────────────────── */
.vm-error {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  padding: 10px 20px;
  background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.22);
  border-radius: 12px; color: #f87171; font-size: 12.5px; z-index: 20;
  white-space: nowrap;
}

/* ─── DEBUG PANEL ────────────────────────────────────────── */
.vm-debug {
  position: absolute; bottom: 70px; left: 24px;
  padding: 10px 14px;
  background: rgba(0,0,0,.45); border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px; font-size: 11px; font-family: monospace;
  display: flex; flex-direction: column; gap: 5px;
  z-index: 20; backdrop-filter: blur(8px);
}
.vm-debug-row { display: flex; gap: 10px; }
.dl { color: rgba(255,255,255,.3); min-width: 55px; }
.dv { color: rgba(255,255,255,.6); }
.dv.listening { color: #c4b5fd; } .dv.speaking { color: #6ee7b7; }
.dv.processing { color: #fbbf24; } .dv.interim { color: #93c5fd; font-style: italic; }
.dv.user { color: #ddd6fe; } .dv.bot { color: #6ee7b7; } .dv.err { color: #f87171; }
</style>