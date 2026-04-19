<template>
  <div class="page-shell wf-shell">
    <div class="page-header">
      <div>
        <h1>Workflows</h1>
        <p class="page-desc">
          Workflows are automated agent pipelines you define once and run repeatedly.
          Each step passes its output to the next — research feeds analysis, analysis feeds writing, writing feeds action.
          Trigger them manually with custom variables, automatically after every meeting, or on a daily or weekly schedule.
        </p>
      </div>
      <button class="btn-new" @click="openNew">+ New workflow</button>
    </div>

    <div v-if="!workflows.length" class="empty-state">
      <div class="empty-hero">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
        </svg>
        <div class="empty-hero-text">
          <strong>No workflows yet</strong>
          <span>Start from a template below or build your own from scratch.</span>
        </div>
      </div>

      <div class="how-it-works">
        <div class="how-step">
          <div class="how-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <div><strong>Define steps</strong> — assign each step to the right agent type: research, analyst, writer, or executor.</div>
        </div>
        <div class="how-step">
          <div class="how-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </div>
          <div><strong>Add variables</strong> — use <code>{"{{competitor}}"}</code> in your step text, then fill it in at run time.</div>
        </div>
        <div class="how-step">
          <div class="how-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3l14 9-14 9V3z"/></svg>
          </div>
          <div><strong>Choose a trigger</strong> — run manually, fire after every meeting ends, or schedule it daily or weekly.</div>
        </div>
      </div>

      <div class="template-section-label">Start from a template</div>
      <div class="empty-examples">
        <div class="example-chip" @click="loadTemplate('competitor')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
          Competitor digest
        </div>
        <div class="example-chip" @click="loadTemplate('meeting')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Post-meeting report
        </div>
        <div class="example-chip" @click="loadTemplate('onboarding')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          New hire brief
        </div>
        <div class="example-chip" @click="loadTemplate('weekly')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/></svg>
          Weekly Slack update
        </div>
        <div class="example-chip" @click="loadTemplate('churn')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Churn risk report
        </div>
        <div class="example-chip" @click="loadTemplate('release')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Release notes
        </div>
        <div class="example-chip" @click="loadTemplate('sales')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Sales outreach draft
        </div>
        <div class="example-chip" @click="loadTemplate('standup')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Daily standup post
        </div>
      </div>
    </div>

    <div class="wf-list">
      <div v-for="wf in workflows" :key="wf.id" class="wf-card" :class="{ disabled: !wf.enabled }">
        <div class="wf-top">
          <div class="wf-info">
            <div class="wf-name-row">
              <span class="wf-name">{{ wf.name }}</span>
              <span class="enabled-dot" :class="{ on: wf.enabled }" :title="wf.enabled ? 'Enabled' : 'Disabled'" />
            </div>
            <div class="wf-meta">
              <span class="trigger-badge" :class="wf.trigger">{{ triggerLabel(wf) }}</span>
              <span class="wf-steps">{{ wf.steps.length }} step{{ wf.steps.length !== 1 ? 's' : '' }}</span>
              <span v-if="wf.run_count" class="wf-runs">{{ wf.run_count }}× run</span>
              <span v-if="wf.last_run_at" class="wf-last">Last: {{ formatDate(wf.last_run_at) }}</span>
            </div>
            <div v-if="wf.description" class="wf-desc">{{ wf.description }}</div>
            <!-- Variable pills -->
            <div v-if="wf.variables?.length" class="var-pills">
              <span v-for="v in wf.variables" :key="v.key" class="var-pill">{{ v.key }}</span>
            </div>
          </div>
          <div class="wf-actions">
            <button class="btn-run-wf" :disabled="running === wf.id" @click="startRun(wf)">
              {{ running === wf.id ? 'Running…' : '▶ Run' }}
            </button>
            <button class="btn-edit" @click="openEdit(wf)">Edit</button>
            <button class="btn-toggle" @click="toggleEnabled(wf)">{{ wf.enabled ? 'Disable' : 'Enable' }}</button>
            <button class="btn-del" @click="deleteWorkflow(wf.id)">✕</button>
          </div>
        </div>

        <!-- Steps preview -->
        <div class="steps-preview">
          <div v-for="(step, i) in wf.steps" :key="i" class="step-chip">
            <span class="step-num">{{ i + 1 }}</span>
            <span class="step-agent" :class="step.agent">{{ step.agent }}</span>
            <span class="step-title">{{ step.task_title }}</span>
          </div>
        </div>

        <!-- Last run result -->
        <div v-if="lastRuns[wf.id]" class="last-run">
          <span class="run-status" :class="lastRuns[wf.id].status">{{ lastRuns[wf.id].status }}</span>
          <span class="run-meta">{{ formatDate(lastRuns[wf.id].ended_at || lastRuns[wf.id].created_at) }} · {{ lastRuns[wf.id].tasks_created }} tasks</span>
          <span v-if="lastRuns[wf.id].final_output" class="run-preview">{{ lastRuns[wf.id].final_output?.slice(0, 120) }}…</span>
        </div>
      </div>
    </div>

    <!-- Variable input modal (shown before manual run if workflow has vars) -->
    <div v-if="varPrompt.open" class="modal-backdrop" @click.self="varPrompt.open = false">
      <div class="modal modal-sm">
        <div class="modal-header">
          <span>Run: {{ varPrompt.workflow?.name }}</span>
          <button class="close-btn" @click="varPrompt.open = false">✕</button>
        </div>
        <div class="modal-body">
          <p class="var-hint">Fill in the variables for this run:</p>
          <div v-for="v in varPrompt.workflow?.variables" :key="v.key" class="field">
            <label>{{ v.label || v.key }}</label>
            <input v-model="varPrompt.values[v.key]" :placeholder="v.placeholder || v.key" />
            <span v-if="v.hint" class="hint">{{ v.hint }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="varPrompt.open = false">Cancel</button>
          <button class="btn-save" @click="confirmRun">Run now</button>
        </div>
      </div>
    </div>

    <!-- Workflow editor modal -->
    <div v-if="showEditor" class="modal-backdrop" @click.self="showEditor = false">
      <div class="modal">
        <div class="modal-header">
          <span>{{ editingId ? 'Edit workflow' : 'New workflow' }}</span>
          <button class="close-btn" @click="showEditor = false">✕</button>
        </div>
        <div class="modal-body">

          <!-- Basic info -->
          <div class="field">
            <label>Name</label>
            <input v-model="form.name" placeholder="e.g. Weekly competitor digest" />
          </div>
          <div class="field">
            <label>Description <span class="opt">(optional)</span></label>
            <input v-model="form.description" placeholder="What this workflow does" />
          </div>

          <!-- Trigger -->
          <div class="field-row">
            <div class="field">
              <label>Trigger</label>
              <select v-model="form.trigger">
                <option value="manual">Manual — run on demand</option>
                <option value="meeting_end">After every meeting ends</option>
                <option value="schedule">Scheduled</option>
              </select>
            </div>
            <div v-if="form.trigger === 'schedule'" class="field">
              <label>Cadence</label>
              <select v-model="form.schedule_cadence">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly (Monday)</option>
                <option value="monday">Every Monday morning</option>
              </select>
            </div>
          </div>

          <!-- Variables -->
          <div class="section-divider">
            <span>Variables</span>
            <span class="section-hint">Use <code>{{variable}}</code> in step titles and descriptions</span>
            <button class="btn-add-step" @click="addVar">+ Add variable</button>
          </div>
          <div v-for="(v, i) in form.variables" :key="i" class="var-row">
            <input v-model="v.key" placeholder="key (no spaces)" class="var-key" />
            <input v-model="v.label" placeholder="Label shown to user" class="var-label" />
            <input v-model="v.placeholder" placeholder="Placeholder text" class="var-ph" />
            <button class="step-del" @click="removeVar(i)">✕</button>
          </div>
          <p v-if="!form.variables.length" class="no-steps">No variables. Steps run with static text.</p>

          <!-- Steps -->
          <div class="section-divider">
            <span>Steps</span>
            <span class="section-hint">Each step's output is passed to the next as context</span>
            <button class="btn-add-step" @click="addStep">+ Add step</button>
          </div>
          <div v-for="(step, i) in form.steps" :key="i" class="step-row">
            <span class="step-n">{{ i + 1 }}</span>
            <select v-model="step.agent" class="step-agent-sel">
              <option value="research"> Research</option>
              <option value="writer">Writer</option>
              <option value="analyst"> Analyst</option>
              <option value="executor"> Executor</option>
            </select>
            <div class="step-inputs">
              <input v-model="step.task_title" class="step-title-input" placeholder="Task title… use {{variable}}" />
              <input v-model="step.task_description" class="step-desc-input" placeholder="Description… use {{variable}}" />
            </div>
            <button class="step-del" @click="removeStep(i)">✕</button>
          </div>
          <p v-if="!form.steps.length" class="no-steps">No steps yet. Add at least one.</p>

        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showEditor = false">Cancel</button>
          <button class="btn-save" :disabled="!form.name || !form.steps.length" @click="saveWorkflow">
            {{ editingId ? 'Save changes' : 'Create workflow' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="toast" :class="toastType">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })

const route = useRoute()
const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string
const user = useSupabaseUser()

const workflows = ref<any[]>([])
const lastRuns = ref<Record<string, any>>({})
const showEditor = ref(false)
const editingId = ref<string | null>(null)
const running = ref<string | null>(null)
const toast = ref('')
const toastType = ref('success')

const varPrompt = ref<{ open: boolean; workflow: any; values: Record<string, string> }>({
  open: false, workflow: null, values: {}
})

const emptyForm = () => ({
  name: '', description: '', trigger: 'manual', schedule_cadence: 'weekly',
  variables: [] as { key: string; label: string; placeholder: string; hint?: string }[],
  steps: [] as { agent: string; task_title: string; task_description: string }[],
})
const form = ref(emptyForm())

// ─── Templates ───────────────────────────────────────────────────────────────
const TEMPLATES: Record<string, any> = {
  competitor: {
    name: 'Competitor digest',
    description: 'Research a competitor and post a summary to Slack',
    trigger: 'manual',
    variables: [{ key: 'competitor', label: 'Competitor name', placeholder: 'e.g. Linear' }],
    steps: [
      { agent: 'research', task_title: 'Research {{competitor}} latest updates', task_description: 'Find recent product launches, pricing changes, and news about {{competitor}}. Use company knowledge for context.' },
      { agent: 'analyst', task_title: 'Analyse {{competitor}} vs our positioning', task_description: 'Compare {{competitor}} strengths and weaknesses against our product. Use the research above.' },
      { agent: 'writer', task_title: 'Write Slack summary about {{competitor}}', task_description: 'Write a concise Slack message summarising the competitive update. Keep it under 300 words. Emoji-friendly.' },
      { agent: 'executor', task_title: 'Post {{competitor}} digest to Slack', task_description: 'Post the competitive analysis summary to Slack #strategy channel.' },
    ],
  },
  meeting: {
    name: 'Post-meeting report',
    description: 'Automatically runs after every meeting — summarises, creates issues, posts to Slack',
    trigger: 'meeting_end',
    variables: [],
    steps: [
      { agent: 'analyst', task_title: 'Summarise meeting transcript', task_description: 'Extract key decisions, action items, and owners from the meeting transcript provided in context.' },
      { agent: 'executor', task_title: 'Create GitHub issues for action items', task_description: 'Create a GitHub issue for each action item identified in the summary.' },
      { agent: 'writer', task_title: 'Draft meeting recap message', task_description: 'Write a clean Slack recap of the meeting: decisions made, action items, and owners.' },
      { agent: 'executor', task_title: 'Post meeting recap to Slack', task_description: 'Post the meeting recap to Slack #general.' },
    ],
  },
  onboarding: {
    name: 'New hire brief',
    description: 'Generate a personalised onboarding brief and email it',
    trigger: 'manual',
    variables: [
      { key: 'name', label: 'New hire name', placeholder: 'e.g. Alex' },
      { key: 'role', label: 'Role', placeholder: 'e.g. Senior Engineer' },
      { key: 'email', label: 'Their email', placeholder: 'alex@example.com' },
    ],
    steps: [
      { agent: 'research', task_title: 'Compile onboarding context for {{role}}', task_description: 'Using company knowledge, gather what a new {{role}} needs to know: team structure, product, priorities, key contacts.' },
      { agent: 'writer', task_title: 'Write welcome brief for {{name}}', task_description: 'Write a warm, personalised onboarding brief for {{name}} joining as {{role}}. Use the research above. Include: company overview, their team, Q2 priorities, who to meet first.' },
      { agent: 'executor', task_title: 'Email onboarding brief to {{name}}', task_description: 'Send the onboarding brief via Gmail to {{email}} with subject "Welcome to the team, {{name}}! 🎉".' },
    ],
  },
  weekly: {
    name: 'Weekly Slack update',
    description: 'Every Monday: pulls priorities from RAG and posts a team update',
    trigger: 'schedule',
    schedule_cadence: 'monday',
    variables: [{ key: 'date', label: 'Week of', placeholder: 'auto-filled' }],
    steps: [
      { agent: 'research', task_title: 'Compile weekly priorities for {{date}}', task_description: 'Using company knowledge, summarise the current top priorities, any known deadlines this week, and team focus areas.' },
      { agent: 'writer', task_title: 'Write Monday team update', task_description: 'Write a motivating, brief Monday team update for Slack. Include top 3 priorities, any key deadlines, and a closing note. Keep it under 200 words.' },
      { agent: 'executor', task_title: 'Post weekly update to Slack', task_description: 'Post the Monday team update to Slack #general.' },
    ],
  },
  churn: {
    name: 'Churn risk report',
    description: 'Weekly analysis of churn signals and recommended actions, posted to Slack',
    trigger: 'schedule',
    schedule_cadence: 'weekly',
    variables: [],
    steps: [
      { agent: 'research', task_title: 'Gather churn risk signals', task_description: 'Using company knowledge, identify current churn rate, at-risk segments, top reasons customers churn, and any recent cancellations or downgrade signals.' },
      { agent: 'analyst', task_title: 'Analyse churn risk and prioritise interventions', task_description: 'Based on the research, identify the top 3 churn risks this week and recommend specific actions for each. Be concrete and actionable.' },
      { agent: 'writer', task_title: 'Write churn risk summary for Slack', task_description: 'Write a concise weekly churn risk summary for the #retention Slack channel. Format: current rate, top 3 risks, recommended actions. Under 250 words.' },
      { agent: 'executor', task_title: 'Post churn report to Slack', task_description: 'Post the churn risk summary to Slack #retention channel.' },
    ],
  },
  release: {
    name: 'Release notes',
    description: 'Generate release notes from a description and post to Slack and GitHub',
    trigger: 'manual',
    variables: [
      { key: 'version', label: 'Version number', placeholder: 'e.g. v2.4.0' },
      { key: 'changes', label: 'What changed', placeholder: 'Brief list of changes or PR titles' },
    ],
    steps: [
      { agent: 'writer', task_title: 'Write release notes for {{version}}', task_description: 'Write clear, user-friendly release notes for {{version}}. Changes: {{changes}}. Format: headline summary, bullet list of changes grouped by type (Features, Fixes, Improvements). Use company tone — developer-friendly, concise.' },
      { agent: 'executor', task_title: 'Post {{version}} release notes to Slack', task_description: 'Post the release notes to Slack #announcements channel.' },
      { agent: 'executor', task_title: 'Create GitHub release issue for {{version}}', task_description: 'Create a GitHub issue titled "Release {{version}}" with the release notes as the body, labelled "release".' },
    ],
  },
  sales: {
    name: 'Sales outreach draft',
    description: 'Research a prospect and draft a personalised outreach email',
    trigger: 'manual',
    variables: [
      { key: 'company', label: 'Prospect company', placeholder: 'e.g. Vercel' },
      { key: 'contact', label: 'Contact name', placeholder: 'e.g. Lee Robinson' },
      { key: 'email', label: 'Contact email', placeholder: 'lee@vercel.com' },
      { key: 'role', label: 'Their role', placeholder: 'e.g. VP Engineering' },
    ],
    steps: [
      { agent: 'research', task_title: 'Research {{company}} and {{contact}}', task_description: 'Find relevant information about {{company}}: their engineering team size, current tooling mentions, recent product launches, pain points. Also research {{contact}} — their background and role as {{role}}.' },
      { agent: 'analyst', task_title: 'Identify best angle for {{company}} outreach', task_description: 'Based on the research, identify the strongest reason {{company}} would benefit from our product. Consider their size, stack, and likely pain points vs our strengths (API-first, 10x faster than Jira, Git integration).' },
      { agent: 'writer', task_title: 'Draft outreach email to {{contact}}', task_description: 'Write a short, personalised cold outreach email to {{contact}} at {{company}}. Reference something specific about them. Lead with value, not features. 4 sentences max. Subject line included.' },
      { agent: 'executor', task_title: 'Send outreach email to {{email}}', task_description: 'Send the drafted outreach email via Gmail to {{email}}.' },
    ],
  },
  standup: {
    name: 'Daily standup post',
    description: 'Every morning: generates a short standup prompt and posts it to Slack',
    trigger: 'schedule',
    schedule_cadence: 'daily',
    variables: [{ key: 'date', label: 'Date', placeholder: 'auto-filled' }],
    steps: [
      { agent: 'writer', task_title: 'Write daily standup prompt for {{date}}', task_description: 'Write a brief daily standup prompt for the team Slack channel. Include: date, a one-line focus reminder based on company priorities, and the three standup questions (What did you do yesterday? What are you doing today? Any blockers?). Friendly and brief.' },
      { agent: 'executor', task_title: 'Post standup prompt to Slack', task_description: 'Post the daily standup prompt to Slack #standup channel.' },
    ],
  },
}

function loadTemplate(key: string) {
  const t = TEMPLATES[key]
  if (!t) return
  form.value = { ...emptyForm(), ...t, variables: [...(t.variables || [])], steps: [...t.steps] }
  editingId.value = null
  showEditor.value = true
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function triggerLabel(wf: any) {
  if (wf.trigger === 'schedule') return ` ${wf.schedule_cadence || 'scheduled'}`
  if (wf.trigger === 'meeting_end') return ' after meeting'
  return '▶ manual'
}
function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function showToast(msg: string, type = 'success') {
  toast.value = msg; toastType.value = type
  setTimeout(() => toast.value = '', 3500)
}

// ─── Editor ──────────────────────────────────────────────────────────────────
function openNew() { form.value = emptyForm(); editingId.value = null; showEditor.value = true }
function openEdit(wf: any) {
  editingId.value = wf.id
  form.value = {
    name: wf.name, description: wf.description || '',
    trigger: wf.trigger, schedule_cadence: wf.schedule_cadence || 'weekly',
    variables: wf.variables ? [...wf.variables] : [],
    steps: [...wf.steps],
  }
  showEditor.value = true
}
function addStep() { form.value.steps.push({ agent: 'research', task_title: '', task_description: '' }) }
function removeStep(i: number) { form.value.steps.splice(i, 1) }
function addVar() { form.value.variables.push({ key: '', label: '', placeholder: '' }) }
function removeVar(i: number) { form.value.variables.splice(i, 1) }

async function saveWorkflow() {
  const payload = {
    workspace_id: workspaceId,
    name: form.value.name,
    description: form.value.description,
    trigger: form.value.trigger,
    schedule_cadence: form.value.schedule_cadence,
    variables: form.value.variables,
    steps: form.value.steps,
    enabled: true,
    created_by: user.value?.id,
  }
  if (editingId.value) {
    await $fetch('/api/workflows', { method: 'PATCH', body: { id: editingId.value, ...payload } })
  } else {
    await $fetch('/api/workflows', { method: 'POST', body: payload })
  }
  showEditor.value = false
  showToast(editingId.value ? 'Workflow updated' : 'Workflow created ✓')
  await load()
}

async function deleteWorkflow(id: string) {
  if (!confirm('Delete this workflow?')) return
  await $fetch('/api/workflows', { method: 'DELETE', body: { id } })
  await load()
}

async function toggleEnabled(wf: any) {
  await $fetch('/api/workflows', { method: 'PATCH', body: { id: wf.id, enabled: !wf.enabled } })
  await load()
}

// ─── Run ─────────────────────────────────────────────────────────────────────
function startRun(wf: any) {
  if (wf.variables?.length) {
    varPrompt.value = { open: true, workflow: wf, values: Object.fromEntries(wf.variables.map((v: any) => [v.key, ''])) }
  } else {
    executeRun(wf.id, {})
  }
}

async function confirmRun() {
  const wf = varPrompt.value.workflow
  varPrompt.value.open = false
  await executeRun(wf.id, { ...varPrompt.value.values })
}

async function executeRun(workflowId: string, variables: Record<string, string>) {
  running.value = workflowId
  try {
    const result = await $fetch<any>('/api/workflows/run', {
      method: 'POST',
      body: { workflow_id: workflowId, variables },
    })
    showToast(`✓ Completed — ${result.tasks?.length} tasks ran`)
    await load()
  } catch (e: any) {
    showToast(e?.data?.message || 'Run failed', 'error')
  } finally {
    running.value = null
  }
}

// ─── Load ─────────────────────────────────────────────────────────────────────
async function load() {
  workflows.value = await $fetch<any[]>(`/api/workflows?workspace_id=${workspaceId}`)
  // Load last run per workflow
  for (const wf of workflows.value) {
    const runs = await $fetch<any[]>(`/api/workflows/runs?workflow_id=${wf.id}&limit=1`).catch(() => [])
    if (runs?.length) lastRuns.value[wf.id] = runs[0]
  }
}

onMounted(load)
</script>

<style scoped>
.page-header h1 { font-size: 19px; font-weight: 600; }
.btn-new { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--accent); color: #fff; border: none; border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; cursor: pointer; flex-shrink: 0; transition: background .15s; }
.btn-new:hover { background: var(--accent-hover); }

/* Empty state */
.empty-state { padding-bottom: 32px; }
.empty-hero { display: flex; align-items: flex-start; gap: 14px; padding: 18px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 24px; }
.empty-hero-text { display: flex; flex-direction: column; gap: 3px; }
.empty-hero-text strong { font-size: 14px; font-weight: 600; color: var(--text-1); }
.empty-hero-text span   { font-size: 13px; color: var(--text-2); }
.how-it-works { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.how-step { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; color: var(--text-1); line-height: 1.55; }
.how-step strong { color: var(--text-1); }
.how-step code { background: var(--surface-2); padding: 1px 5px; border-radius: 3px; font-size: 12px; font-family: var(--mono); }
.how-icon { width: 28px; height: 28px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; margin-top: 1px; }
.template-section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-3); margin-bottom: 10px; }
.empty-examples { display: flex; gap: 8px; flex-wrap: wrap; }
.example-chip { display: flex; align-items: center; gap: 7px; padding: 8px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; font-size: 13px; cursor: pointer; color: var(--text-1); transition: all .15s; }
.example-chip svg { color: var(--text-3); flex-shrink: 0; }
.example-chip:hover { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); }
.example-chip:hover svg { color: var(--accent); }

