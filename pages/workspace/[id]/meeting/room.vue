<template>
  <div class="meeting-room">

    <!-- Header -->
    <div class="meeting-header">
      <div class="header-left">
        <NuxtLink :to="`/workspace/${workspaceId}`" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </NuxtLink>
        <!-- Editable meeting title -->
        <div class="title-wrap">
          <input
            v-if="editingTitle"
            ref="titleInput"
            v-model="meetingTitle"
            class="title-edit-input"
            @blur="saveTitle"
            @keydown.enter="saveTitle"
            @keydown.esc="editingTitle = false"
          />
          <button v-else class="title-btn" @click="startEditTitle" title="Click to rename">
            {{ meetingTitle }}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
        <span v-if="isRecording" class="live-badge">● LIVE {{ duration }}</span>
        <span v-else-if="isPaused" class="paused-badge">⏸ Paused</span>
      </div>
      <div class="header-right">
        <template v-if="!isRecording && !isPaused && !ended">
          <button class="btn-record" @click="openShareModal">
            <span class="rec-dot" />
            Start recording
          </button>
        </template>
        <template v-if="isPaused && !ended">
          <button class="btn-secondary" @click="resumeRecording">▶ Resume</button>
          <button class="btn-danger" @click="endMeeting">End meeting</button>
        </template>
        <template v-if="isRecording">
          <button class="btn-secondary" @click="pauseRecording">⏸ Pause</button>
          <button class="btn-danger" @click="endMeeting">End meeting</button>
        </template>
      </div>
    </div>

    <!-- Tab bar -->
    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: activeTab === 'live' }"    @click="activeTab = 'live'">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
        Live transcript
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'bot' }"     @click="activeTab = 'bot'">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Bot join
      </button>
      <button class="tab-btn" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5-4v-4h4"/></svg>
        Past meetings
      </button>
    </div>

    <!-- Main body -->
    <div class="meeting-body">

      <!-- ── TAB: Live transcript ── -->
      <template v-if="activeTab === 'live'">
        <div class="live-grid">

          <!-- Transcript panel -->
          <div class="panel transcript-panel">
            <div class="panel-label">
              Transcript
              <div class="panel-actions">
                <label class="upload-link">
                  <input type="file" accept="audio/*,video/*" @change="handleFileUpload" />
                  Upload recording
                </label>
              </div>
            </div>
            <div v-if="uploadStatus" class="upload-bar" :class="{ error: uploadError }">{{ uploadStatus }}</div>
            <div ref="transcriptEl" class="panel-scroll">
              <div v-if="!fullTranscript && !interimText" class="empty-hint">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
                <span>{{ isRecording ? 'Listening…' : 'Press Start recording to begin.' }}</span>
              </div>
              <p v-else class="transcript-text">
                {{ fullTranscript }}<span v-if="interimText" class="interim"> {{ interimText }}</span>
              </p>
            </div>
            <p v-if="deepgramError" class="error-banner">{{ deepgramError }}</p>
          </div>

          <!-- Agent responses + tasks -->
          <div class="panel response-panel">
            <div class="panel-label">Agent responses</div>
            <div ref="chatEl" class="panel-scroll chat-scroll">
              <div v-if="!messages.length" class="empty-hint">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>Agents respond automatically as the meeting progresses.</span>
              </div>
              <div v-for="msg in messages" :key="msg.id" class="msg" :class="msg.sender_type">
                <div class="msg-meta">
                  <span class="msg-sender" :class="msg.agent_type || 'human'">{{ senderName(msg) }}</span>
                  <span class="msg-time">{{ formatTime(msg.created_at) }}</span>
                </div>
                <div class="msg-body">{{ msg.content }}</div>
              </div>
              <div v-if="agentThinking" class="msg agent">
                <div class="msg-meta"><span class="msg-sender">{{ thinkingAgent }} is thinking…</span></div>
              </div>
            </div>

            <!-- Tasks created -->
            <div v-if="meetingTasks.length" class="tasks-section">
              <div class="tasks-label">{{ meetingTasks.length }} task{{ meetingTasks.length !== 1 ? 's' : '' }} created</div>
              <div class="tasks-grid">
                <div v-for="task in meetingTasks" :key="task.id" class="task-chip">
                  <span class="task-chip-title">{{ task.title }}</span>
                  <span class="task-chip-status" :class="task.status">{{ statusLabel(task.status) }}</span>
                </div>
              </div>
              <NuxtLink :to="`/workspace/${workspaceId}`" class="go-to-workspace-link">
                View in workspace →
              </NuxtLink>
            </div>
          </div>

        </div>

        <!-- Ended state -->
        <div v-if="ended" class="ended-overlay">
          <div class="ended-card">
            <div class="ended-icon">✓</div>
            <h3>Meeting ended</h3>
            <p>{{ meetingTasks.length }} task{{ meetingTasks.length !== 1 ? 's' : '' }} created from this meeting</p>
            <NuxtLink :to="`/workspace/${workspaceId}`" class="btn btn-primary">
              Go to workspace →
            </NuxtLink>
            <button class="btn btn-ghost" @click="deleteMeeting">Delete meeting</button>
          </div>
        </div>
      </template>

      <!-- ── TAB: Bot join ── -->
      <template v-if="activeTab === 'bot'">
        <div class="bot-tab">

          <!-- Join Now / Schedule tabs -->
          <div class="bot-mode-tabs">
            <button class="bot-mode-tab" :class="{ active: botTab === 'now' }" @click="botTab = 'now'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14"/><rect x="3" y="8" width="12" height="8" rx="2"/></svg>
              Join now
            </button>
            <button class="bot-mode-tab" :class="{ active: botTab === 'schedule' }" @click="botTab = 'schedule'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Schedule
            </button>
          </div>

          <!-- ── JOIN NOW ── -->
          <template v-if="botTab === 'now'">

            <!-- Platform picker -->
            <div class="platform-grid">
              <button v-for="p in platforms" :key="p.id" class="platform-btn" :class="{ selected: selectedPlatform === p.id }" @click="selectedPlatform = p.id">
                <div class="plat-logo" :style="{ background: p.bg }">
                  <svg v-html="p.icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" />
                </div>
                <span>{{ p.name }}</span>
                <div v-if="selectedPlatform === p.id" class="plat-check">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              </button>
            </div>

            <div class="bot-form">
              <div v-if="selectedPlatform === 'zoom'" class="join-method-toggle">
                <button :class="{ active: botJoinMethod === 'url' }" @click="botJoinMethod = 'url'">Paste URL</button>
                <button :class="{ active: botJoinMethod === 'id' }"  @click="botJoinMethod = 'id'">Meeting ID</button>
              </div>
              <div v-if="selectedPlatform !== 'zoom' || botJoinMethod === 'url'" class="bot-form-field">
                <label>Meeting link</label>
                <input v-model="botMeetingUrl" class="input" :placeholder="selectedPlatformMeta?.placeholder || 'Paste meeting URL…'" type="url" />
              </div>
              <template v-if="selectedPlatform === 'zoom' && botJoinMethod === 'id'">
                <div class="bot-form-field">
                  <label>Meeting ID</label>
                  <input v-model="botZoomId" class="input" placeholder="812 3456 7890" />
                </div>
                <div class="bot-form-field">
                  <label>Passcode</label>
                  <input v-model="botZoomPwd" class="input" placeholder="abc123" type="password" />
                </div>
              </template>
              <div class="bot-form-field">
                <label>Bot name <span class="field-required">*</span></label>
                <input v-model="botName" class="input" :class="{ 'input-error': botNameTouched && !botName.trim() }" placeholder="e.g. Atlantir" @blur="botNameTouched = true" />
                <span v-if="botNameTouched && !botName.trim()" class="field-error-msg">Bot name is required</span>
              </div>
              <div class="bot-form-field">
                <label>Response mode</label>
                <select v-model="botResponseMode" class="input">
                  <option value="addressed">Only respond when addressed by name</option>
                  <option value="questions">Respond to all questions</option>
                  <option value="always">Respond to everything relevant</option>
                </select>
              </div>
              <div class="bot-form-field">
                <label>Instructions / notes</label>
                <textarea v-model="botInstructions" class="input instructions-textarea" placeholder="Tell the bot its purpose, e.g. You are joining a sales call. Listen for pain points and answer pricing questions from the knowledge base." rows="3" />
              </div>
              <button class="btn btn-primary bot-join-btn" :disabled="!canBotJoin || botJoining" @click="joinWithBot">
                <span v-if="botJoining" class="spinner" />
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14"/><rect x="3" y="8" width="12" height="8" rx="2"/></svg>
                {{ botJoining ? 'Joining…' : `Send bot to ${selectedPlatformMeta?.name || 'meeting'}` }}
              </button>
            </div>

            <!-- Active bot session -->
            <div v-if="botSession" class="bot-session">
              <div class="bot-session-bar">
                <div class="bot-live-dot" :class="botSession.status" />
                <span class="bot-session-name">{{ botSession.platform }} · {{ botSession.botName }}</span>
                <span class="bot-session-status">{{ botSession.status }}</span>
                <div v-if="botSession.speaking" class="wave-inline"><span/><span/><span/></div>
                <button class="btn btn-ghost btn-sm" @click="leaveBotCall">Leave call</button>
              </div>
              <div v-if="botSession.transcript?.length" class="bot-transcript">
                <div v-for="(entry, i) in botSession.transcript" :key="i" class="bot-entry" :class="entry.role">
                  <div class="bot-entry-meta">
                    <span class="bot-entry-role">{{ entry.role === 'bot' ? 'Bot' : 'Meeting' }}</span>
                    <span class="bot-entry-time">{{ formatTime(new Date(entry.ts).toISOString()) }}</span>
                  </div>
                  <span class="bot-entry-text">{{ entry.text }}</span>
                </div>
              </div>
              <div v-else class="empty-hint" style="padding:20px 16px">
                <span>Bot is in the meeting. Conversation will appear here as people speak.</span>
              </div>
            </div>

          </template>

          <!-- ── SCHEDULE ── -->
          <template v-if="botTab === 'schedule'">
            <div class="bot-form">
              <!-- Platform picker (reused) -->
              <div class="platform-grid">
                <button v-for="p in platforms" :key="p.id" class="platform-btn" :class="{ selected: schedPlatform === p.id }" @click="schedPlatform = p.id">
                  <div class="plat-logo" :style="{ background: p.bg }">
                    <svg v-html="p.icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" />
                  </div>
                  <span>{{ p.name }}</span>
                  <div v-if="schedPlatform === p.id" class="plat-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </button>
              </div>

              <!-- URL or ID toggle (Zoom) -->
              <div v-if="schedPlatform === 'zoom'" class="join-method-toggle">
                <button :class="{ active: schedJoinMethod === 'url' }" @click="schedJoinMethod = 'url'">Paste URL</button>
                <button :class="{ active: schedJoinMethod === 'id' }"  @click="schedJoinMethod = 'id'">Meeting ID</button>
              </div>
              <div v-if="schedPlatform !== 'zoom' || schedJoinMethod === 'url'" class="bot-form-field">
                <label>Meeting link</label>
                <input v-model="sched.room_url" class="input" placeholder="https://zoom.us/j/… or meet.google.com/…" type="url" />
              </div>
              <template v-if="schedPlatform === 'zoom' && schedJoinMethod === 'id'">
                <div class="bot-form-field">
                  <label>Meeting ID</label>
                  <input v-model="sched.zoom_id" class="input" placeholder="812 3456 7890" />
                </div>
                <div class="bot-form-field">
                  <label>Passcode</label>
                  <input v-model="sched.zoom_pwd" class="input" placeholder="abc123" type="password" />
                </div>
              </template>

              <!-- Date / time / tz row -->
              <div class="sched-time-row">
                <div class="bot-form-field">
                  <label>Date</label>
                  <input v-model="sched.date" type="date" :min="todayStr" class="input" />
                </div>
                <div class="bot-form-field">
                  <label>Time</label>
                  <input v-model="sched.time" type="time" class="input" />
                </div>
                <div class="bot-form-field">
                  <label>Timezone</label>
                  <select v-model="sched.timezone" class="input">
                    <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
                  </select>
                </div>
              </div>

              <div class="bot-form-field">
                <label>Bot name <span class="field-required">*</span></label>
                <input v-model="sched.bot_name" class="input" placeholder="e.g. Atlantir" />
              </div>
              <div class="bot-form-field">
                <label>Response mode</label>
                <select v-model="sched.response_mode" class="input">
                  <option value="addressed">Only respond when addressed by name</option>
                  <option value="questions">Respond to all questions</option>
                  <option value="always">Respond to everything relevant</option>
                </select>
              </div>
              <div class="bot-form-field">
                <label>Instructions / notes</label>
                <textarea v-model="sched.instructions" class="input instructions-textarea" placeholder="Tell the bot its purpose for this scheduled call…" rows="3" />
              </div>

              <div class="join-notice">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Bot joins automatically at the scheduled time. Your browser doesn't need to be open.
              </div>

              <button class="btn btn-primary bot-join-btn" :disabled="!canSchedule || scheduling" @click="scheduleBot">
                <span v-if="scheduling" class="spinner" />
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ scheduling ? 'Scheduling…' : 'Schedule bot' }}
              </button>
            </div>

            <!-- Scheduled list -->
            <div v-if="scheduledBots.length" class="sched-list">
              <div class="sched-list-label">Upcoming scheduled bots</div>
              <div v-for="s in scheduledBots" :key="s.id" class="sched-row">
                <div class="sched-row-main">
                  <span class="sched-row-time">{{ formatScheduledTime(s) }}</span>
                  <span class="sched-row-url">{{ truncateUrl(s.room_url) }}</span>
                  <span class="sched-status-badge" :class="s.status">{{ s.status }}</span>
                </div>
                <button v-if="s.status === 'pending'" class="sched-cancel-btn" @click="deleteScheduled(s.id)">Cancel</button>
              </div>
            </div>
          </template>

        </div>
      </template>

      <!-- ── TAB: Past meetings ── -->
      <template v-if="activeTab === 'history'">
        <div class="history-tab">

          <!-- Empty state -->
          <div v-if="!pastMeetings.length" class="history-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5-4v-4h4"/></svg>
            <span>No past meetings yet.</span>
          </div>

          <!-- Single unified list surface -->
          <div v-else class="history-list">
            <!-- Column header -->
            <div class="history-list-header">
              <span class="hcol-title">Title</span>
              <span class="hcol-date">Date</span>
              <span class="hcol-tasks">Tasks</span>
              <span class="hcol-actions" />
            </div>

            <template v-for="(m, idx) in pastMeetings" :key="m.id">
              <!-- Main row -->
              <div class="history-row-main" @click="openMeeting(m)">

                <!-- Title + always-visible Edit btn -->
                <div class="hcol-title" @click.stop>
                  <template v-if="historyEditingId === m.id">
                    <input
                      class="history-title-input"
                      v-model="historyEditingTitle"
                      @keydown.enter="commitHistoryTitle(m)"
                      @keydown.esc="historyEditingId = null"
                      @blur="commitHistoryTitle(m)"
                      ref="historyTitleInputRef"
                      maxlength="100"
                    />
                  </template>
                  <template v-else>
                    <button class="history-row-open" @click="openMeeting(m)" tabindex="-1">
                      {{ m.title || 'Untitled meeting' }}
                    </button>
                    <button class="history-edit-btn" @click.stop="startHistoryEdit(m)" title="Rename">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                  </template>
                </div>

                <span class="hcol-date">{{ formatDate(m.created_at) }}</span>

                <span class="hcol-tasks">
                  <span v-if="m.task_count > 0" class="task-pill">{{ m.task_count }} task{{ m.task_count !== 1 ? 's' : '' }}</span>
                  <span v-else class="task-pill-empty">—</span>
                </span>

                <!-- Always-visible actions -->
                <div class="hcol-actions" @click.stop>
                  <button
                    v-if="m.transcript"
                    class="hrow-btn"
                    :class="{ active: expandedMeeting === m.id }"
                    @click.stop="expandedMeeting = expandedMeeting === m.id ? null : m.id"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    {{ expandedMeeting === m.id ? 'Hide' : 'Transcript' }}
                  </button>
                  <button class="hrow-btn" @click.stop="useTranscriptForTask(m)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Create tasks
                  </button>
                  <button class="hrow-icon-btn" @click.stop="deletePastMeeting(m.id)" title="Delete">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                  </button>
                </div>
              </div>

              <!-- Expandable transcript — full width, no indent -->
              <div v-if="expandedMeeting === m.id && m.transcript" class="history-transcript">
                {{ m.transcript }}
              </div>

              <!-- Divider -->
              <div v-if="idx < pastMeetings.length - 1" class="history-divider" />
            </template>
          </div>
        </div>
      </template>

    </div>

    <!-- ── Custom Share / Record Modal ── -->
    <Teleport to="body">
      <div v-if="showShareModal" class="modal-backdrop" @click.self="showShareModal = false">
        <div class="share-modal">

          <div class="share-modal-header">
            <div class="share-modal-icon">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
            </div>
            <div>
              <h3 class="share-modal-title">Start recording</h3>
              <p class="share-modal-sub">Choose what to capture for this session</p>
            </div>
            <button class="share-modal-close" @click="showShareModal = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="share-modal-body">

            <!-- Source tabs -->
            <div class="share-tabs">
              <button v-for="tab in shareTabs" :key="tab.id" class="share-tab" :class="{ active: shareTab === tab.id }" @click="shareTab = tab.id">
                {{ tab.label }}
              </button>
            </div>

            <!-- Source list -->
            <div class="share-tab-content">
              <!-- Browser Tab -->
              <div v-if="shareTab === 'tab'" class="share-items">
                <div
                  v-for="t in mockBrowserTabs"
                  :key="t.id"
                  class="share-item"
                  :class="{ selected: selectedSource?.id === t.id }"
                  @click="selectedSource = t"
                >
                  <div class="share-item-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  </div>
                  <span class="share-item-name">{{ t.name }}</span>
                  <div v-if="selectedSource?.id === t.id" class="share-item-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>

              <!-- Window -->
              <div v-else-if="shareTab === 'window'" class="share-items">
                <div
                  v-for="w in mockWindows"
                  :key="w.id"
                  class="share-item"
                  :class="{ selected: selectedSource?.id === w.id }"
                  @click="selectedSource = w"
                >
                  <div class="share-item-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <span class="share-item-name">{{ w.name }}</span>
                  <div v-if="selectedSource?.id === w.id" class="share-item-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>

              <!-- Entire Screen -->
              <div v-else-if="shareTab === 'screen'" class="share-items">
                <div
                  class="share-item"
                  :class="{ selected: selectedSource?.id === 'screen-main' }"
                  @click="selectedSource = { id: 'screen-main', name: 'Entire Screen' }"
                >
                  <div class="share-item-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <span class="share-item-name">Entire Screen</span>
                  <div v-if="selectedSource?.id === 'screen-main'" class="share-item-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Options: audio + record -->
            <div class="share-options">
              <div class="share-option-row">
                <div class="share-option-info">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <div>
                    <span class="share-option-label">Capture audio</span>
                    <span class="share-option-desc">Include system audio from the selected source</span>
                  </div>
                </div>
                <button class="toggle" :class="{ on: shareAudio }" @click="shareAudio = !shareAudio">
                  <span class="toggle-knob" />
                </button>
              </div>
              <div class="share-option-row">
                <div class="share-option-info">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                  <div>
                    <span class="share-option-label">Save recording</span>
                    <span class="share-option-desc">Automatically save when the meeting ends</span>
                  </div>
                </div>
                <button class="toggle" :class="{ on: autoSave }" @click="autoSave = !autoSave">
                  <span class="toggle-knob" />
                </button>
              </div>
            </div>

          </div>

          <div class="share-modal-footer">
            <button class="btn-cancel-modal" @click="showShareModal = false">Cancel</button>
            <button class="btn-start-rec" :disabled="!selectedSource" @click="confirmStartRecording">
              <span class="rec-dot-sm" />
              Start recording
            </button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })

