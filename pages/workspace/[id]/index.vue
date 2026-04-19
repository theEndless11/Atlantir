<template>
  <div class="command-center">

    <!-- Top bar -->
    <div class="topbar">
      <div class="topbar-left">
        <h1 class="ws-name">{{ workspaceName }}</h1>
        <span class="date-label">{{ today }}</span>
      </div>
      <div class="topbar-right">
        <div class="stat-chip">
          <span class="stat-n">{{ pendingTasks.length }}</span>
          <span>awaiting</span>
        </div>
        <div class="stat-chip accent">
          <span class="stat-n">{{ activeTasks.length }}</span>
          <span>running</span>
        </div>
        <div class="stat-chip green">
          <span class="stat-n">{{ completedTasks.length }}</span>
          <span>done</span>
        </div>
      </div>
    </div>

    <!-- AI command bar -->
    <div class="command-bar-wrap">
      <div class="command-bar" :class="{ focused: cmdFocused }">
        <svg class="cmd-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <textarea
          ref="cmdInput"
          v-model="cmdText"
          class="cmd-input"
          :placeholder="cmdPlaceholder"
          rows="1"
          @focus="cmdFocused = true"
          @blur="cmdFocused = false"
          @keydown.enter.exact.prevent="submitCommand"
          @input="autoResize"
        />
        <button class="cmd-send" :disabled="!cmdText.trim() || cmdLoading" @click="submitCommand">
          <span v-if="cmdLoading" class="spinner" />
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
      <div class="cmd-hints">
        <button v-for="hint in cmdHints" :key="hint" class="hint-pill" @click="cmdText = hint">{{ hint }}</button>
      </div>
    </div>

    <!-- Transcript banner -->
    <div v-if="transcriptBanner" class="transcript-banner">
      <div class="tb-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14"/><rect x="3" y="8" width="12" height="8" rx="2"/></svg>
      </div>
      <div class="tb-content">
        <span class="tb-label">Transcript from <strong>{{ transcriptBanner.title }}</strong> is ready</span>
        <span class="tb-sub">Create tasks from this meeting or ask agents to analyze it</span>
      </div>
      <div class="tb-actions">
        <button class="btn btn-primary btn-sm" @click="createTasksFromTranscript">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Create tasks
        </button>
        <button class="btn btn-ghost btn-sm" @click="transcriptBanner = null">Dismiss</button>
      </div>
    </div>

    <!-- Body -->
    <div class="body-grid">

      <!-- Left: recent meetings + tasks -->
      <aside class="tasks-col">

        <!-- Recent meetings -->
        <div class="task-group">
          <div class="group-label">
            <span class="label-dot blue" />
            Recent Meetings
          </div>
          <template v-if="recentMeetings.length">
            <div
              v-for="m in recentMeetings"
              :key="m.id"
              class="task-item"
              :class="{ active: selectedMeeting?.id === m.id }"
              @click="openMeeting(m)"
            >
              <div class="task-top">
                <span class="task-title">{{ m.title || 'Untitled meeting' }}</span>
                <span v-if="m.transcript" class="mri-badge">Transcript</span>
              </div>
              <div class="task-row">
                <span class="task-date">{{ formatDate(m.created_at) }}</span>
              </div>
            </div>
          </template>
          <div v-else class="empty-section"><span>No recent meetings</span></div>
        </div>

        <!-- Needs approval -->
        <div class="task-group">
          <div class="group-label">
            <span class="label-dot amber" />
            Needs approval
          </div>
          <template v-if="pendingTasks.length">
            <div v-for="task in pendingTasks" :key="task.id"
              class="task-item" :class="{ active: activeTaskId === task.id }"
              @click="selectTask(task.id)">
              <div class="task-top">
                <span class="task-title">{{ task.title }}</span>
                <span class="priority-dot" :class="task.priority" />
              </div>
              <div class="task-row">
                <span class="badge" :class="`agent-${task.assigned_agent}`">{{ task.assigned_agent }}</span>
              </div>
              <div class="approval-row" @click.stop>
                <button class="btn btn-primary btn-xs" @click="handleApprove(task.id)">✓ Approve</button>
                <button class="btn btn-danger btn-xs" @click="handleReject(task.id)">✕</button>
              </div>
            </div>
          </template>
          <div v-else class="empty-section"><span>No tasks awaiting approval</span></div>
        </div>

        <!-- In progress -->
        <div class="task-group">
          <div class="group-label">
            <span class="label-dot blue" />
            In progress
          </div>
          <template v-if="activeTasks.length">
            <div v-for="task in activeTasks" :key="task.id"
              class="task-item" :class="{ active: activeTaskId === task.id }"
              @click="selectTask(task.id)">
              <div class="task-top">
                <span class="task-title">{{ task.title }}</span>
                <span class="priority-dot" :class="task.priority" />
              </div>
              <div class="task-row">
                <span class="badge status-in_progress">Running</span>
                <span v-if="task.assigned_agent" class="badge" :class="`agent-${task.assigned_agent}`">{{ task.assigned_agent }}</span>
              </div>
              <div v-if="taskPipelines[task.id]?.length" class="mini-pipe">
                <div v-for="step in taskPipelines[task.id]" :key="step.id"
                  class="mini-step" :class="step.status" :title="step.pet_name">
                  {{ petInitial(step.pet_name) }}
                </div>
              </div>
            </div>
          </template>
          <div v-else class="empty-section"><span>No tasks in progress</span></div>
        </div>

      </aside>

      <!-- Center: meeting detail OR task pipeline -->
      <section class="pipeline-col">

        <!-- Meeting detail view -->
        <template v-if="selectedMeeting">
          <div class="task-header-bar">
            <div class="task-header-info">
              <h2>{{ selectedMeeting.title || 'Untitled meeting' }}</h2>
              <p>{{ formatDate(selectedMeeting.created_at) }}</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <button
                class="btn btn-primary btn-sm"
                :disabled="creatingTasksFromMeeting || !selectedMeeting.transcript"
                @click="createTasksFromMeeting"
              >
                <span v-if="creatingTasksFromMeeting" class="spinner" />
                <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {{ creatingTasksFromMeeting ? 'Creating…' : 'Create Tasks' }}
              </button>
              <button class="btn btn-ghost btn-sm" @click="closeMeeting">✕ Close</button>
            </div>
          </div>
          <div class="output-body">
            <div v-if="selectedMeeting.transcript" class="meeting-transcript">
              <div class="output-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14"/><rect x="3" y="8" width="12" height="8" rx="2"/></svg>
                Transcript
              </div>
              <div class="transcript-body">{{ selectedMeeting.transcript }}</div>
            </div>
            <div v-else class="output-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14"/><rect x="3" y="8" width="12" height="8" rx="2"/></svg>
              <p>No transcript available for this meeting</p>
              <button class="btn btn-ghost btn-sm" style="margin-top:4px;" @click="showMeetingInput = true">Add transcript manually</button>
            </div>
          </div>
        </template>

        <!-- Task pipeline view -->
        <template v-else-if="activeTask">
          <div class="task-header-bar">
            <div class="task-header-info">
              <h2>{{ activeTask.title }}</h2>
              <p v-if="activeTask.description">{{ activeTask.description }}</p>
            </div>
            <span class="badge" :class="`status-${activeTask.status}`">{{ statusLabel(activeTask.status) }}</span>
          </div>

          <div v-if="activePipeline.length" class="pipeline-track">
            <template v-for="(step, i) in activePipeline" :key="step.id">
              <div v-if="i > 0" class="pipe-connector" :class="{ lit: activePipeline[i-1].status === 'completed' }" />
              <div class="pipe-step" :class="step.status">
                <div class="pipe-bubble">
                  <span>{{ petInitial(step.pet_name) }}</span>
                  <div v-if="step.status === 'running'" class="pipe-ring" />
                </div>
                <div class="pipe-label">{{ step.pet_name }}</div>
              </div>
            </template>
          </div>

          <div class="output-body">
            <div v-if="activeTask.status === 'pending_approval'" class="output-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <p>Approve this task to start the agent pipeline</p>
            </div>

            <div v-else-if="finalOutput" class="final-output">
              <div class="output-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                Output
              </div>
              <div class="output-content" v-html="renderMarkdown(finalOutput)" />
              <details class="thinking-details">
                <summary>Agent thinking</summary>
                <div class="thinking-stream">
                  <div v-for="u in liveUpdates.filter(u => u.update_type === 'progress')" :key="u.id" class="think-item">
                    <span class="think-pet">{{ u.pet_name }}</span>
                    <p>{{ u.content }}</p>
                  </div>
                </div>
              </details>
            </div>

            <div v-else-if="activeTask.status === 'in_progress'" class="live-feed">
              <div v-for="u in liveUpdates" :key="u.id" class="live-update">
                <span v-if="u.update_type === 'started'" class="live-started">{{ u.pet_name }} working…</span>
                <div v-else-if="u.update_type === 'progress'" class="live-progress">
                  <span class="live-pet">{{ u.pet_name }}</span>
                  <p>{{ u.content }}</p>
                </div>
              </div>
              <div class="typing-dots"><span/><span/><span/></div>
            </div>

            <div v-else class="output-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <p>No output yet</p>
            </div>
          </div>

          <div class="followup-bar">
            <textarea
              v-model="humanMsg"
              class="followup-input"
              placeholder="Add a note, ask a follow-up, or request changes…"
              rows="1"
              @keydown.enter.exact.prevent="sendHumanMsg"
            />
            <button class="btn btn-primary" :disabled="!humanMsg.trim()" @click="sendHumanMsg">Send</button>
          </div>
        </template>

        <!-- Nothing selected -->
        <div v-else class="select-prompt">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M4 6h16M4 12h10M4 18h7"/></svg>
          <p>Select a meeting or task to get started</p>
        </div>

      </section>

      <!-- Right: completed tasks -->
      <aside class="completed-col">
        <div class="task-group">
          <div class="group-label">
            <span class="label-dot green" />
            Completed
          </div>
          <template v-if="completedTasks.length">
            <div v-for="task in completedTasks" :key="task.id"
              class="task-item completed" :class="{ active: activeTaskId === task.id }"
              @click="selectTask(task.id)">
              <div class="task-top">
                <span class="task-title">{{ task.title }}</span>
                <button class="del-btn" @click.stop="handleDelete(task.id)">✕</button>
              </div>
              <div class="task-row">
                <span class="badge badge-green">Done</span>
                <span v-if="task.assigned_agent" class="badge" :class="`agent-${task.assigned_agent}`">{{ task.assigned_agent }}</span>
              </div>
            </div>
          </template>
          <div v-else class="empty-section"><span>No completed tasks</span></div>
        </div>
      </aside>

    </div>

    <!-- Meeting input modal -->
    <MeetingInput v-if="showMeetingInput" :processing="processingMeeting"
      @submit="handleMeetingSubmit" @close="showMeetingInput = false" />

  </div>
