export interface VoiceMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: Date
}

export function useVoiceMode(workspaceId: string) {
  const config = useRuntimeConfig()
  const supabase = useSupabaseClient()

  const isListening   = ref(false)
  const isSpeaking    = ref(false)
  const isProcessing  = ref(false)
  const isActive      = ref(false)
  const transcript    = ref('')
  const interimText   = ref('')
  const error         = ref('')
  const conversation  = ref<VoiceMessage[]>([])

  let socket: WebSocket | null = null
  let mediaRecorder: MediaRecorder | null = null
  let micStream: MediaStream | null = null
  let audioContext: AudioContext | null = null
  let currentAudio: HTMLAudioElement | null = null
  let silenceTimer: ReturnType<typeof setTimeout> | null = null
  let accumulatedTranscript = ''

  // ─── Deepgram STT ────────────────────────────────────────────────────────────

  async function startListening() {
    if (isListening.value || isSpeaking.value || isProcessing.value) return
    error.value = ''
    transcript.value = ''
    interimText.value = ''
    accumulatedTranscript = ''

    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 16000,
          channelCount: 1,
        }
      })

      // Log actual mic track settings
      const track = micStream.getAudioTracks()[0]
      console.log('[DG] Mic track:', track.label, JSON.stringify(track.getSettings()))
    } catch {
      error.value = 'Microphone access denied. Please allow mic access and try again.'
      return
    }

    const key = config.public.deepgramApiKey as string
    if (!key) { error.value = 'Deepgram API key not configured'; return }

    socket = new WebSocket(
      `wss://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true&interim_results=true&utterance_end_ms=1000`,
      ['token', key]
    )

    socket.onopen = () => {
      console.log('[DG] WebSocket opened ✓')
      isListening.value = true
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus' : 'audio/webm'
      mediaRecorder = new MediaRecorder(micStream!, { mimeType })
      let chunkCount = 0
      console.log('[DG] MediaRecorder mimeType:', mediaRecorder.mimeType)
      mediaRecorder.addEventListener('dataavailable', (e) => {
        chunkCount++
        if (chunkCount <= 5 || chunkCount % 20 === 0)
          console.log(`[DG] chunk #${chunkCount} size=${e.data.size} socketState=${socket?.readyState}`)
        if (e.data.size > 0 && socket?.readyState === WebSocket.OPEN) socket.send(e.data)
      })
      mediaRecorder.start(250)
    }

    socket.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        console.log('[DG] msg type:', data.type, '| is_final:', data.is_final, '| transcript:', data?.channel?.alternatives?.[0]?.transcript?.slice(0,50))

        if (data.type === 'SpeechStarted') {
          if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null }
        }

        if (data.type === 'UtteranceEnd' && accumulatedTranscript.trim()) {
          stopListeningAndProcess()
          return
        }

        const alt = data?.channel?.alternatives?.[0]
        if (!alt?.transcript) return

        if (data.is_final) {
          accumulatedTranscript += (accumulatedTranscript ? ' ' : '') + alt.transcript
          transcript.value = accumulatedTranscript
          interimText.value = ''
          // Auto-submit after 1.5s silence following a final word
          if (silenceTimer) clearTimeout(silenceTimer)
          silenceTimer = setTimeout(() => {
            if (accumulatedTranscript.trim()) stopListeningAndProcess()
          }, 1500)
        } else {
          interimText.value = alt.transcript
        }
      } catch {}
    }

    socket.onerror  = (e) => { error.value = `Voice connection failed — check Deepgram key`; console.error('DG WS error', e); stopMic() }
    socket.onclose  = (e) => {
      isListening.value = false
      console.log('DG WS closed', e.code, e.reason)
      if (e.code !== 1000 && e.code !== 1001) error.value = `Connection closed (${e.code}: ${e.reason || 'unknown'})`
    }
  }

  function stopMic() {
    if (silenceTimer) { clearTimeout(silenceTimer); silenceTimer = null }
    mediaRecorder?.stop()
    micStream?.getTracks().forEach(t => t.stop())
    if (socket?.readyState === WebSocket.OPEN) socket.close(1000)
    isListening.value = false
    interimText.value = ''
  }

  function stopListeningAndProcess() {
    const text = accumulatedTranscript.trim()
    stopMic()
    if (text) processVoiceInput(text)
  }

  // ─── Stop listening without processing (for manual cancel)
  function stopListening() {
    stopMic()
  }

  // ─── Agent processing ─────────────────────────────────────────────────────────

  async function processVoiceInput(text: string) {
    if (!text.trim()) return
    isProcessing.value = true

    conversation.value.push({ id: Date.now().toString(), role: 'user', text, timestamp: new Date() })

    try {
      const history = conversation.value.slice(-8).map(m => ({ role: m.role, content: m.text }))
      const { data: { session } } = await supabase.auth.getSession()
      const res = await $fetch<{ reply: string }>('/api/voice/respond', {
        method: 'POST',
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
        body: { workspace_id: workspaceId, message: text, history }
      })
      const replyText = res.reply
      conversation.value.push({ id: (Date.now() + 1).toString(), role: 'assistant', text: replyText, timestamp: new Date() })
      await speakText(replyText)
    } catch (e: any) {
      error.value = e?.data?.message || 'Agent response failed'
    } finally {
      isProcessing.value = false
    }
  }

  // ─── ElevenLabs TTS ──────────────────────────────────────────────────────────

  async function speakText(text: string) {
    if (!text.trim()) return
    isSpeaking.value = true
    if (currentAudio) { currentAudio.pause(); currentAudio = null }

    try {
      const res = await $fetch<{ audioBase64?: string; useBrowserTTS?: boolean; text?: string }>('/api/voice/synthesize', {
        method: 'POST',
        body: { text: text.slice(0, 1000) }
      })

      if (res.useBrowserTTS && res.text && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Browser TTS fallback
        const utt = new SpeechSynthesisUtterance(res.text)
        utt.rate = 1.0; utt.pitch = 1.0
        utt.onend = () => { isSpeaking.value = false }
        utt.onerror = () => { isSpeaking.value = false }
        window.speechSynthesis.speak(utt)
        return
      }

      if (res.audioBase64) {
        await new Promise<void>((resolve) => {
          const audio = new Audio(`data:audio/mpeg;base64,${res.audioBase64}`)
          currentAudio = audio
          audio.onended = () => { isSpeaking.value = false; resolve() }
          audio.onerror = () => { isSpeaking.value = false; resolve() }
          audio.play().catch(() => { isSpeaking.value = false; resolve() })
        })
        return
      }
    } catch {}
    isSpeaking.value = false
  }

  function stopSpeaking() {
    if (currentAudio) { currentAudio.pause(); currentAudio = null }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    isSpeaking.value = false
  }

  function activate()   { isActive.value = true }
  function deactivate() {
    stopMic()
    stopSpeaking()
    isActive.value = false
    conversation.value = []
    transcript.value = ''
    error.value = ''
  }

  onUnmounted(() => { stopMic(); stopSpeaking(); audioContext?.close() })

  return {
    isListening, isSpeaking, isProcessing, isActive,
    transcript, interimText, error, conversation,
    startListening, stopListening, speakText, stopSpeaking,
    processVoiceInput, activate, deactivate
  }
}