const route = useRoute()
const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const {
  transcript, interimText, isRecording, isPaused, error: deepgramError,
  loadDevices, start, pause, resume, stop
} = useDeepgram()

// ── State ────────────────────────────────────────────────────────────────────
const meetingId       = ref<string | null>(null)
const meetingTitle    = ref('New meeting')
const editingTitle    = ref(false)
const titleInput      = ref<HTMLInputElement>()
const messages        = ref<any[]>([])
const meetingTasks    = ref<any[]>([])
const agentThinking   = ref(false)
const thinkingAgent   = ref('')
const ended           = ref(false)
const fullTranscript  = ref('')
const pastMeetings    = ref<any[]>([])
const expandedMeeting = ref<string | null>(null)
const uploadStatus    = ref('')
const uploadError     = ref(false)
const transcriptEl    = ref<HTMLElement>()
const chatEl          = ref<HTMLElement>()
const startTime       = ref<Date | null>(null)
const duration        = ref('0:00')
const activeTab       = ref<'live' | 'bot' | 'history'>('live')

// History inline editing
const historyEditingId    = ref<string | null>(null)
const historyEditingTitle = ref('')
const historyTitleInputRef = ref<HTMLInputElement | null>(null)

// Share modal
const showShareModal = ref(false)
const shareTab       = ref<'tab' | 'window' | 'screen'>('tab')
const shareAudio     = ref(true)
const autoSave       = ref(false)
const selectedSource = ref<{ id: string; name: string } | null>(null)

