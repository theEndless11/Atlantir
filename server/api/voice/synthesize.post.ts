export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { text } = body

  if (!text?.trim()) throw createError({ statusCode: 400, message: 'text required' })

  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    // Fallback: return empty so client uses browser TTS
    return { audioBase64: null, useBrowserTTS: true, text }
  }

  // Rachel voice — natural, clear, professional
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.slice(0, 1000),
        model_id: 'eleven_turbo_v2_5',
        voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true }
      })
    })

    if (!res.ok) {
      return { audioBase64: null, useBrowserTTS: true, text }
    }

    const arrayBuffer = await res.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    return { audioBase64: base64, useBrowserTTS: false }
  } catch {
    return { audioBase64: null, useBrowserTTS: true, text }
  }
})