</template>

<style scoped>
.command-center { display: flex; flex-direction: column; height: 100%; overflow: hidden; background: var(--bg); }

/* Top bar */
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px 0; flex-shrink: 0; }
.topbar-left { display: flex; align-items: baseline; gap: 12px; }
.ws-name { font-size: 18px; font-weight: 600; color: var(--text-1); }
.date-label { font-size: 13px; color: var(--text-3); }
.topbar-right { display: flex; gap: 8px; }
.stat-chip { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; background: var(--surface); border: 1px solid var(--border); font-size: 12px; color: var(--text-2); }
.stat-chip.accent { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); }
.stat-chip.green  { background: var(--green-soft);  border-color: #bbf7d0; color: var(--green-text); }
.stat-n { font-weight: 700; font-size: 14px; }

/* Command bar */
.command-bar-wrap { padding: 14px 24px 10px; flex-shrink: 0; }
.command-bar { display: flex; align-items: flex-start; gap: 10px; background: var(--surface); border: 1.5px solid var(--border); border-radius: 12px; padding: 10px 12px; transition: border-color .15s; box-shadow: var(--shadow); }
.command-bar.focused { border-color: var(--accent); }
.cmd-icon { color: var(--text-3); margin-top: 2px; flex-shrink: 0; }
.cmd-input { flex: 1; border: none; background: none; outline: none; font-size: 14px; color: var(--text-1); resize: none; line-height: 1.5; min-height: 22px; max-height: 140px; overflow-y: auto; }
.cmd-input::placeholder { color: var(--text-3); }
.cmd-send { width: 30px; height: 30px; border-radius: 7px; background: var(--accent); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; margin-top: -2px; transition: background .15s; }
.cmd-send:not(:disabled):hover { background: var(--accent-hover); }
.cmd-send:disabled { opacity: 0.4; cursor: not-allowed; }
.cmd-hints { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
.hint-pill { font-size: 12px; padding: 4px 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; color: var(--text-2); cursor: pointer; transition: all .15s; }
.hint-pill:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }

/* Body grid */
.body-grid { display: grid; grid-template-columns: 220px 1fr 200px; flex: 1; overflow: hidden; gap: 0; border-top: 1px solid var(--border-soft); margin-top: 4px; }

/* Tasks column */
.tasks-col { border-right: 1px solid var(--border); overflow-y: auto; display: flex; flex-direction: column; gap: 4px; padding: 12px 10px; background: var(--surface); }
.task-group { display: flex; flex-direction: column; gap: 2px; margin-bottom: 6px; }
.group-label { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: var(--text-3); padding: 6px 6px 4px; }
.label-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.label-dot.amber { background: var(--amber); }
.label-dot.blue  { background: var(--accent); }
.label-dot.green { background: var(--green); }

.task-item { padding: 9px 10px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: all .15s; }
.task-item:hover { background: var(--surface-2); }
.task-item.active { background: var(--accent-soft); border-color: var(--accent-border); }
.task-item.completed { opacity: .7; }
.task-top { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 5px; }
.task-title { font-size: 12px; font-weight: 500; flex: 1; color: var(--text-1); line-height: 1.4; }
.task-date { font-size: 11px; color: var(--text-3); }
.task-row { display: flex; align-items: center; gap: 5px; }
.approval-row { display: flex; gap: 5px; margin-top: 7px; }
.btn-xs { padding: 3px 8px; font-size: 11px; height: auto; }
.del-btn { background: none; border: none; cursor: pointer; color: var(--text-3); font-size: 11px; padding: 2px 4px; border-radius: 3px; flex-shrink: 0; }
.del-btn:hover { background: var(--red-soft); color: var(--red-text); }
.mini-pipe { display: flex; gap: 3px; margin-top: 6px; }
.mini-step { width: 18px; height: 18px; border-radius: 50%; background: var(--surface-2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 9px; }
.mini-step.running   { background: var(--accent-soft); border-color: var(--accent-border); animation: pulse 1.5s infinite; }
.mini-step.completed { background: var(--green-soft); border-color: #6ee7b7; }
.mini-step.failed    { background: var(--red-soft);   border-color: #fca5a5; }

.empty-section { padding: 6px 8px 4px; }
.empty-section span { font-size: 11px; color: var(--text-3); font-style: italic; }
.mri-badge { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--accent); background: var(--accent-soft); padding: 2px 5px; border-radius: 4px; flex-shrink: 0; white-space: nowrap; }

/* Pipeline / meeting center column */
.pipeline-col { display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }

.task-header-bar { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 16px 22px 14px; background: var(--surface); border-bottom: 1px solid var(--border); flex-shrink: 0; }
.task-header-bar h2 { font-size: 15px; font-weight: 600; color: var(--text-1); margin-bottom: 3px; }
.task-header-bar p  { font-size: 13px; color: var(--text-2); }

.pipeline-track { display: flex; align-items: center; padding: 14px 22px; background: var(--surface); border-bottom: 1px solid var(--border-soft); flex-shrink: 0; gap: 0; }
.pipe-step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.pipe-connector { width: 36px; height: 2px; background: var(--border); margin-bottom: 20px; transition: background .3s; }
.pipe-connector.lit { background: var(--green); }
.pipe-bubble { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid var(--border); background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; letter-spacing: .01em; color: var(--text-2); position: relative; }
.pipe-step.waiting .pipe-bubble  { opacity: .4; }
.pipe-step.running .pipe-bubble  { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
.pipe-step.completed .pipe-bubble { border-color: var(--green); background: var(--green-soft); color: var(--green-text); }
.pipe-step.failed .pipe-bubble   { border-color: var(--red);   background: var(--red-soft); }
.pipe-ring { position: absolute; inset: -4px; border-radius: 13px; border: 2px solid transparent; border-top-color: var(--accent); animation: spin .8s linear infinite; }
.pipe-label { font-size: 10px; color: var(--text-3); }
.pipe-step.running .pipe-label   { color: var(--accent); font-weight: 500; }
.pipe-step.completed .pipe-label { color: var(--green-text); }

.output-body { flex: 1; overflow-y: auto; padding: 18px 22px; }
.output-placeholder { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 48px 24px; text-align: center; color: var(--text-3); }
.output-placeholder p { font-size: 13px; }

/* Meeting transcript */
.meeting-transcript { display: flex; flex-direction: column; gap: 12px; }
.transcript-body { font-size: 13px; line-height: 1.8; color: var(--text-1); white-space: pre-wrap; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; }

.final-output { }
.output-label { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; color: var(--green-text); margin-bottom: 12px; }
.output-content { font-size: 14px; line-height: 1.8; color: var(--text-1); }
.output-content :deep(p) { margin-bottom: 10px; }
.output-content :deep(h1), .output-content :deep(h2) { font-size: 16px; font-weight: 700; margin: 18px 0 8px; color: var(--text-1); }
.output-content :deep(h3) { font-size: 14px; font-weight: 600; margin: 14px 0 6px; color: var(--text-1); }
.output-content :deep(ul), .output-content :deep(ol) { padding-left: 18px; margin-bottom: 10px; }
.output-content :deep(li) { margin-bottom: 4px; }
.output-content :deep(code) { font-family: var(--mono); font-size: 12px; background: var(--surface-2); padding: 2px 5px; border-radius: 4px; }
.output-content :deep(pre) { background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; overflow-x: auto; margin: 10px 0; }
.output-content :deep(pre code) { background: none; padding: 0; }
.output-content :deep(table) { width: 100%; border-collapse: collapse; font-size: 13px; margin: 10px 0; }
.output-content :deep(th) { background: var(--surface-2); font-weight: 600; padding: 7px 10px; text-align: left; border: 1px solid var(--border); }
.output-content :deep(td) { padding: 6px 10px; border: 1px solid var(--border-soft); }
.output-content :deep(blockquote) { border-left: 3px solid var(--accent); padding-left: 12px; color: var(--text-2); margin: 8px 0; }
.output-content :deep(strong) { font-weight: 600; color: var(--text-1); }

.thinking-details { margin-top: 16px; border-top: 1px solid var(--border-soft); padding-top: 10px; }
.thinking-details summary { font-size: 12px; color: var(--text-3); cursor: pointer; }
.thinking-stream { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
.think-item { background: var(--surface-2); border-radius: 6px; padding: 10px 12px; }
.think-pet { font-size: 11px; font-weight: 600; color: var(--text-2); display: block; margin-bottom: 4px; }
.think-item p { font-size: 12px; color: var(--text-2); line-height: 1.6; white-space: pre-wrap; max-height: 100px; overflow-y: auto; }

.live-feed { display: flex; flex-direction: column; gap: 12px; }
.live-started { font-size: 12px; color: var(--text-3); font-style: italic; }
.live-pet { font-size: 11px; font-weight: 600; color: var(--text-2); display: block; margin-bottom: 4px; }
.live-progress p { font-size: 13px; color: var(--text-1); background: var(--surface); border-left: 2px solid var(--border); padding: 8px 12px; border-radius: 0 6px 6px 0; white-space: pre-wrap; max-height: 110px; overflow-y: auto; }
.typing-dots { display: flex; gap: 4px; padding: 6px 0; }
.typing-dots span { width: 5px; height: 5px; background: var(--accent); border-radius: 50%; animation: bounce 1.2s infinite; }
.typing-dots span:nth-child(2) { animation-delay: .2s; }
.typing-dots span:nth-child(3) { animation-delay: .4s; }

.followup-bar { border-top: 1px solid var(--border); padding: 10px 14px; display: flex; gap: 8px; align-items: flex-end; flex-shrink: 0; background: var(--surface); }
.followup-input { flex: 1; border: 1.5px solid var(--border); border-radius: 8px; padding: 8px 10px; font-size: 13px; resize: none; background: var(--surface); color: var(--text-1); outline: none; transition: border-color .15s; }
.followup-input:focus { border-color: var(--accent); }
.followup-input::placeholder { color: var(--text-3); }

.select-prompt { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--text-3); text-align: center; }
.select-prompt p { font-size: 13px; }

/* Completed column */
.completed-col { border-left: 1px solid var(--border); overflow-y: auto; background: var(--surface); padding: 12px 10px; display: flex; flex-direction: column; gap: 4px; }

/* Transcript banner */
.transcript-banner { display: flex; align-items: center; gap: 12px; padding: 14px 18px; margin: 0 0 14px; background: linear-gradient(135deg, var(--accent-soft), var(--surface)); border: 1px solid var(--accent-border); border-radius: var(--radius); flex-shrink: 0; }
.tb-icon { width: 34px; height: 34px; border-radius: 8px; background: var(--accent); color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tb-content { flex: 1; }
.tb-label { font-size: 13px; color: var(--text-1); display: block; margin-bottom: 2px; }
.tb-sub   { font-size: 11px; color: var(--text-3); }
.tb-actions { display: flex; gap: 8px; flex-shrink: 0; }
.btn-sm { font-size: 12px; padding: 5px 12px; }

@keyframes spin   { to { transform: rotate(360deg); } }
@keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.5} }
@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
/* Toast notification */
.app-toast {
  position: fixed; bottom: 88px; right: 24px; z-index: 900;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-radius: 12px; max-width: 380px;
  font-size: 13px; font-weight: 500; line-height: 1.4;
  box-shadow: 0 8px 32px rgba(0,0,0,.25), 0 2px 8px rgba(0,0,0,.15);
  backdrop-filter: blur(8px);
}
.toast-error   { background: rgba(239,68,68,.95); color: #fff; border: 1px solid rgba(255,255,255,.15); }
.toast-success { background: rgba(16,185,129,.95); color: #fff; border: 1px solid rgba(255,255,255,.15); }
.toast-info    { background: rgba(79,70,229,.95);  color: #fff; border: 1px solid rgba(255,255,255,.15); }
.toast-close   { background: none; border: none; color: rgba(255,255,255,.7); cursor: pointer; padding: 0; display: flex; flex-shrink: 0; margin-left: 4px; }
.toast-close:hover { color: #fff; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity .25s, transform .25s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(8px) scale(.97); }

</style>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })
import { useWorkspaceStore } from '~/stores/workspace'
import { storeToRefs } from 'pinia'

const store = useWorkspaceStore()
const { activeTaskId, activeTask, artifacts, pendingTasks, activeTasks, completedTasks } = storeToRefs(store)
const supabase = useSupabaseClient()
const route = useRoute()

const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string
const workspaceName  = ref('Workspace')
const recentMeetings = ref<any[]>([])
const transcriptBanner = ref<{ title: string; transcript: string } | null>(null)
const today = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })

const cmdText     = ref('')
const cmdFocused  = ref(false)
const cmdLoading  = ref(false)
const cmdInput    = ref<HTMLTextAreaElement>()

// Selected meeting shown in center panel
const selectedMeeting = ref<any | null>(null)
const creatingTasksFromMeeting = ref(false)

const showMeetingInput  = ref(false)
const processingMeeting = ref(false)
const activePipeline    = ref<any[]>([])
const taskPipelines     = ref<Record<string, any[]>>({})
const finalOutput       = ref('')
const liveUpdates       = ref<any[]>([])
const humanMsg          = ref('')

const cmdHints = [
  'Research competitor pricing trends',
  'Draft a weekly team update email',
  'Analyze our top customer churn reasons',
  'Create GitHub issues from last meeting',
]

const cmdPlaceholder = 'What do you want to get done? Describe a goal, task, or question…'

// Toast / error notification
const toastMsg   = ref('')
const toastType  = ref<'error'|'success'|'info'>('error')
const toastTimer = ref<ReturnType<typeof setTimeout> | null>(null)
function showToast(msg: string, type: 'error'|'success'|'info' = 'error') {
  toastMsg.value  = msg
  toastType.value = type
  if (toastTimer.value) clearTimeout(toastTimer.value)
  toastTimer.value = setTimeout(() => { toastMsg.value = '' }, 5000)
}

// Agent initials — clean, professional, no emojis
function petInitial(name: string): string {
  const map: Record<string, string> = {
    Scout: 'S', Bolt: 'B', Sage: 'A', Quill: 'W', Link: 'L'
  }
  return map[name] || (name?.[0]?.toUpperCase() || '?')
}

const statusLabels: Record<string, string> = {
  pending_approval: 'Pending', approved: 'Approved', in_progress: 'Running',
  needs_clarification: 'Question', completed: 'Done', cancelled: 'Cancelled'
}
function statusLabel(s: string) { return statusLabels[s] || s }

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 140) + 'px'
}

// Open meeting detail in center panel
function openMeeting(meeting: any) {
  selectedMeeting.value = meeting
  activeTaskId.value = null as any
  finalOutput.value = ''
  activePipeline.value = []
  liveUpdates.value = []
}

function closeMeeting() {
  selectedMeeting.value = null
}

async function createTasksFromMeeting() {
  if (!selectedMeeting.value) return
  creatingTasksFromMeeting.value = true
  try {
    await store.processMeetingTranscript(
      selectedMeeting.value.transcript || selectedMeeting.value.title || ''
    )
    selectedMeeting.value = null
  } catch (e: any) {
    showToast(e?.data?.message || 'Failed to create tasks')
  } finally {
    creatingTasksFromMeeting.value = false
  }
}

async function submitCommand() {
  const text = cmdText.value.trim()
  if (!text || cmdLoading.value) return

  if (text.toLowerCase().includes('meeting')) {
    cmdText.value = ''
    showMeetingInput.value = true
    return
  }

  cmdLoading.value = true
  cmdText.value = ''
  if (cmdInput.value) { cmdInput.value.style.height = 'auto' }

  try {
    const prevCount = store.tasks.length
    await store.processMeetingTranscript(text)
    // Auto-select the newly created task
    await nextTick()
    const newTask = store.tasks.find(t => !store.tasks.slice(0, prevCount).some(p => p.id === t.id))
    if (newTask) await selectTask(newTask.id)
    else if (store.tasks.length > 0) await selectTask(store.tasks[0].id)
  } catch (e: any) {
    showToast(e?.data?.message || 'Failed to create task')
  } finally {
    cmdLoading.value = false
  }
}

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function createTasksFromTranscript() {
  if (!transcriptBanner.value) return
  cmdLoading.value = true
  try {
    await store.processMeetingTranscript(transcriptBanner.value.transcript)
    transcriptBanner.value = null
  } catch (e: any) {
    showToast(e?.data?.message || 'Failed to create tasks')
  } finally {
    cmdLoading.value = false
  }
}

async function loadMeetingTranscript(meeting: any) {
  if (!meeting.transcript) return
  transcriptBanner.value = { title: meeting.title || 'Meeting', transcript: meeting.transcript }
  window.scrollTo(0, 0)
}

onMounted(async () => {
  await store.loadWorkspaces()
  await store.loadTasks(workspaceId)
  await store.loadArtifacts(workspaceId)
  store.subscribeToWorkspace(workspaceId)

  const { data: ws } = await supabase.from('workspaces').select('name').eq('id', workspaceId).single()
  if (ws) workspaceName.value = ws.name

  try {
    const meetings = await $fetch<any[]>(`/api/meetings?workspace_id=${workspaceId}`)
    recentMeetings.value = (meetings || []).slice(0, 5)
  } catch {}

  const transcriptParam = route.query.transcript as string
  const mtitleParam     = route.query.mtitle as string
  if (transcriptParam) {
    transcriptBanner.value = { title: mtitleParam || 'Meeting', transcript: transcriptParam }
    navigateTo(`/workspace/${workspaceId}`, { replace: true })
  }

  watch(() => store.tasks.find(t => t.id === activeTaskId.value)?.status, async (status) => {
    if (status === 'completed' && activeTaskId.value) {
      // Retry a few times since artifact may not be written yet
      for (let attempt = 0; attempt < 4; attempt++) {
        await new Promise(r => setTimeout(r, attempt * 600))
        await store.loadArtifacts(workspaceId)
        const artifact = store.artifacts.find(a => a.task_id === activeTaskId.value)
        if (artifact?.content) { finalOutput.value = artifact.content; break }
        // Direct fetch fallback
        const { data } = await supabase.from('artifacts').select('content').eq('task_id', activeTaskId.value).order('created_at', { ascending: false }).limit(1).maybeSingle()
        if (data?.content) { finalOutput.value = data.content; break }
      }
    }
  })

  supabase.channel(`workspace-pipeline:${workspaceId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'task_pipeline', filter: `workspace_id=eq.${workspaceId}` },
      (p) => {
        const step = p.new as any
        if (!taskPipelines.value[step.task_id]) taskPipelines.value[step.task_id] = []
        const idx = taskPipelines.value[step.task_id].findIndex((s: any) => s.id === step.id)
        if (idx !== -1) taskPipelines.value[step.task_id][idx] = step
        else taskPipelines.value[step.task_id].push(step)
        if (activeTaskId.value === step.task_id) {
          const ai = activePipeline.value.findIndex(s => s.id === step.id)
          if (ai !== -1) activePipeline.value[ai] = step
          else activePipeline.value.push(step)
        }
      })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'task_updates', filter: `workspace_id=eq.${workspaceId}` },
      async (p) => {
        const update = p.new as any
        if (activeTaskId.value === update.task_id) {
          liveUpdates.value.push(update)
          if (update.update_type === 'progress') {
            setTimeout(async () => {
              await store.loadArtifacts(workspaceId)
              const artifact = store.artifacts.find(a => a.task_id === activeTaskId.value)
              if (artifact) finalOutput.value = artifact.content
            }, 800)
          }
        }
      })
    .subscribe()
})

async function selectTask(taskId: string) {
  selectedMeeting.value = null
  activeTaskId.value = taskId
  finalOutput.value = ''
  liveUpdates.value = []

  const [pipelineRes] = await Promise.all([
    supabase.from('task_pipeline').select('*').eq('task_id', taskId).order('step_index'),
    store.loadArtifacts(workspaceId)
  ])
  activePipeline.value = pipelineRes.data || []

  // Always try to load artifact for this task (completed or not)
  const artifact = store.artifacts.find(a => a.task_id === taskId)
  if (artifact) finalOutput.value = artifact.content

  // Also try direct DB fetch in case store is stale
  if (!artifact) {
    const { data: directArtifact } = await supabase
      .from('artifacts')
      .select('content')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (directArtifact?.content) finalOutput.value = directArtifact.content
  }
}

async function handleApprove(taskId: string) {
  const task = store.tasks.find(t => t.id === taskId)
  const agent = task?.assigned_agent || 'research'
  await store.approveTask(taskId, agent)
  activeTaskId.value = taskId
  selectedMeeting.value = null
  liveUpdates.value = []
  activePipeline.value = []
  finalOutput.value = ''
  store.runTask(taskId)
}

async function handleReject(taskId: string) { await store.rejectTask(taskId) }

async function sendHumanMsg() {
  if (!humanMsg.value.trim() || !activeTaskId.value) return
  const text = humanMsg.value.trim()
  humanMsg.value = ''
  await store.sendMessage(text, activeTaskId.value)
  if (activeTask.value?.status === 'needs_clarification') store.runTask(activeTaskId.value)
}

async function handleDelete(taskId: string) {
  if (window.confirm('Delete this task?')) await store.deleteTask(taskId)
}

async function handleMeetingSubmit(text: string) {
  processingMeeting.value = true
  try {
    await store.processMeetingTranscript(text)
    showMeetingInput.value = false
  } catch (e: any) {
    showToast(e?.data?.message || 'Failed to process')
  } finally {
    processingMeeting.value = false
  }
}
</script>