const shareTabs = [
  { id: 'tab',    label: 'Browser Tab' },
  { id: 'window', label: 'Window' },
  { id: 'screen', label: 'Entire Screen' },
] as const

// Replace with real getDisplayMedia enumeration when wired up
const mockBrowserTabs = [
  { id: 'bt-1', name: 'Meeting Room — Atlantir' },
  { id: 'bt-2', name: 'Google Meet' },
  { id: 'bt-3', name: 'Zoom' },
]
const mockWindows = [
  { id: 'win-1', name: 'Microsoft Edge' },
  { id: 'win-2', name: 'Slack' },
  { id: 'win-3', name: 'Finder' },
]

function openShareModal() {
  selectedSource.value = null
  shareTab.value = 'tab'
  showShareModal.value = true
}

async function confirmStartRecording() {
  showShareModal.value = false
  await startRecording()
}

// Bot join state
const selectedPlatform   = ref('googlemeet')
const botMeetingUrl      = ref('')
const botName            = ref('')
const botNameTouched     = ref(false)
const botZoomId          = ref('')
const botZoomPwd         = ref('')
const botJoinMethod      = ref<'url' | 'id'>('url')
const botResponseMode    = ref('addressed')
const botInstructions    = ref('')
const botJoining         = ref(false)
const botSession         = ref<any>(null)
const botTab             = ref<'now' | 'schedule'>('now')

// Schedule state
const todayStr       = new Date().toISOString().slice(0, 10)
const schedPlatform  = ref('googlemeet')
const schedJoinMethod = ref<'url' | 'id'>('url')
const scheduling     = ref(false)
const scheduledBots  = ref<any[]>([])
const sched = ref({
  room_url: '', zoom_id: '', zoom_pwd: '',
  date: todayStr, time: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  bot_name: 'Atlantir', response_mode: 'addressed', instructions: '',
})

