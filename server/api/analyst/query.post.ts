import { useAnthropic, AGENT_MODEL } from '~/server/utils/anthropic'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { question, data_sample, columns, column_stats, total_rows, db_info } = body

  if (!question || !data_sample) throw createError({ statusCode: 400, message: 'question and data required' })

  const client = useAnthropic()

  const systemPrompt = `You are a data analyst AI. You receive a dataset sample and answer questions about it.

Always respond with valid JSON only, no markdown fences:
{
  "answer": "detailed markdown explanation with insights",
  "key_metrics": [{"label": "metric name", "value": "formatted value"}, ...],
  "chart_type": "bar|line|pie|doughnut|scatter|null",
  "chart_data": {
    "type": "bar",
    "labels": [...],
    "datasets": [{
      "label": "Dataset name",
      "data": [...],
      "backgroundColor": ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"]
    }]
  }
}

Rules:
- answer must be substantive markdown with specific numbers from the data
- key_metrics should be 2-4 most important numbers
- chart_data must be valid Chart.js format if a chart helps understand the data
- if no chart is appropriate, set chart_type to null and chart_data to null
- always reference specific values from the data, never be vague
- identify trends, outliers, and actionable insights`

  const userMsg = `Dataset: ${total_rows} rows, columns: ${column_stats}

Sample data (first ${data_sample.length} rows):
${JSON.stringify(data_sample, null, 2)}

Question: ${question}`

  const response = await client.messages.create({
    model: AGENT_MODEL,
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMsg }]
  })

  const raw = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('').trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

  try {
    return JSON.parse(raw)
  } catch {
    return { answer: raw, key_metrics: [], chart_type: null, chart_data: null }
  }
})