export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const botServiceUrl = process.env.BOT_SERVICE_URL || 'https://agent.endless.sbs'
  const secret = process.env.BOT_SECRET || 'changeme'

  const res = await fetch(`${botServiceUrl}/bot/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-bot-secret': secret },
    body: JSON.stringify(body),
  })

  // 404 means session already gone — treat as success so frontend can clear
  if (res.status === 404) return { status: 'already_stopped' }
  if (!res.ok) throw createError({ statusCode: res.status, message: await res.text() })
  return res.json()
})