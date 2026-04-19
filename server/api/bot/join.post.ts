// Proxy to bot service — keeps BOT_SERVICE_URL and BOT_SECRET server-side only
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3021'
  const secret = process.env.BOT_SECRET || 'changeme'

  const res = await fetch(`${botServiceUrl}/bot/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bot-secret': secret },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw createError({ statusCode: res.status, message: err })
  }
  return res.json()
})