const commonTimezones = [
  { value: 'UTC',                 label: 'UTC' },
  { value: 'America/New_York',    label: 'Eastern (ET)' },
  { value: 'America/Chicago',     label: 'Central (CT)' },
  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
  { value: 'Europe/London',       label: 'London (GMT/BST)' },
  { value: 'Europe/Paris',        label: 'Paris (CET)' },
  { value: 'Asia/Kolkata',        label: 'India (IST)' },
  { value: 'Asia/Dubai',          label: 'Dubai (GST)' },
  { value: 'Asia/Singapore',      label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo',          label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney',    label: 'Sydney (AEST)' },
]

const canSchedule = computed(() => {
  const hasUrl = schedPlatform.value !== 'zoom' || schedJoinMethod.value === 'url'
    ? sched.value.room_url.trim().length > 0
    : sched.value.zoom_id.replace(/\D/g, '').length >= 9
  return hasUrl && sched.value.date && sched.value.time && sched.value.bot_name.trim()
})

function buildSchedUrl(): string {
  if (schedPlatform.value === 'zoom' && schedJoinMethod.value === 'id') {
    const id  = sched.value.zoom_id.replace(/\s+/g, '').replace(/-/g, '')
    const pwd = sched.value.zoom_pwd.trim()
    return `https://zoom.us/j/${id}${pwd ? `?pwd=${encodeURIComponent(pwd)}` : ''}`
  }
  return sched.value.room_url.trim()
}

function getTzOffset(tz: string, date: Date): number {
  try {
    const utc = date.toLocaleString('en-US', { timeZone: 'UTC' })
    const tzs = date.toLocaleString('en-US', { timeZone: tz })
    return new Date(tzs).getTime() - new Date(utc).getTime()
  } catch { return 0 }
}

