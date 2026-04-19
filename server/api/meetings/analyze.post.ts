import { useSupabaseAdmin } from '~/server/utils/supabase'
import { useAnthropic, ORCHESTRATOR_MODEL, AGENT_MODEL, MAX_TOKENS } from '~/server/utils/anthropic'

const ANALYSIS_PROMPT = `You are an Orchestrator Agent running a live meeting.
You receive chunks of meeting transcript and must decide what action to take.

Respond with ONLY raw JSON:
{
  "action": "none" | "agent_response" | "create_task",
  "reason": "brief reason",
  "agent": "research|writer|analyst|executor" (only if action is agent_response or create_task),
  "message": "what the agent should say or do" (only if action is agent_response),
  "task_title": "short task title" (only if create_task),
  "task_description": "task details" (only if create_task)
}

Rules:
- "none": conversation is ongoing, no action needed yet
- "agent_response": a question was asked or info needed RIGHT NOW — agent responds in meeting chat
- "create_task": a concrete deliverable was mentioned that needs work after/during meeting

Only act when clearly needed. Prefer "none" to avoid being disruptive.
Examples that trigger agent_response: "what's the market size?", "can someone look up X?", "what does Y cost?"
Examples that trigger create_task: "we need to prepare a report", "someone should write an email", "let's do a competitive analysis"`

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { meeting_id, transcript_chunk, full_transcript, workspace_id, analysis_type } = body

  if (!meeting_id || !transcript_chunk) {
    throw createError({ statusCode: 400, message: 'meeting_id and transcript_chunk required' })
  }

  const sb = useSupabaseAdmin()
  const client = useAnthropic()

  // Analyze the transcript chunk
  const response = await client.messages.create({
    model: ORCHESTRATOR_MODEL,
    max_tokens: 500,
    system: ANALYSIS_PROMPT,
    messages: [{
      role: 'user',
      content: `Analysis type: ${analysis_type || 'quick'}\n\nNew transcript:\n${transcript_chunk}\n\nFull context:\n${(full_transcript || '').slice(-2000)}`
    }]
  })

  const raw = response.content
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('').trim()
    .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

  let decision: any
  try {
    decision = JSON.parse(raw)
  } catch {
    return { action: 'none' }
  }

  if (decision.action === 'none') return { action: 'none' }

  if (decision.action === 'agent_response') {
    // Run the agent to get a response
    const agentPrompts: Record<string, string> = {
      research: 'You are a Research Agent in a live meeting. Answer concisely and directly. 2-3 sentences max unless detail is needed.',
      writer: 'You are a Writer Agent in a live meeting. Provide concise writing help or drafts.',
      analyst: 'You are an Analyst Agent in a live meeting. Give sharp, direct analysis.',
      executor: 'You are an Executor Agent in a live meeting. Confirm actions and provide status.'
    }

    const agentType = decision.agent || 'research'
    const agentResponse = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: 400,
      system: agentPrompts[agentType] || agentPrompts.research,
      messages: [{ role: 'user', content: decision.message || transcript_chunk }]
    })

    const agentText = agentResponse.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('')

    // Save agent message to meeting
    await sb.from('messages').insert({
      workspace_id,
      meeting_id,
      sender_type: 'agent',
      agent_type: agentType,
      content: agentText
    })

    return { action: 'agent_response', agent: agentType, message: agentText }
  }

  if (decision.action === 'create_task') {
    // Create task as pending_approval
    const { data: task } = await sb.from('tasks').insert({
      workspace_id,
      meeting_id,
      title: decision.task_title,
      description: decision.task_description,
      assigned_agent: decision.agent || 'research',
      status: 'pending_approval',
      priority: 'medium'
    }).select().single()

    // Notify in meeting chat
    await sb.from('messages').insert({
      workspace_id,
      meeting_id,
      sender_type: 'agent',
      agent_type: 'orchestrator',
      content: `Task created: "${decision.task_title}" — assigned to ${decision.agent} agent. Awaiting approval.`
    })

    return { action: 'create_task', task }
  }

  return { action: 'none' }
})