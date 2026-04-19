export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/style.css'],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/auth/callback',
      exclude: ['/', '/login', '/register', '/reset-password', '/join/**'],
    }
  },

  runtimeConfig: {
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
    elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID,
    public: {
      supabaseUrl:    process.env.SUPABASE_URL,
      supabaseKey:    process.env.SUPABASE_KEY,
      deepgramApiKey: process.env.DEEPGRAM_API_KEY,
    }
  },

  typescript: { strict: true },

  devServer: { host: 'localhost' },

  vite: {
    server: { hmr: { overlay: false } }
  }
})