function formatScheduledTime(s: any) {
  try {
    return new Intl.DateTimeFormat('en', {
      timeZone: s.timezone || 'UTC',
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(s.scheduled_at))
  } catch { return s.scheduled_at }
}

function truncateUrl(url: string) {
  try { return new URL(url).hostname + new URL(url).pathname.slice(0, 20) } catch { return url }
}

async function loadScheduledBots() {
  try {
    const data = await $fetch<any[]>(`/api/bot/schedules?workspace_id=${workspaceId}`)
    scheduledBots.value = (data || []).filter((s: any) => s.status === 'pending' || s.status === 'running')
  } catch {}
}

async function scheduleBot() {
  if (!canSchedule.value) return
  scheduling.value = true
  try {
    const localIso   = `${sched.value.date}T${sched.value.time}:00`
    const target     = new Date(localIso)
    const utcMs      = target.getTime() - getTzOffset(sched.value.timezone, target)
    const scheduledAt = new Date(utcMs).toISOString()

    await $fetch('/api/bot/schedule', {
      method: 'POST',
      body: {
        workspace_id:  workspaceId,
        room_url:      buildSchedUrl(),
        bot_name:      sched.value.bot_name || 'Atlantir',
        response_mode: sched.value.response_mode,
        instructions:  sched.value.instructions.trim() || null,
        scheduled_at:  scheduledAt,
        timezone:      sched.value.timezone,
        platform:      schedPlatform.value,
      }
    })
    sched.value = { ...sched.value, room_url: '', zoom_id: '', zoom_pwd: '', time: '', instructions: '' }
    await loadScheduledBots()
    botTab.value = 'now'
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to schedule bot')
  } finally {
    scheduling.value = false
  }
}

async function deleteScheduled(id: string) {
  if (!confirm('Cancel this scheduled bot?')) return
  await $fetch('/api/bot/schedule-delete', { method: 'POST', body: { id } }).catch(() => {})
  scheduledBots.value = scheduledBots.value.filter((s: any) => s.id !== id)
}

const canBotJoin = computed(() => {
  if (!botName.value.trim()) return false
  if (selectedPlatform.value === 'zoom') {
    if (botJoinMethod.value === 'id') return botZoomId.value.replace(/\D/g, '').length >= 9
    return botMeetingUrl.value.trim().length > 0
  }
  return botMeetingUrl.value.trim().length > 0
})

let durationTimer: any = null
let silenceTimer:  any = null
let deepTimer:     any = null
let lastAnalyzedLength = 0

// ── Platform metadata ────────────────────────────────────────────────────────
const platforms = [
  {
    id: 'googlemeet', name: 'Google Meet', bg: '#1a73e8', placeholder: 'https://meet.google.com/abc-defg-hij',
    icon: '<path d="M21.8 10.5h-1.3V7.7c0-.4-.4-.8-.8-.8h-5.2v6.7H21c.4 0 .8-.3.8-.8v-2.3zm-18.3-3.6v10.2c0 .4.4.8.8.8h12c.4 0 .8-.4.8-.8V6.9c0-.4-.4-.8-.8-.8H4.3c-.4 0-.8.4-.8.8z"/>'
  },
  {
    id: 'zoom', name: 'Zoom', bg: '#2D8CFF', placeholder: 'https://zoom.us/j/123456789',
    icon: '<path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" fill="none" stroke="currentColor" stroke-width="2"/>'
  },
  {
    id: 'teams', name: 'MS Teams', bg: '#5b5ea6', placeholder: 'https://teams.microsoft.com/l/meetup-join/…',
    icon: '<path d="M17 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm3-8h-4V3a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" fill="none" stroke="currentColor" stroke-width="1.5"/>'
  },
]

const selectedPlatformMeta = computed(() => platforms.find(p => p.id === selectedPlatform.value))

// ── Labels ────────────────────────────────────────────────────────────────────
const agentLabels: Record<string, string> = { research: 'Research', writer: 'Writer', analyst: 'Analyst', executor: 'Executor', orchestrator: 'Orchestrator' }
const statusLabels: Record<string, string> = { pending_approval: 'Pending', approved: 'Approved', in_progress: 'Running', needs_clarification: 'Question', completed: 'Done', cancelled: 'Cancelled' }

function statusLabel(s: string) { return statusLabels[s] || s }
function formatTime(ts: string)  { return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
function formatDate(ts: string)  { return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
function senderName(msg: any) {
  if (msg.sender_type === 'human') return user.value?.user_metadata?.full_name || 'You'
  return agentLabels[msg.agent_type] || 'Agent'
}

// ── Header title editing ──────────────────────────────────────────────────────
async function startEditTitle() {
  editingTitle.value = true
  await nextTick()
  titleInput.value?.focus()
  titleInput.value?.select()
}
async function saveTitle() {
  editingTitle.value = false
  if (!meetingId.value || !meetingTitle.value.trim()) return
  await $fetch('/api/meetings/rename', {
    method: 'POST',
    body: { meeting_id: meetingId.value, title: meetingTitle.value.trim() }
  }).catch(() => {})
}

// ── History inline title editing ──────────────────────────────────────────────
async function startHistoryEdit(m: any) {
  historyEditingId.value = m.id
  historyEditingTitle.value = m.title || 'Untitled meeting'
  await nextTick()
  historyTitleInputRef.value?.focus()
  historyTitleInputRef.value?.select()
}

async function commitHistoryTitle(m: any) {
  const trimmed = historyEditingTitle.value.trim()
  if (trimmed && trimmed !== m.title) {
    m.title = trimmed
    await $fetch('/api/meetings/rename', {
      method: 'POST',
      body: { meeting_id: m.id, title: trimmed }
    }).catch(() => {})
  }
  historyEditingId.value = null
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
let meetingChannel: any = null

onMounted(async () => {
  await loadDevices()
  await loadPastMeetings()

  // Pre-populate bot name from workspace settings
  try {
    const { data: ws } = await supabase
      .from('workspaces')
      .select('bot_name, bot_response_mode')
      .eq('id', workspaceId)
      .single()
    if (ws?.bot_name) { botName.value = ws.bot_name; sched.value.bot_name = ws.bot_name }
    if (ws?.bot_response_mode) { botResponseMode.value = ws.bot_response_mode; sched.value.response_mode = ws.bot_response_mode }
  } catch {}
  await loadScheduledBots()

  const storedId = sessionStorage.getItem(`meeting:${workspaceId}`)
  let meeting: any

  if (storedId) {
    try {
      const { data } = await supabase.from('meetings').select('*').eq('id', storedId).single()
      meeting = data
      if (meeting) {
        meetingId.value = meeting.id
        meetingTitle.value = meeting.title || 'New meeting'
      }
    } catch {}
  }

  if (!meetingId.value) {
    meeting = await $fetch<any>('/api/meetings/create', {
      method: 'POST',
      body: { workspace_id: workspaceId, title: meetingTitle.value, created_by: user.value?.id }
    })
    meetingId.value = meeting.id
    sessionStorage.setItem(`meeting:${workspaceId}`, meeting.id)
  }

  meetingChannel = supabase.channel(`meeting:${meetingId.value}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `meeting_id=eq.${meetingId.value}` },
      (p) => { if (!messages.value.find((m: any) => m.id === p.new.id)) { messages.value.push(p.new); scrollChat() } })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks', filter: `meeting_id=eq.${meetingId.value}` },
      (p) => { if (!meetingTasks.value.find((t: any) => t.id === p.new.id)) meetingTasks.value.push(p.new) })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tasks', filter: `meeting_id=eq.${meetingId.value}` },
      (p) => { const i = meetingTasks.value.findIndex((t: any) => t.id === p.new.id); if (i !== -1) meetingTasks.value[i] = p.new })
    .subscribe()
})

onUnmounted(() => {
  clearInterval(durationTimer); clearInterval(deepTimer); clearTimeout(silenceTimer)
  if (isRecording.value) stop()
  meetingChannel?.unsubscribe()
})

// ── Recording ─────────────────────────────────────────────────────────────────
async function startRecording() {
  await start()
  if (!startTime.value) startTime.value = new Date()
  durationTimer = setInterval(() => {
    const secs = Math.floor((Date.now() - startTime.value!.getTime()) / 1000)
    duration.value = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
  }, 1000)
  deepTimer = setInterval(() => {
    const chunk = fullTranscript.value.slice(lastAnalyzedLength)
    if (chunk.trim().length > 50) { analyzeChunk(chunk, 'deep'); lastAnalyzedLength = fullTranscript.value.length }
  }, 30000)
}

function resumeRecording() { resume() }
function pauseRecording()  { stop(); clearInterval(durationTimer); clearInterval(deepTimer); clearTimeout(silenceTimer) }

async function endMeeting() {
  if (isRecording.value) stop()
  clearInterval(durationTimer); clearInterval(deepTimer); clearTimeout(silenceTimer)
  await $fetch('/api/meetings/end', { method: 'POST', body: { meeting_id: meetingId.value, transcript: fullTranscript.value } })
  ended.value = true
  sessionStorage.removeItem(`meeting:${workspaceId}`)
  await loadPastMeetings()
}

watch(transcript, (v) => {
  fullTranscript.value = v
  nextTick(() => { if (transcriptEl.value) transcriptEl.value.scrollTop = transcriptEl.value.scrollHeight })
  clearTimeout(silenceTimer)
  silenceTimer = setTimeout(() => {
    const chunk = fullTranscript.value.slice(lastAnalyzedLength)
    if (chunk.trim().length > 20) analyzeChunk(chunk, 'quick')
  }, 1500)
})

async function analyzeChunk(chunk: string, type: string) {
  if (!meetingId.value || !chunk.trim()) return
  try {
    const result = await $fetch<any>('/api/meetings/analyze', {
      method: 'POST',
      body: { meeting_id: meetingId.value, transcript_chunk: chunk, full_transcript: fullTranscript.value, workspace_id: workspaceId, analysis_type: type }
    })
    if (result.action !== 'none') {
      agentThinking.value = true
      thinkingAgent.value = agentLabels[result.agent] || 'Agent'
      setTimeout(() => { agentThinking.value = false }, 2000)
      if (type === 'quick') lastAnalyzedLength = fullTranscript.value.length
    }
  } catch {}
}

function scrollChat() { nextTick(() => { if (chatEl.value) chatEl.value.scrollTop = chatEl.value.scrollHeight }) }

// ── Upload ─────────────────────────────────────────────────────────────────────
async function handleFileUpload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploadStatus.value = `Transcribing ${file.name}…`
  uploadError.value = false
  const form = new FormData()
  form.append('file', file)
  form.append('workspace_id', workspaceId)
  form.append('user_id', user.value?.id || '')
  form.append('title', file.name.replace(/\.[^.]+$/, ''))
  try {
    const result = await $fetch<any>('/api/meetings/transcribe', { method: 'POST', body: form })
    uploadStatus.value = `✓ Transcribed — ${result.transcript?.slice(0, 60)}…`
    await loadPastMeetings()
  } catch (err: any) {
    uploadStatus.value = err?.data?.message || 'Transcription failed'
    uploadError.value = true
  }
  input.value = ''
}

// ── Past meetings ──────────────────────────────────────────────────────────────
async function loadPastMeetings() {
  try {
    const data = await $fetch<any[]>(`/api/meetings?workspace_id=${workspaceId}`)
    pastMeetings.value = (data || []).filter((m: any) => m.id !== meetingId.value)
  } catch {}
}

async function deletePastMeeting(id: string) {
  if (!confirm('Delete this meeting?')) return
  await $fetch('/api/meetings/delete', { method: 'POST', body: { meeting_id: id } })
  pastMeetings.value = pastMeetings.value.filter((m: any) => m.id !== id)
}

async function deleteMeeting() {
  if (!confirm('Delete this entire meeting?')) return
  await $fetch('/api/meetings/delete', { method: 'POST', body: { meeting_id: meetingId.value } })
  sessionStorage.removeItem(`meeting:${workspaceId}`)
  navigateTo(`/workspace/${workspaceId}`)
}

async function useTranscriptForTask(meeting: any) {
  if (!meeting.transcript) return
  navigateTo(`/workspace/${workspaceId}?transcript=${encodeURIComponent(meeting.transcript)}&mtitle=${encodeURIComponent(meeting.title || 'Meeting')}`)
}

function openMeeting(m: any) {
  sessionStorage.setItem(`meeting:${workspaceId}`, m.id)
  navigateTo(`/workspace/${workspaceId}/meeting/room`)
}

// ── Bot join ──────────────────────────────────────────────────────────────────
function buildBotRoomUrl(): string {
  if (selectedPlatform.value === 'zoom' && botJoinMethod.value === 'id') {
    const rawId = botZoomId.value.replace(/\s+/g, '').replace(/-/g, '')
    const pwd   = botZoomPwd.value.trim()
    return `https://zoom.us/j/${rawId}${pwd ? `?pwd=${encodeURIComponent(pwd)}` : ''}`
  }
  return botMeetingUrl.value.trim()
}

async function joinWithBot() {
  botNameTouched.value = true
  const roomUrl = buildBotRoomUrl()
  if (!roomUrl || !botName.value.trim()) return
  botJoining.value = true
  try {
    const result = await $fetch<any>('/api/bot/join', {
      method: 'POST',
      body: {
        room_url:      roomUrl,
        workspace_id:  workspaceId,
        meeting_id:    meetingId.value,
        bot_name:      botName.value.trim(),
        response_mode: botResponseMode.value,
        instructions:  botInstructions.value.trim() || undefined,
      }
    })
    botSession.value = {
      session_id: result.session_id,
      platform:   selectedPlatformMeta.value?.name,
      botName:    botName.value.trim(),
      status:     'starting',
      transcript: [],
      speaking:   false,
    }
    startBotPolling(result.session_id)
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to join. Make sure the bot server is running.')
  } finally {
    botJoining.value = false
  }
}

let botPollInterval: any = null
function startBotPolling(sessionId: string) {
  if (botPollInterval) clearInterval(botPollInterval)
  botPollInterval = setInterval(async () => {
    try {
      // ✅ Use ?id= (not ?session_id=) — matches server/api/bot/status.get.ts
      const status = await $fetch<any>(`/api/bot/status?id=${sessionId}`)
      if (botSession.value) {
        botSession.value.status     = status.status
        botSession.value.transcript = status.transcript || []
        botSession.value.speaking   = status.speaking
      }
      if (status.status === 'stopped' || status.status === 'error') {
        clearInterval(botPollInterval)
        // Save bot transcript back into this meeting's record
        if (status.transcript?.length && meetingId.value) {
          const plainText = status.transcript
            .map((e: any) => `[${e.role === 'bot' ? 'Bot' : 'Meeting'}] ${e.text}`)
            .join('\n')
          $fetch('/api/meetings/end', {
            method: 'POST',
            body: {
              meeting_id:     meetingId.value,
              transcript:     (fullTranscript.value ? fullTranscript.value + '\n\n--- Bot transcript ---\n' : '') + plainText,
              bot_session_id: sessionId,
              bot_platform:   selectedPlatformMeta.value?.name,
              bot_transcript: JSON.stringify(status.transcript),
            }
          }).catch(() => {})
        }
      }
    } catch {}
  }, 2000)
}

async function leaveBotCall() {
  clearInterval(botPollInterval)
  const sessionId = botSession.value?.session_id
  if (sessionId) {
    await $fetch('/api/bot/leave', { method: 'POST', body: { session_id: sessionId } }).catch(() => {})
    // Save transcript if any
    if (botSession.value?.transcript?.length && meetingId.value) {
      const plainText = botSession.value.transcript
        .map((e: any) => `[${e.role === 'bot' ? 'Bot' : 'Meeting'}] ${e.text}`)
        .join('\n')
      await $fetch('/api/meetings/end', {
        method: 'POST',
        body: {
          meeting_id:     meetingId.value,
          transcript:     plainText,
          bot_session_id: sessionId,
          bot_platform:   selectedPlatformMeta.value?.name,
          bot_transcript: JSON.stringify(botSession.value.transcript),
        }
      }).catch(() => {})
    }
  }
  botSession.value = null
}

onUnmounted(() => { clearInterval(botPollInterval) })
</script>


<style scoped>
.meeting-room { height: 100vh; overflow: hidden; display: flex; flex-direction: column; background: var(--bg); }

/* ── Header ── */
.meeting-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 20px; background: var(--surface); border-bottom: 1px solid var(--border); flex-shrink: 0; gap: 12px; }
.header-left  { display: flex; align-items: center; gap: 10px; min-width: 0; }
.header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.back-link { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-3); text-decoration: none; flex-shrink: 0; transition: color .13s; }
.back-link:hover { color: var(--text-1); }

/* Editable header title */
.title-wrap { min-width: 0; }
.title-btn { display: flex; align-items: center; gap: 6px; font-size: 15px; font-weight: 500; color: var(--text-1); background: none; border: none; cursor: pointer; padding: 3px 6px; border-radius: 6px; transition: background .13s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px; }
.title-btn:hover { background: var(--surface-2); }
.title-btn svg { color: var(--text-3); flex-shrink: 0; opacity: 0; transition: opacity .13s; }
.title-btn:hover svg { opacity: 1; }
.title-edit-input { font-size: 15px; font-weight: 500; color: var(--text-1); background: var(--surface-2); border: 1.5px solid var(--accent-border); border-radius: 6px; padding: 3px 8px; outline: none; width: 220px; font-family: inherit; }

.live-badge   { font-size: 11px; font-weight: 600; color: var(--red-text); background: var(--red-soft); padding: 2px 8px; border-radius: 20px; flex-shrink: 0; }
.paused-badge { font-size: 11px; color: var(--amber-text); background: var(--amber-soft); padding: 2px 8px; border-radius: 20px; flex-shrink: 0; }
.btn-record   { display: flex; align-items: center; gap: 7px; padding: 7px 16px; background: var(--accent); color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: background .13s; }
.btn-record:hover { background: var(--accent-hover); }
.rec-dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; animation: blink 1.2s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.btn-secondary { padding: 7px 14px; background: var(--surface-2); color: var(--text-1); border: 1px solid var(--border); border-radius: 7px; cursor: pointer; font-size: 13px; }
.btn-danger    { padding: 7px 14px; background: var(--red-soft); color: var(--red-text); border: none; border-radius: 7px; cursor: pointer; font-size: 13px; font-weight: 500; }

/* ── Tab bar ── */
.tab-bar { display: flex; background: var(--surface); border-bottom: 1px solid var(--border); padding: 0 16px; flex-shrink: 0; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 10px 16px; font-size: 13px; background: none; border: none; border-bottom: 2px solid transparent; color: var(--text-3); cursor: pointer; transition: all .13s; margin-bottom: -1px; font-family: inherit; }
.tab-btn:hover { color: var(--text-1); }
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 500; }

/* ── Body ── */
.meeting-body { flex: 1; overflow-y: auto; display: flex; flex-direction: column; position: relative; min-height: 0; }

/* Live tab */
.live-grid { display: grid; grid-template-columns: 1fr 1.1fr; flex: 1; overflow: hidden; gap: 1px; background: var(--border); height: 100%; }
.panel { display: flex; flex-direction: column; background: var(--surface); overflow: hidden; }
.panel-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text-3); padding: 12px 16px 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between; }
.panel-actions { display: flex; gap: 8px; }
.upload-link { font-size: 11px; font-weight: 500; color: var(--accent); cursor: pointer; text-transform: none; letter-spacing: 0; }
.upload-link input { display: none; }
.panel-scroll { flex: 1; overflow-y: auto; padding: 12px 16px; }
.chat-scroll  { display: flex; flex-direction: column; gap: 12px; }
.empty-hint { display: flex; flex-direction: row; align-items: center; gap: 12px; color: var(--text-3); padding: 24px 0; }
.empty-hint svg { flex-shrink: 0; color: var(--text-3); opacity: .5; }
.empty-hint span { font-size: 13px; line-height: 1.5; font-style: italic; }
.transcript-text { font-size: 14px; line-height: 1.85; color: var(--text-1); margin: 0; }
.interim { color: var(--text-3); }
.upload-bar { font-size: 12px; padding: 6px 16px; background: var(--green-soft); color: var(--green-text); flex-shrink: 0; }
.upload-bar.error { background: var(--red-soft); color: var(--red-text); }
.error-banner { font-size: 12px; color: var(--red-text); padding: 6px 16px 0; margin: 0; }
.msg { display: flex; flex-direction: column; gap: 3px; }
.msg.human { align-items: flex-end; }
.msg.agent  { align-items: flex-start; }
.msg-meta   { display: flex; gap: 6px; align-items: center; }
.msg-sender { font-size: 11px; font-weight: 600; color: var(--text-3); }
.msg-sender.research { color: #3b82f6; }
.msg-sender.writer   { color: #10b981; }
.msg-sender.analyst  { color: #8b5cf6; }
.msg-sender.executor { color: #f59e0b; }
.msg-time   { font-size: 10px; color: var(--text-3); }
.msg-body   { font-size: 13px; line-height: 1.5; padding: 8px 12px; border-radius: 10px; max-width: 86%; white-space: pre-wrap; }
.human .msg-body { background: var(--accent); color: #fff; border-radius: 10px 10px 2px 10px; }
.agent .msg-body  { background: var(--surface-2); color: var(--text-1); border-radius: 10px 10px 10px 2px; }
.tasks-section { flex-shrink: 0; border-top: 1px solid var(--border-soft); padding: 10px 16px; }
.tasks-label   { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text-3); margin-bottom: 8px; }
.tasks-grid    { display: flex; flex-direction: column; gap: 5px; margin-bottom: 8px; }
.task-chip     { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: var(--surface-2); border-radius: 7px; border: 1px solid var(--border-soft); }
.task-chip-title  { font-size: 12px; color: var(--text-1); font-weight: 500; }
.task-chip-status { font-size: 10px; padding: 2px 7px; border-radius: 4px; background: var(--accent-soft); color: var(--accent); }
.task-chip-status.completed { background: var(--green-soft); color: var(--green-text); }
.go-to-workspace-link { font-size: 12px; color: var(--accent); text-decoration: none; display: block; }
.go-to-workspace-link:hover { text-decoration: underline; }
.ended-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10; }
.ended-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; text-align: center; display: flex; flex-direction: column; gap: 12px; box-shadow: var(--shadow-lg); }
.ended-icon { font-size: 32px; }
.ended-card h3 { font-size: 18px; font-weight: 600; color: var(--text-1); }
.ended-card p  { font-size: 14px; color: var(--text-2); }

/* ── Bot tab ── */
.bot-tab { padding: 24px; max-width: 680px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 20px; padding-bottom: 40px; }
.bot-intro { display: flex; gap: 16px; align-items: flex-start; padding: 18px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.bot-intro-icon { width: 44px; height: 44px; border-radius: 10px; background: var(--accent-soft); border: 1px solid var(--accent-border); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
.bot-intro h3 { font-size: 15px; font-weight: 600; color: var(--text-1); margin-bottom: 6px; }
.bot-intro p  { font-size: 13px; color: var(--text-2); line-height: 1.6; }
.platform-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.platform-btn { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); cursor: pointer; transition: all .13s; position: relative; font-family: inherit; }
.platform-btn:hover  { border-color: var(--accent); }
.platform-btn.selected { border-color: var(--accent); background: var(--accent-soft); }
.plat-logo { width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.platform-btn span { font-size: 13px; font-weight: 500; color: var(--text-1); }
.plat-check { position: absolute; top: 8px; right: 8px; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; color: #fff; }
.bot-form { display: flex; flex-direction: column; gap: 14px; }
.bot-form-field { display: flex; flex-direction: column; gap: 5px; }
.bot-form-field label { font-size: 12px; font-weight: 500; color: var(--text-2); }
.field-opt { font-weight: 400; color: var(--text-3); }
.field-required { color: var(--red-text, #ef4444); }
.field-error-msg { font-size: 11px; color: var(--red-text, #ef4444); margin-top: 2px; }
.field-hint { font-size: 11px; color: var(--text-3); line-height: 1.5; margin-top: 2px; }
.input-error { border-color: var(--red-text, #ef4444) !important; }
/* Bot mode tabs (Join now / Schedule) */
.bot-mode-tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); margin-bottom: 4px; }
.bot-mode-tab { display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 13px; font-weight: 500; color: var(--text-3); background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-family: inherit; transition: color .13s, border-color .13s; margin-bottom: -1px; }
.bot-mode-tab:hover { color: var(--text-1); }
.bot-mode-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

/* Schedule time row */
.sched-time-row { display: grid; grid-template-columns: 1fr 1fr 1.4fr; gap: 10px; }

/* Scheduled list */
.sched-list { display: flex; flex-direction: column; gap: 8px; }
.sched-list-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text-3); }
.sched-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm, 8px); gap: 12px; }
.sched-row-main { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; flex-wrap: wrap; }
.sched-row-time { font-size: 13px; font-weight: 500; color: var(--text-1); white-space: nowrap; }
.sched-row-url { font-size: 12px; color: var(--text-3); font-family: var(--mono, monospace); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
.sched-status-badge { font-size: 10px; padding: 2px 7px; border-radius: 99px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
.sched-status-badge.pending { background: var(--amber-soft, #fef3c7); color: var(--amber-text, #92400e); }
.sched-status-badge.running { background: var(--accent-soft); color: var(--accent); }
.sched-status-badge.done    { background: var(--green-soft); color: var(--green-text); }
.sched-status-badge.failed  { background: var(--red-soft); color: var(--red-text); }
.sched-cancel-btn { font-size: 12px; padding: 4px 10px; color: var(--red-text); background: var(--red-soft); border: 1px solid #fca5a5; border-radius: 6px; cursor: pointer; font-family: inherit; white-space: nowrap; }
.sched-cancel-btn:hover { background: #fecaca; }

/* Join notice (reused in schedule tab) */
.join-notice { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: var(--text-3); line-height: 1.5; padding: 10px 12px; background: var(--surface-2); border-radius: var(--radius-sm, 8px); }
.join-method-toggle button { flex: 1; padding: 7px 12px; font-size: 12px; font-weight: 500; color: var(--text-3); background: transparent; border: none; cursor: pointer; font-family: inherit; transition: background .13s, color .13s; }
.join-method-toggle button.active { background: var(--accent); color: #fff; }
.join-method-toggle button:not(.active):hover { background: var(--surface-2); color: var(--text-1); }
/* Instructions */
.instructions-toggle { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 500; color: var(--text-3); cursor: pointer; padding: 2px 0; user-select: none; transition: color .13s; }
.instructions-toggle:hover { color: var(--text-1); }
.instructions-badge { font-size: 10px; padding: 1px 7px; border-radius: 99px; background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-border); }
.instructions-hint { font-size: 11px; color: var(--text-3); font-weight: 400; font-style: italic; }
.instructions-textarea { resize: vertical; min-height: 88px; line-height: 1.6; font-family: inherit; }
.bot-join-btn { display: flex; align-items: center; gap: 8px; justify-content: center; padding: 11px; }
.bot-session { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.bot-session-bar { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--border-soft); }
.bot-live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse-dot 2s infinite; }
.bot-live-dot.starting { background: var(--amber, #f59e0b); }
.bot-live-dot.error, .bot-live-dot.stopped { background: var(--text-3); animation: none; }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
.bot-session-name   { font-size: 13px; font-weight: 500; color: var(--text-1); flex: 1; }
.bot-session-status { font-size: 11px; color: var(--text-3); }
.bot-transcript { padding: 12px 16px; display: flex; flex-direction: column; gap: 12px; max-height: 300px; overflow-y: auto; }
.bot-entry { display: flex; flex-direction: column; gap: 4px; }
.bot-entry-meta { display: flex; align-items: center; gap: 8px; }
.bot-entry-role { font-size: 10px; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: .05em; }
.bot-entry.bot .bot-entry-role { color: var(--accent); }
.bot-entry-time { font-size: 10px; color: var(--text-3); }
.bot-entry-text { font-size: 13px; color: var(--text-1); line-height: 1.5; padding: 6px 10px; border-radius: 7px; }
.bot-entry.human .bot-entry-text { background: var(--surface-2); }
.bot-entry.bot   .bot-entry-text { background: var(--accent-soft); border-left: 3px solid var(--accent); }
.bot-note { display: flex; align-items: flex-start; gap: 8px; padding: 12px 14px; background: var(--amber-soft); border: 1px solid var(--amber-border, #fde68a); border-radius: var(--radius); font-size: 12px; color: var(--amber-text); line-height: 1.5; }
.bot-note svg { flex-shrink: 0; margin-top: 1px; }
/* Speaking wave */
.wave-inline { display: flex; gap: 2px; align-items: center; }
.wave-inline span { display: block; width: 3px; border-radius: 2px; background: var(--accent); animation: wave 1.2s infinite ease-in-out; }
.wave-inline span:nth-child(1){ height:6px }.wave-inline span:nth-child(2){ height:12px;animation-delay:.1s }.wave-inline span:nth-child(3){ height:8px;animation-delay:.2s }
@keyframes wave { 0%,100%{transform:scaleY(.5)} 50%{transform:scaleY(1)} }

/* ── History tab — unified list ── */
.history-tab {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.history-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 60px 0; color: var(--text-3); font-size: 13px; font-style: italic;
}

/* Full-bleed list — no outer card, fills the tab completely */
.history-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-top: 1px solid var(--border);
}

/* Column header */
.history-list-header {
  display: grid;
  grid-template-columns: 1fr 150px 90px 300px;
  align-items: center;
  padding: 7px 20px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: var(--text-3);
  position: sticky;
  top: 0;
  z-index: 1;
}

/* Each meeting row */
.history-row-main {
  display: grid;
  grid-template-columns: 1fr 150px 90px 300px;
  align-items: center;
  padding: 0 20px;
  min-height: 46px;
  cursor: pointer;
  transition: background .1s;
}
.history-row-main:hover { background: var(--surface-2); }

/* Title cell */
.hcol-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 10px 16px 10px 0;
}
.history-row-open {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-1);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: inherit;
  flex-shrink: 1;
  min-width: 0;
  transition: color .13s;
}
.history-row-main:hover .history-row-open { color: var(--accent); }

/* Always-visible Edit button with text */
.history-edit-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background .13s, color .13s, border-color .13s;
}
.history-edit-btn:hover { background: var(--surface-2); color: var(--accent); border-color: var(--accent-border); }

.history-title-input {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-1);
  background: var(--surface-2);
  border: 1.5px solid var(--accent-border);
  border-radius: 5px;
  padding: 3px 8px;
  outline: none;
  flex: 1;
  min-width: 0;
  font-family: inherit;
}

/* Other columns */
.hcol-date {
  font-size: 12px;
  color: var(--text-3);
  white-space: nowrap;
}
.hcol-tasks { display: flex; align-items: center; }
.task-pill {
  font-size: 11px;
  color: var(--green-text);
  background: var(--green-soft);
  padding: 2px 8px;
  border-radius: 99px;
  white-space: nowrap;
}
.task-pill-empty { font-size: 12px; color: var(--text-3); }

/* Always-visible actions column */
.hcol-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.hrow-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 4px 10px;
  font-size: 12px; font-weight: 500;
  color: var(--text-2);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer; font-family: inherit;
  white-space: nowrap;
  transition: background .13s, color .13s, border-color .13s;
}
.hrow-btn:hover { background: var(--surface-2); color: var(--text-1); border-color: var(--text-3); }
.hrow-btn.active { background: var(--accent-soft); color: var(--accent); border-color: var(--accent-border); }

.hrow-icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-3);
  cursor: pointer; border-radius: 6px; padding: 0;
  transition: background .13s, color .13s, border-color .13s;
}
.hrow-icon-btn:hover { background: var(--red-soft); color: var(--red-text); border-color: #fca5a5; }

/* Transcript expand — full width, no indent */
.history-transcript {
  padding: 14px 20px;
  font-size: 13px; line-height: 1.75; color: var(--text-2);
  border-top: 1px solid var(--border-soft, var(--border));
  background: var(--surface-2);
  max-height: 220px; overflow-y: auto; white-space: pre-wrap;
}

/* Row divider */
.history-divider { height: 1px; background: var(--border-soft, var(--border)); }

.btn-sm { font-size: 11px; padding: 4px 10px; }
.btn-icon { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border: none; background: transparent; color: var(--text-3); cursor: pointer; border-radius: 5px; padding: 0; transition: background .13s, color .13s; }
.btn-icon:hover { background: var(--red-soft); color: var(--red-text); }

/* ── Share / Record Modal ── */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.5);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 900;
}
.share-modal {
  width: 460px;
  max-width: calc(100vw - 32px);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 32px 80px rgba(0,0,0,.55);
  display: flex; flex-direction: column;
  overflow: hidden;
}

.share-modal-header {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 18px 20px 16px;
  border-bottom: 1px solid var(--border-soft, var(--border));
}
.share-modal-icon {
  width: 34px; height: 34px; border-radius: 8px;
  background: var(--accent-soft); border: 1px solid var(--accent-border);
  color: var(--accent);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.share-modal-title { font-size: 14px; font-weight: 600; color: var(--text-1); margin: 0 0 2px; }
.share-modal-sub   { font-size: 12px; color: var(--text-3); margin: 0; }
.share-modal-close {
  margin-left: auto; width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent; color: var(--text-3);
  cursor: pointer; border-radius: 6px;
  transition: background .13s, color .13s;
}
.share-modal-close:hover { background: var(--surface-2); color: var(--text-1); }

.share-modal-body { display: flex; flex-direction: column; }

/* Source tabs */
.share-tabs {
  display: flex; gap: 0;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-soft, var(--border));
}
.share-tab {
  padding: 9px 14px;
  font-size: 12px; font-weight: 500;
  color: var(--text-3);
  background: transparent; border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer; font-family: inherit;
  transition: color .13s, border-color .13s;
  margin-bottom: -1px;
}
.share-tab:hover { color: var(--text-1); }
.share-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

/* Source items */
.share-tab-content { padding: 8px 10px; max-height: 200px; overflow-y: auto; }
.share-items { display: flex; flex-direction: column; gap: 2px; }
.share-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 8px;
  cursor: pointer; border: 1px solid transparent;
  transition: background .12s;
}
.share-item:hover { background: var(--surface-2); }
.share-item.selected { background: var(--accent-soft); border-color: var(--accent-border); }
.share-item-icon {
  width: 26px; height: 26px;
  background: var(--surface-2); border: 1px solid var(--border-soft, var(--border));
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-3); flex-shrink: 0;
}
.share-item.selected .share-item-icon { background: var(--accent-soft); border-color: var(--accent-border); color: var(--accent); }
.share-item-name { flex: 1; font-size: 13px; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.share-item-check {
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--accent); color: #fff;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

/* Options */
.share-options {
  border-top: 1px solid var(--border-soft, var(--border));
}
.share-option-row {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 12px 16px;
}
.share-option-row + .share-option-row { border-top: 1px solid var(--border-soft, var(--border)); }
.share-option-info { display: flex; align-items: flex-start; gap: 10px; color: var(--text-3); flex: 1; min-width: 0; }
.share-option-info svg { margin-top: 2px; flex-shrink: 0; }
.share-option-label { display: block; font-size: 13px; font-weight: 500; color: var(--text-1); }
.share-option-desc  { display: block; font-size: 11px; color: var(--text-3); margin-top: 1px; }

/* Toggle */
.toggle {
  width: 34px; height: 19px; border-radius: 99px;
  border: none; background: var(--border);
  cursor: pointer; position: relative;
  transition: background .2s; flex-shrink: 0; padding: 0;
}
.toggle.on { background: var(--accent); }
.toggle-knob {
  position: absolute; top: 2.5px; left: 2.5px;
  width: 14px; height: 14px; border-radius: 50%;
  background: #fff; transition: transform .2s; display: block;
  box-shadow: 0 1px 3px rgba(0,0,0,.25);
}
.toggle.on .toggle-knob { transform: translateX(15px); }

/* Footer */
.share-modal-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 8px;
  padding: 14px 16px;
  border-top: 1px solid var(--border-soft, var(--border));
}
.btn-cancel-modal {
  padding: 7px 16px; font-size: 13px; font-weight: 500;
  color: var(--text-2); background: transparent;
  border: 1px solid var(--border); border-radius: 8px;
  cursor: pointer; font-family: inherit;
  transition: background .13s, color .13s;
}
.btn-cancel-modal:hover { background: var(--surface-2); color: var(--text-1); }
.btn-start-rec {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 18px; font-size: 13px; font-weight: 500;
  color: #fff; background: var(--accent);
  border: none; border-radius: 8px;
  cursor: pointer; font-family: inherit;
  transition: background .13s, opacity .13s;
}
.btn-start-rec:not(:disabled):hover { background: var(--accent-hover); }
.btn-start-rec:disabled { opacity: .4; cursor: not-allowed; }
.rec-dot-sm {
  width: 7px; height: 7px; border-radius: 50%;
  background: #fff; flex-shrink: 0;
  animation: blink 1.2s infinite;
}

/* Shared utils */
.input { padding: 8px 12px; border: 1.5px solid var(--border); border-radius: 7px; font-size: 13px; font-family: inherit; background: var(--surface); color: var(--text-1); outline: none; width: 100%; }
.input:focus { border-color: var(--accent); }
.btn { padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: inherit; border: none; }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover:not(:disabled) { background: var(--accent-hover); }
.btn-primary:disabled { opacity: .4; cursor: not-allowed; }
.btn-ghost { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
.btn-ghost:hover { background: var(--surface-2); color: var(--text-1); }
.spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>