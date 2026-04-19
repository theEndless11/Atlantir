export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  if (!id) throw createError({ statusCode: 400, message: 'id required' })
  const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3021'
  const secret = process.env.BOT_SECRET || 'changeme'

  const res = await fetch(`${botServiceUrl}/bot/status/${id}`, {
    headers: { 'x-bot-secret': secret }
  })
  if (!res.ok) throw createError({ statusCode: res.status, message: 'Session not found' })
  return res.json()
})