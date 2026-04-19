export function useDeepgram() {
  const transcript = ref('')
  const interimText = ref('')
  const isRecording = ref(false)
  const isPaused = ref(false)
  const error = ref('')
  const captureMode = ref<'mic' | 'system' | 'both'>('both')
  const audioDevices = ref<MediaDeviceInfo[]>([])
  const selectedDeviceId = ref<string>('')

  let socket: WebSocket | null = null
  let mediaRecorder: MediaRecorder | null = null
  let micStream: MediaStream | null = null
  let displayStream: MediaStream | null = null
  let audioContext: AudioContext | null = null

  async function loadDevices() {
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      tempStream.getTracks().forEach(t => t.stop())
      const devices = await navigator.mediaDevices.enumerateDevices()
      audioDevices.value = devices.filter(d => d.kind === 'audioinput')
      if (!selectedDeviceId.value && audioDevices.value.length) {
        selectedDeviceId.value = audioDevices.value[0].deviceId
      }
    } catch {
      error.value = 'Microphone access denied'
    }
  }

  // Mix multiple audio streams into one using Web Audio API
  function mixStreams(streams: MediaStream[]): MediaStream {
    audioContext = new AudioContext()
    const destination = audioContext.createMediaStreamDestination()

    for (const stream of streams) {
      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length > 0) {
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(destination)
      }
    }

    return destination.stream
  }

  async function start() {
    error.value = ''
    transcript.value = ''
    interimText.value = ''

    const streams: MediaStream[] = []

    // Always try to get mic
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedDeviceId.value
          ? { deviceId: { exact: selectedDeviceId.value }, echoCancellation: true, noiseSuppression: true }
          : { echoCancellation: true, noiseSuppression: true }
      }
      micStream = await navigator.mediaDevices.getUserMedia(constraints)
      streams.push(micStream)
    } catch (e) {
      console.warn('[deepgram] mic unavailable:', e)
    }

    // Try to capture system/tab/window audio
    if (captureMode.value === 'system' || captureMode.value === 'both') {
      try {
        // @ts-ignore — getDisplayMedia with audio
        displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true, // required by browser, we ignore the video track
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            sampleRate: 44100
          },
          systemAudio: 'include' // Chrome 105+ — captures system audio
        })

        // Stop video track immediately — we only want audio
        displayStream.getVideoTracks().forEach(t => t.stop())

        if (displayStream.getAudioTracks().length > 0) {
          streams.push(displayStream)
        } else {
          error.value = 'No audio captured from screen share. Make sure to check "Share tab audio" or "Share system audio" in the picker.'
        }

        // If user closes the share picker, stop recording
        displayStream.getVideoTracks()[0]?.addEventListener('ended', () => {
          if (isRecording.value) stop()
        })
      } catch (e: any) {
        if (e.name === 'NotAllowedError') {
          error.value = 'Screen share cancelled. Using mic only.'
        } else {
          console.warn('[deepgram] display capture failed:', e)
        }
      }
    }

    if (streams.length === 0) {
      error.value = 'No audio source available'
      return
    }

    // Mix streams if more than one
    const finalStream = streams.length === 1 ? streams[0] : mixStreams(streams)

    const key = useRuntimeConfig().public.deepgramApiKey
    if (!key) { error.value = 'Deepgram API key not configured'; return }

    socket = new WebSocket(
      `wss://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true&interim_results=true&utterance_end_ms=1000`,
      ['token', key]
    )

    socket.onopen = () => {
      isRecording.value = true
      isPaused.value = false

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus' : 'audio/webm'

      mediaRecorder = new MediaRecorder(finalStream, { mimeType })
      mediaRecorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0 && socket?.readyState === WebSocket.OPEN) {
          socket.send(e.data)
        }
      })
      mediaRecorder.start(250)
    }

    socket.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        const alt = data?.channel?.alternatives?.[0]
        if (!alt) return
        if (data.is_final) {
          if (alt.transcript) {
            transcript.value += (transcript.value ? ' ' : '') + alt.transcript
            interimText.value = ''
          }
        } else {
          interimText.value = alt.transcript || ''
        }
      } catch {}
    }

    socket.onerror = () => { error.value = 'Deepgram connection failed. Check your API key.' }
    socket.onclose = (e) => {
      isRecording.value = false
      if (e.code !== 1000) error.value = `Connection closed (${e.code})`
    }
  }

  function pause() { mediaRecorder?.pause(); isPaused.value = true }
  function resume() { mediaRecorder?.resume(); isPaused.value = false }

  function stop(): string {
    mediaRecorder?.stop()
    micStream?.getTracks().forEach(t => t.stop())
    displayStream?.getTracks().forEach(t => t.stop())
    audioContext?.close()
    if (socket?.readyState === WebSocket.OPEN) socket.close(1000)
    isRecording.value = false
    isPaused.value = false
    interimText.value = ''
    return transcript.value
  }

  return {
    transcript, interimText, isRecording, isPaused, error,
    captureMode, audioDevices, selectedDeviceId,
    loadDevices, start, pause, resume, stop
  }
}