/* Cards */
.wf-list { display: flex; flex-direction: column; gap: 12px; }
.wf-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 18px; transition: border-color .15s; }
.wf-card:hover { border-color: var(--text-3); }
.wf-card.disabled { opacity: 0.5; }
.wf-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
.wf-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.wf-name { font-size: 15px; font-weight: 600; color: var(--text-1); }
.enabled-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); }
.enabled-dot.on { background: var(--green); }
.wf-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
.trigger-badge { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 20px; }
.trigger-badge.manual      { background: var(--accent-soft);  color: var(--accent); }
.trigger-badge.meeting_end { background: var(--amber-soft);   color: var(--amber-text); }
.trigger-badge.schedule    { background: var(--green-soft);   color: var(--green-text); }
.wf-steps, .wf-runs, .wf-last { font-size: 12px; color: var(--text-3); }
.wf-desc { font-size: 13px; color: var(--text-2); margin-top: 2px; }
.var-pills { display: flex; gap: 5px; margin-top: 6px; flex-wrap: wrap; }
.var-pill { font-size: 11px; background: var(--amber-soft); color: var(--amber-text); padding: 2px 8px; border-radius: 10px; font-family: var(--mono); }
.wf-actions { display: flex; gap: 5px; flex-shrink: 0; flex-wrap: wrap; justify-content: flex-end; }
.btn-run-wf { padding: 6px 14px; background: var(--green-soft); color: var(--green-text); border: 1px solid #bbf7d0; border-radius: 7px; cursor: pointer; font-size: 13px; font-weight: 500; transition: background .15s; }
.btn-run-wf:not(:disabled):hover { background: #a7f3d0; }
.btn-run-wf:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-edit   { padding: 6px 12px; background: var(--surface-2); color: var(--text-2); border: 1px solid var(--border); border-radius: 7px; cursor: pointer; font-size: 13px; transition: background .15s; }
.btn-edit:hover { background: var(--surface-3); }
.btn-toggle { padding: 6px 12px; background: var(--surface-2); color: var(--text-2); border: 1px solid var(--border); border-radius: 7px; cursor: pointer; font-size: 13px; }
.btn-del    { padding: 6px 8px; background: none; color: var(--text-3); border: none; cursor: pointer; border-radius: 6px; font-size: 13px; }
.btn-del:hover { background: var(--red-soft); color: var(--red-text); }

/* Steps preview */
.steps-preview { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
.step-chip { display: flex; align-items: center; gap: 5px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 4px 8px; }
.step-num { font-size: 10px; background: var(--surface-3); color: var(--text-3); width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; }
.step-agent { font-size: 10px; font-weight: 600; text-transform: capitalize; }
.step-agent.research { color: var(--agent-research); }
.step-agent.writer   { color: var(--agent-writer); }
.step-agent.analyst  { color: var(--agent-analyst); }
.step-agent.executor { color: var(--agent-executor); }
.step-title { font-size: 12px; color: var(--text-2); }
.last-run { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; padding-top: 8px; border-top: 1px solid var(--border-soft); font-size: 12px; }
.run-status { font-weight: 600; padding: 1px 7px; border-radius: 8px; font-size: 11px; }
.run-status.completed { background: var(--green-soft); color: var(--green-text); }
.run-status.running   { background: var(--accent-soft); color: var(--accent); }
.run-status.failed    { background: var(--red-soft);    color: var(--red-text); }
.run-meta    { color: var(--text-3); }
.run-preview { color: var(--text-2); font-style: italic; flex-basis: 100%; margin-top: 2px; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
.modal { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); width: 660px; max-width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); display: flex; flex-direction: column; }
.modal-sm { width: 420px; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border); font-weight: 600; font-size: 15px; color: var(--text-1); position: sticky; top: 0; background: var(--surface); z-index: 1; }
.close-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: var(--text-3); }
.close-btn:hover { color: var(--text-1); }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 14px; flex: 1; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--border); position: sticky; bottom: 0; background: var(--surface); }
.field { display: flex; flex-direction: column; gap: 5px; }
.field-row { display: flex; gap: 12px; }
.field-row .field { flex: 1; }
label { font-size: 13px; font-weight: 500; color: var(--text-2); }
.opt  { font-weight: 400; color: var(--text-3); }
input, select { padding: 8px 12px; border: 1.5px solid var(--border); border-radius: 7px; font-size: 13px; font-family: inherit; background: var(--surface); color: var(--text-1); outline: none; }
input:focus, select:focus { border-color: var(--accent); }
.hint { font-size: 11px; color: var(--text-3); }
.var-hint { font-size: 13px; color: var(--text-2); margin: 0; }
.section-divider { display: flex; align-items: center; gap: 10px; padding: 8px 0 4px; border-top: 1px solid var(--border-soft); font-size: 13px; font-weight: 500; color: var(--text-1); }
.section-hint { font-size: 12px; color: var(--text-3); font-weight: 400; flex: 1; }
.section-hint code { background: var(--surface-2); padding: 1px 4px; border-radius: 3px; font-size: 11px; font-family: var(--mono); }
.var-row { display: flex; gap: 6px; align-items: center; }
.var-key   { width: 100px; padding: 6px 8px; font-size: 12px; font-family: var(--mono); }
.var-label { flex: 1; padding: 6px 8px; font-size: 12px; }
.var-ph    { flex: 1.2; padding: 6px 8px; font-size: 12px; }
.step-row { display: flex; gap: 6px; align-items: flex-start; background: var(--surface-2); padding: 8px; border-radius: 8px; }
.step-n { font-size: 11px; color: var(--text-3); min-width: 16px; text-align: center; padding-top: 8px; }
.step-agent-sel { width: 120px; padding: 6px 8px; font-size: 12px; flex-shrink: 0; }
.step-inputs { display: flex; flex-direction: column; gap: 5px; flex: 1; min-width: 0; }
.step-title-input, .step-desc-input { padding: 6px 8px; font-size: 12px; }
.step-del { background: none; border: none; cursor: pointer; color: var(--text-3); font-size: 13px; padding: 6px; border-radius: 4px; }
.step-del:hover { background: var(--red-soft); color: var(--red-text); }
.no-steps { font-size: 13px; color: var(--text-3); font-style: italic; margin: 0; }
.btn-add-step { font-size: 12px; color: var(--accent); background: none; border: none; cursor: pointer; padding: 0; }
.btn-cancel { padding: 8px 16px; border: 1.5px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text-1); cursor: pointer; font-size: 13px; }
.btn-save { padding: 8px 20px; background: var(--accent); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; }
.btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--text-1); color: var(--text-inv); padding: 10px 20px; border-radius: 8px; font-size: 13px; z-index: 200; box-shadow: var(--shadow-lg); }
.toast.error { background: var(--red); }
</style>