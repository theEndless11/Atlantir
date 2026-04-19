<template>
  <div class="page-shell vb-shell">
    <div class="page-header">
      <div>
        <h1>Voice Bot</h1>
        <p class="page-desc">
          Send an AI bot into a Google Meet or Zoom call. The bot listens to the conversation,
          understands questions directed at it, and responds in real time using your workspace
          knowledge base. It speaks back using ElevenLabs voice synthesis.
        </p>
      </div>
    </div>

    <!-- Active session -->
    <div v-if="activeSession" class="session-panel">
      <div class="session-bar">
        <div class="session-bar-left">
          <div class="live-dot" :class="activeSession.status" />
          <span class="session-platform">{{ platformLabel(activeSession.platform) }}</span>
          <span class="session-status-text">{{ statusLabel(activeSession.status) }}</span>
          <span class="session-since">since {{ formatTime(activeSession.started_at) }}</span>
          <div v-if="activeSession.speaking" class="wave-inline">
            <span/><span/><span/><span/><span/>
          </div>
          <span v-else-if="activeSession.status === 'listening'" class="pulse-inline" />
        </div>
        <button class="btn-leave" @click="leaveCall" :disabled="leaving">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {{ leaving ? 'Leaving…' : 'Leave call' }}
        </button>
      </div>

      <div v-if="activeSession.error" class="session-error">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        {{ activeSession.error }}
      </div>

      <div class="session-body">
        <div class="transcript-panel">
          <div class="panel-label">
            Live transcript
            <span class="entry-count">{{ activeSession.transcript?.length || 0 }} entries</span>
          </div>
          <div class="transcript-feed" ref="feedEl">
            <div v-if="!activeSession.transcript?.length" class="transcript-empty">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span>Waiting for conversation…<br>Bot responds when addressed by name or asked a question.</span>
            </div>
            <div
              v-for="(entry, i) in activeSession.transcript"
              :key="i"
              class="transcript-entry"
              :class="entry.role"
            >
              <div class="entry-meta">
                <span class="entry-role">{{ entry.role === 'bot' ? 'Bot' : 'Meeting' }}</span>
                <span class="entry-time">{{ formatLogTs(entry.ts) }}</span>
              </div>
              <div class="entry-text">{{ entry.text }}</div>
            </div>
          </div>
        </div>

        <div class="logs-panel" :class="{ collapsed: !showLogs }">
          <div class="panel-label logs-toggle" @click="showLogs = !showLogs">
            Debug logs
            <span class="entry-count">{{ activeSession.logs?.length || 0 }}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="{ transform: showLogs ? 'none' : 'rotate(-90deg)', transition: 'transform .2s' }"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div v-if="showLogs" class="logs-feed" ref="logsEl">
            <div v-if="!activeSession.logs?.length" class="logs-empty">No logs yet</div>
            <div v-for="(line, i) in activeSession.logs" :key="i" class="log-line" :class="line.level">
              <span class="log-ts">{{ formatLogTs(line.ts) }}</span>
              <span class="log-msg">{{ line.msg }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Join panel -->
    <div v-else class="join-panel">
      <div class="how-section">
        <div class="how-item">
          <div class="how-num">1</div>
          <div>
            <strong>Paste a meeting link</strong>
            <span>Google Meet or Zoom. The bot joins as a separate participant.</span>
          </div>
        </div>
        <div class="how-item">
          <div class="how-num">2</div>
          <div>
            <strong>Bot listens to the call</strong>
            <span>It transcribes the conversation in real time via Deepgram.</span>
          </div>
        </div>
        <div class="how-item">
          <div class="how-num">3</div>
          <div>
            <strong>Ask it anything</strong>
            <span>Say its name or ask a question — it responds out loud using your knowledge base.</span>
          </div>
        </div>
      </div>

      <div class="join-form">
        <!-- Tabs: Join Now / Schedule -->
        <div class="join-tabs">
          <button class="join-tab" :class="{ active: joinTab === 'now' }" @click="joinTab = 'now'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14"/><rect x="3" y="8" width="12" height="8" rx="2"/></svg>
            Join now
          </button>
          <button class="join-tab" :class="{ active: joinTab === 'schedule' }" @click="joinTab = 'schedule'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Schedule
          </button>
        </div>

        <!-- JOIN NOW -->
        <template v-if="joinTab === 'now'">
          <div class="field">
            <label>Meeting link</label>
            <input v-model="form.room_url" placeholder="https://meet.google.com/… or https://zoom.us/j/…" class="url-input" @paste.prevent="onPaste" />
            <span v-if="detectedPlatform" class="platform-detected">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              {{ detectedPlatform === 'meet' ? 'Google Meet detected' : 'Zoom detected' }}
            </span>
          </div>
          <div v-if="detectedPlatform === 'zoom'" class="field-row">
            <div class="field">
              <label>Meeting ID <span class="opt">(if not in URL)</span></label>
              <input v-model="form.zoom_meeting_id" placeholder="812 3456 7890" />
            </div>
            <div class="field">
              <label>Passcode <span class="opt">(if not in URL)</span></label>
              <input v-model="form.zoom_password" placeholder="abc123" type="password" />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Bot name <span class="opt">(shown in call)</span></label>
              <input v-model="form.bot_name" placeholder="Atlantir" />
            </div>
            <div class="field">
              <label>Response mode</label>
              <select v-model="form.response_mode">
                <option value="addressed">Respond when addressed</option>
                <option value="questions">Respond to all questions</option>
                <option value="always">Respond to everything</option>
              </select>
            </div>
          </div>
          <div class="instructions-toggle" @click="showInstructions = !showInstructions">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="{ transform: showInstructions ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }"><polyline points="9 18 15 12 9 6"/></svg>
            Bot instructions
            <span class="instructions-badge" v-if="form.instructions">custom</span>
            <span class="instructions-hint" v-else>tell the bot its purpose for this call</span>
          </div>
          <div v-if="showInstructions" class="instructions-field">
            <textarea v-model="form.instructions" class="instructions-textarea" placeholder="E.g. You are joining a sales discovery call. Listen for pain points and budget signals. Answer pricing questions from our knowledge base. Be concise." rows="4" />
            <div class="instructions-sub">Overrides workspace default for this session only. Set a permanent default in <NuxtLink :to="`/workspace/${workspaceId}/settings`">Settings</NuxtLink>.</div>
          </div>
          <div v-if="joining" class="joining-progress">
            <div class="joining-bar"><div class="joining-fill" :style="{ width: joiningProgress + '%' }" /></div>
            <span class="joining-hint">{{ joiningHint }}</span>
          </div>
          <div class="join-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            The bot joins as a visible participant. For Zoom, the host must allow early join or be present to admit it.
          </div>
          <button class="btn-join" :disabled="!canJoin || joining" @click="joinCall">
            <svg v-if="!joining" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.894L15 14"/><rect x="3" y="8" width="12" height="8" rx="2"/></svg>
            <div v-else class="btn-spinner" />
            {{ joining ? joiningHint : 'Send bot into call' }}
          </button>
        </template>

        <!-- SCHEDULE -->
        <template v-else>
          <div class="field">
            <label>Meeting link</label>
            <input v-model="sched.room_url" placeholder="https://zoom.us/j/… or meet.google.com/…" class="url-input" />
            <span v-if="schedDetectedPlatform" class="platform-detected">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              {{ schedDetectedPlatform === 'meet' ? 'Google Meet' : 'Zoom' }} detected
            </span>
          </div>
          <div v-if="schedDetectedPlatform === 'zoom'" class="field-row">
            <div class="field">
              <label>Meeting ID <span class="opt">(if not in URL)</span></label>
              <input v-model="sched.zoom_meeting_id" placeholder="812 3456 7890" />
            </div>
            <div class="field">
              <label>Passcode <span class="opt">(if not in URL)</span></label>
              <input v-model="sched.zoom_password" placeholder="abc123" type="password" />
            </div>
          </div>
          <div class="field-row sched-time-row">
            <div class="field">
              <label>Date</label>
              <input v-model="sched.date" type="date" :min="todayStr" class="input-field" />
            </div>
            <div class="field">
              <label>Time</label>
              <input v-model="sched.time" type="time" class="input-field" />
            </div>
            <div class="field">
              <label>Timezone</label>
              <select v-model="sched.timezone" class="input-field">
                <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">{{ tz.label }}</option>
              </select>
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Bot name</label>
              <input v-model="sched.bot_name" placeholder="Atlantir" />
            </div>
            <div class="field">
              <label>Response mode</label>
              <select v-model="sched.response_mode">
                <option value="addressed">Respond when addressed</option>
                <option value="questions">Respond to all questions</option>
                <option value="always">Respond to everything</option>
              </select>
            </div>
          </div>
          <div class="instructions-toggle" @click="showSchedInstructions = !showSchedInstructions">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="{ transform: showSchedInstructions ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }"><polyline points="9 18 15 12 9 6"/></svg>
            Bot instructions
            <span class="instructions-badge" v-if="sched.instructions">custom</span>
            <span class="instructions-hint" v-else>optional purpose for this call</span>
          </div>
          <div v-if="showSchedInstructions" class="instructions-field">
            <textarea v-model="sched.instructions" class="instructions-textarea" placeholder="E.g. You are joining our weekly standup. Listen and summarise action items." rows="3" />
          </div>
          <div class="join-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            The bot will join automatically at the scheduled time. Your browser doesn't need to be open — the server handles it.
          </div>
          <button class="btn-join" :disabled="!canSchedule || scheduling" @click="scheduleBot">
            <svg v-if="!scheduling" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <div v-else class="btn-spinner" />
            {{ scheduling ? 'Scheduling…' : 'Schedule bot' }}
          </button>
        </template>
      </div>

      <!-- Scheduled meetings list -->
      <div v-if="scheduledBots.length" class="past-section">
        <div class="past-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          Scheduled meetings
        </div>
        <div class="past-list">
          <div v-for="s in scheduledBots" :key="s.id" class="past-card">
            <div class="past-card-main">
              <div class="past-title-row">
                <span class="past-title">{{ formatScheduledTime(s) }}</span>
                <span class="sched-status-badge" :class="s.status">{{ s.status }}</span>
              </div>
              <div class="past-meta-row">
                <span class="past-platform-badge">{{ platformLabel(s.platform) }}</span>
                <span class="past-dot">·</span>
                <span class="past-time">{{ truncateUrl(s.room_url) }}</span>
                <span class="past-dot">·</span>
                <span class="past-time">{{ s.bot_name || 'Atlantir' }}</span>
              </div>
            </div>
            <div class="past-card-actions">
              <button v-if="s.status === 'pending'" class="past-action-btn danger" @click="deleteScheduled(s.id)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Past meetings -->
      <div v-if="pastSessions.length" class="past-section">
        <div class="past-label">Recent sessions</div>
        <div class="past-list">
          <div v-for="s in pastSessions" :key="s.session_id" class="past-card">
            <div class="past-card-main">
              <!-- Editable title -->
              <div class="past-title-row">
                <template v-if="editingId === s.session_id">
                  <input
                    class="past-title-input"
                    v-model="editingTitle"
                    @keydown.enter="commitTitle(s)"
                    @keydown.escape="cancelEdit"
                    @blur="commitTitle(s)"
                    ref="titleInputRef"
                    maxlength="80"
                  />
                </template>
                <template v-else>
                  <span class="past-title" @dblclick="startEdit(s)">{{ s.title || 'New meeting' }}</span>
                  <button class="past-edit-btn" @click="startEdit(s)" title="Rename">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </template>
              </div>
              <div class="past-meta-row">
                <span class="past-platform-badge">{{ platformLabel(s.platform) }}</span>
                <span class="past-dot">·</span>
                <span class="past-time">{{ formatTime(s.started_at) }}</span>
                <span class="past-dot">·</span>
                <span class="past-status" :class="s.status">{{ s.status }}</span>
              </div>
            </div>
            <div class="past-card-actions">
              <button v-if="s.transcript?.length" class="past-action-btn" @click="viewTranscript(s)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Transcript
              </button>
              <button class="past-action-btn danger" @click="deleteSession(s)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Share / Record Modal -->
    <Teleport to="body">
      <div v-if="showShareModal" class="modal-backdrop" @click.self="showShareModal = false">
        <div class="share-modal">
          <div class="share-modal-header">
            <div class="share-modal-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </div>
            <div>
              <h3 class="share-modal-title">Share & Record</h3>
              <p class="share-modal-sub">Choose what to capture for this session</p>
            </div>
            <button class="share-modal-close" @click="showShareModal = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="share-modal-body">
            <!-- Source tabs -->
            <div class="share-tabs">
              <button
                v-for="tab in shareTabs"
                :key="tab.id"
                class="share-tab"
                :class="{ active: shareTab === tab.id }"
                @click="shareTab = tab.id"
              >{{ tab.label }}</button>
            </div>

            <!-- Tab content -->
            <div class="share-tab-content">
              <!-- Browser Tab -->
              <div v-if="shareTab === 'tab'" class="share-items">
                <div
                  v-for="t in browserTabs"
                  :key="t.id"
                  class="share-item"
                  :class="{ selected: selectedSource?.id === t.id }"
                  @click="selectedSource = t"
                >
                  <div class="share-item-favicon">
                    <img v-if="t.favicon" :src="t.favicon" width="16" height="16" />
                    <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
                  </div>
                  <span class="share-item-name">{{ t.name }}</span>
                  <div v-if="selectedSource?.id === t.id" class="share-item-check">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>

              <!-- Window -->
              <div v-else-if="shareTab === 'window'" class="share-items">
                <div
                  v-for="w in windows"
                  :key="w.id"
                  class="share-item"
                  :class="{ selected: selectedSource?.id === w.id }"
                  @click="selectedSource = w"
                >
                  <div class="share-item-preview">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <span class="share-item-name">{{ w.name }}</span>
                  <div v-if="selectedSource?.id === w.id" class="share-item-check">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>

              <!-- Entire Screen -->
              <div v-else-if="shareTab === 'screen'" class="share-items">
                <div
                  class="share-item"
                  :class="{ selected: selectedSource?.id === 'screen-1' }"
                  @click="selectedSource = { id: 'screen-1', name: 'Entire Screen' }"
                >
                  <div class="share-item-preview">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </div>
                  <span class="share-item-name">Entire Screen</span>
                  <div v-if="selectedSource?.id === 'screen-1'" class="share-item-check">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Audio & options -->
            <div class="share-options">
              <div class="share-option-row">
                <div class="share-option-info">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <div>
                    <span class="share-option-label">Share audio</span>
                    <span class="share-option-desc">Capture system audio from the selected source</span>
                  </div>
                </div>
                <button class="toggle" :class="{ on: shareAudio }" @click="shareAudio = !shareAudio">
                  <span class="toggle-knob" />
                </button>
              </div>

              <div class="share-option-row">
                <div class="share-option-info">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                  <div>
                    <span class="share-option-label">Auto-record</span>
                    <span class="share-option-desc">Save a recording when the session ends</span>
                  </div>
                </div>
                <button class="toggle" :class="{ on: autoRecord }" @click="autoRecord = !autoRecord">
                  <span class="toggle-knob" />
                </button>
              </div>
            </div>
          </div>

          <div class="share-modal-footer">
            <button class="btn-cancel" @click="showShareModal = false">Cancel</button>
            <button class="btn-share" :disabled="!selectedSource" @click="confirmShare">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Transcript viewer modal -->
    <Teleport to="body">
      <div v-if="transcriptSession" class="modal-backdrop" @click.self="transcriptSession = null">
        <div class="transcript-modal">
          <div class="share-modal-header">
            <div>
              <h3 class="share-modal-title">{{ transcriptSession.title || 'Session transcript' }}</h3>
              <p class="share-modal-sub">{{ platformLabel(transcriptSession.platform) }} · {{ formatTime(transcriptSession.started_at) }}</p>
            </div>
            <button class="share-modal-close" @click="transcriptSession = null">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="transcript-modal-body">
            <div v-for="(entry, i) in transcriptSession.transcript" :key="i" class="transcript-entry" :class="entry.role">
              <div class="entry-meta">
                <span class="entry-role">{{ entry.role === 'bot' ? 'Bot' : 'Meeting' }}</span>
                <span class="entry-time">{{ formatLogTs(entry.ts) }}</span>
              </div>
              <div class="entry-text">{{ entry.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Error toast -->
    <div v-if="error" class="toast error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })

const route = useRoute()
const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string

const STORAGE_KEY = `vb_session_${workspaceId}`

const JOIN_REQUEST_TIMEOUT_MS = 10_000
const JOIN_POLL_MAX_WAIT_MS   = 90_000

const form = ref({ room_url: '', bot_name: 'Atlantir', response_mode: 'addressed', zoom_meeting_id: '', zoom_password: '', instructions: '' })
const activeSession = ref<any>(null)
const pastSessions = ref<any[]>([])
const transcriptSession = ref<any>(null)

// Join tab state
const joinTab             = ref<'now' | 'schedule'>('now')
const showInstructions    = ref(false)
const showSchedInstructions = ref(false)

// Schedule form
const todayStr = new Date().toISOString().slice(0, 10)
const sched = ref({
  room_url: '', zoom_meeting_id: '', zoom_password: '',
  date: todayStr, time: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  bot_name: 'Atlantir', response_mode: 'addressed', instructions: '',
})
const scheduling    = ref(false)
const scheduledBots = ref<any[]>([])
const joining = ref(false)
const leaving = ref(false)
const error = ref('')
const feedEl = ref<HTMLElement>()
const showLogs = ref(false)
const logsEl = ref<HTMLElement>()

// Editing
const editingId = ref<string | null>(null)
const editingTitle = ref('')
const titleInputRef = ref<HTMLInputElement | null>(null)

// Share modal
const showShareModal = ref(false)
const shareTab = ref<'tab' | 'window' | 'screen'>('tab')
const shareAudio = ref(true)
const autoRecord = ref(false)
const selectedSource = ref<{ id: string; name: string } | null>(null)

const shareTabs = [
  { id: 'tab', label: 'Browser Tab' },
  { id: 'window', label: 'Window' },
  { id: 'screen', label: 'Entire Screen' },
] as const

// Mock browser tab/window data — replace with real getDisplayMedia sources
const browserTabs = ref([
  { id: 'tab-1', name: 'Meeting Room — Atlantir', favicon: '' },
  { id: 'tab-2', name: 'Greeting - Claude', favicon: '' },
  { id: 'tab-3', name: 'ChatGPT', favicon: '' },
])
const windows = ref([
  { id: 'win-1', name: 'Microsoft Edge' },
  { id: 'win-2', name: 'Slack' },
])

function openShareModal() {
  selectedSource.value = null
  shareTab.value = 'tab'
  showShareModal.value = true
}

function confirmShare() {
  if (!selectedSource.value) return
  // Wire up real getDisplayMedia here
  showShareModal.value = false
}

// Joining progress
const joiningProgress = ref(0)
const joiningHint = ref('Launching browser…')
let joiningTimer: ReturnType<typeof setInterval> | null = null

let pollInterval: ReturnType<typeof setInterval> | null = null
let pollFailures = 0

const schedDetectedPlatform = computed(() => {
  const url = sched.value.room_url
  if (url.includes('meet.google.com')) return 'meet'
  if (url.includes('zoom.us') || url.includes('zoom.com')) return 'zoom'
  if (!url && sched.value.zoom_meeting_id.replace(/\D/g, '').length >= 9) return 'zoom'
  return ''
})

const canSchedule = computed(() =>
  (sched.value.room_url.trim() || sched.value.zoom_meeting_id.replace(/\D/g, '').length >= 9) &&
  sched.value.date && sched.value.time
)

const commonTimezones = [
  { value: 'UTC',                    label: 'UTC' },
  { value: 'America/New_York',       label: 'Eastern (ET)' },
  { value: 'America/Chicago',        label: 'Central (CT)' },
  { value: 'America/Denver',         label: 'Mountain (MT)' },
  { value: 'America/Los_Angeles',    label: 'Pacific (PT)' },
  { value: 'Europe/London',          label: 'London (GMT/BST)' },
  { value: 'Europe/Paris',           label: 'Paris (CET)' },
  { value: 'Europe/Berlin',          label: 'Berlin (CET)' },
  { value: 'Asia/Kolkata',           label: 'India (IST)' },
  { value: 'Asia/Dubai',             label: 'Dubai (GST)' },
  { value: 'Asia/Singapore',         label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo',             label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney',       label: 'Sydney (AEST)' },
]

function formatScheduledTime(s: any) {
  try {
    const iso = `${s.date}T${s.time}:00`
    return new Intl.DateTimeFormat('en', {
      timeZone: s.timezone || 'UTC',
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
  } catch { return `${s.date} ${s.time}` }
}

function buildSchedRoomUrl(): string {
  let url = sched.value.room_url.trim()
  const rawId = sched.value.zoom_meeting_id.replace(/\s+/g, '').replace(/-/g, '')
  const pwd   = sched.value.zoom_password.trim()
  if (!url && rawId) url = `https://zoom.us/j/${rawId}`
  if (url && pwd && !url.includes('pwd=')) url += (url.includes('?') ? '&' : '?') + `pwd=${encodeURIComponent(pwd)}`
  return url
}

async function scheduleBot() {
  if (!canSchedule.value) return
  scheduling.value = true
  try {
    // Convert local datetime + tz to UTC ISO for storage
    const localIso  = `${sched.value.date}T${sched.value.time}:00`
    // Use Intl to get the UTC offset for the chosen timezone at that moment
    const target    = new Date(localIso)
    const utcMs     = target.getTime() - getTimezoneOffset(sched.value.timezone, target)
    const scheduledAt = new Date(utcMs).toISOString()

    await $fetch('/api/bot/schedule', {
      method: 'POST',
      body: {
        workspace_id:  workspaceId,
        room_url:      buildSchedRoomUrl(),
        bot_name:      sched.value.bot_name || 'Atlantir',
        response_mode: sched.value.response_mode,
        instructions:  sched.value.instructions.trim() || null,
        scheduled_at:  scheduledAt,
        timezone:      sched.value.timezone,
        platform:      schedDetectedPlatform.value || 'zoom',
      }
    })
    // Reset schedule form
    sched.value = { ...sched.value, room_url: '', zoom_meeting_id: '', zoom_password: '', instructions: '', time: '' }
    showSchedInstructions.value = false
    await loadScheduledBots()
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to schedule bot'
    setTimeout(() => error.value = '', 6000)
  } finally {
    scheduling.value = false
  }
}

function getTimezoneOffset(tz: string, date: Date): number {
  try {
    const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' })
    const tzStr  = date.toLocaleString('en-US', { timeZone: tz })
    return new Date(tzStr).getTime() - new Date(utcStr).getTime()
  } catch { return 0 }
}

async function loadScheduledBots() {
  try {
    const data = await $fetch<any[]>(`/api/bot/schedules?workspace_id=${workspaceId}`)
    scheduledBots.value = data || []
  } catch {}
}

const detectedPlatform = computed(() => {
  const url = form.value.room_url

  if (url.includes('meet.google.com')) return 'meet'
  if (url.includes('zoom.us') || url.includes('zoom.com')) return 'zoom'

  // Raw meeting ID with no URL — treat as Zoom
  if (!url && form.value.zoom_meeting_id.replace(/\D/g, '').length >= 9) {
    return 'zoom'
  }

  return ''
})

// Disable join if no URL and no zoom meeting ID
const canJoin = computed(() =>
  form.value.room_url.trim() ||
  form.value.zoom_meeting_id.replace(/\D/g, '').length >= 9
)

function onPaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') || ''
  form.value.room_url = text.trim()
}

function platformLabel(p: string) {
  if (p === 'meet') return 'Google Meet'
  if (p === 'zoom') return 'Zoom'
  return 'Call'
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    starting: 'Starting up…', joining: 'Joining call…',
    in_call: 'In call', listening: 'Listening',
    leaving: 'Leaving…', stopped: 'Ended', error: 'Error',
  }
  return map[s] || s
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatLogTs(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function truncateUrl(url: string) {
  try { return new URL(url).hostname + new URL(url).pathname.slice(0, 20) } catch { return url }
}

// ── Inline title editing ──────────────────────────────────────────────────────
function startEdit(s: any) {
  editingId.value = s.session_id
  editingTitle.value = s.title || 'New meeting'
  nextTick(() => {
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  })
}

function commitTitle(s: any) {
  const trimmed = editingTitle.value.trim()
  if (trimmed) s.title = trimmed
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

function viewTranscript(s: any) {
  transcriptSession.value = s
}

async function deleteSession(s: any) {
  // delete from DB if it was saved as a meeting
  if (s.meeting_id) {
    await $fetch('/api/meetings/delete', { method: 'POST', body: { meeting_id: s.meeting_id } }).catch(() => {})
  }
  pastSessions.value = pastSessions.value.filter(p => p.session_id !== s.session_id)
}

// ── Joining animation ─────────────────────────────────────────────────────────
const JOIN_HINTS = [
  [0,  'Launching browser…'],
  [20, 'Navigating to meeting…'],
  [40, 'Entering call…'],
  [65, 'Setting up audio…'],
  [80, 'Almost there…'],
  [92, 'Waiting for host…'],
]

function startJoiningAnimation() {
  joiningProgress.value = 0
  joiningHint.value = 'Launching browser…'
  const start = Date.now()
  joiningTimer = setInterval(() => {
    const elapsed = Date.now() - start
    const pct = Math.min(95, (elapsed / JOIN_POLL_MAX_WAIT_MS) * 100)
    joiningProgress.value = pct
    const hint = [...JOIN_HINTS].reverse().find(([threshold]) => pct >= (threshold as number))
    if (hint) joiningHint.value = hint[1] as string
  }, 500)
}

function stopJoiningAnimation() {
  if (joiningTimer) { clearInterval(joiningTimer); joiningTimer = null }
  joiningProgress.value = 100
}

// ── Persistence ───────────────────────────────────────────────────────────────
function saveSession(sessionId: string, roomUrl: string, platform: string) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId, roomUrl, platform, startedAt: new Date().toISOString() })) } catch {}
}
function loadSavedSession() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null } catch { return null }
}
function clearSavedSession() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}

// ── Zoom URL builder ──────────────────────────────────────────────────────────
function buildRoomUrl(): string {
  let url = form.value.room_url.trim()

  // If user pasted a raw meeting ID (digits/spaces only), build the URL
  const rawId = form.value.zoom_meeting_id.replace(/\s+/g, '').replace(/-/g, '')
  if (!url && rawId) {
    url = `https://zoom.us/j/${rawId}`
  }

  // Append password if not already in the URL
  if (url.includes('zoom.us') || url.includes('zoom.com')) {
    const pwd = form.value.zoom_password.trim()
    // Also accept password from the zoom_meeting_id field if it was in "ID passcode" format
    if (pwd && !url.includes('pwd=')) {
      const sep = url.includes('?') ? '&' : '?'
      url = `${url}${sep}pwd=${encodeURIComponent(pwd)}`
    }
    // If manual ID provided and URL has no ID, inject it
    if (rawId && !url.match(/\/j\/\d+/)) {
      url = `https://zoom.us/j/${rawId}${pwd ? `?pwd=${encodeURIComponent(pwd)}` : ''}`
    }
  }

  return url
}

// ── Load past sessions from DB ────────────────────────────────────────────────
async function loadPastSessions() {
  try {
    const data = await $fetch<any[]>(`/api/meetings?workspace_id=${workspaceId}`)
    // Filter to bot-originated meetings (have bot_session_id field) or all ended meetings
    pastSessions.value = (data || [])
      .filter((m: any) => m.bot_session_id || m.source === 'bot')
      .map((m: any) => ({
        session_id:  m.bot_session_id || m.id,
        meeting_id:  m.id,
        title:       m.title || 'Bot session',
        platform:    m.bot_platform || 'zoom',
        started_at:  m.started_at || m.created_at,
        status:      m.status === 'ended' ? 'stopped' : m.status,
        transcript:  m.bot_transcript ? JSON.parse(m.bot_transcript) : [],
      }))
  } catch {}
}

// ── Save transcript to DB when session ends ───────────────────────────────────
async function saveTranscriptToDB(session: any) {
  if (!session?.transcript?.length) return
  try {
    // Create a meeting record to store this bot session's transcript
    const plainText = session.transcript
      .map((e: any) => `[${e.role === 'bot' ? 'Bot' : 'Meeting'}] ${e.text}`)
      .join('\n')

    const meeting = await $fetch<any>('/api/meetings/create', {
      method: 'POST',
      body: {
        workspace_id: workspaceId,
        title: `Bot: ${platformLabel(session.platform)} ${new Date(session.started_at).toLocaleString()}`,
        source: 'bot',
      }
    })

    await $fetch('/api/meetings/end', {
      method: 'POST',
      body: {
        meeting_id:     meeting.id,
        transcript:     plainText,
        bot_session_id: session.session_id,
        bot_platform:   session.platform,
        bot_transcript: JSON.stringify(session.transcript),
      }
    })
  } catch (e) {
    console.warn('Failed to save bot transcript:', e)
  }
}

// ── Join ──────────────────────────────────────────────────────────────────────
async function joinCall() {
  const roomUrl = buildRoomUrl()
  if (!roomUrl) return
  joining.value = true
  error.value = ''
  startJoiningAnimation()

  try {
    const controller = new AbortController()
    const timeoutId  = setTimeout(() => controller.abort(), JOIN_REQUEST_TIMEOUT_MS)
    let result: any
    try {
      result = await $fetch<any>('/api/bot/join', {
        method: 'POST',
        signal: controller.signal,
        body: {
          room_url:      roomUrl,
          workspace_id:  workspaceId,
          bot_name:      form.value.bot_name || 'Atlantir',
          response_mode: form.value.response_mode,
          instructions:  form.value.instructions.trim() || undefined,
        }
      })
    } finally {
      clearTimeout(timeoutId)
    }

    const platform = detectedPlatform.value || 'generic'
    saveSession(result.session_id, roomUrl, platform)

    activeSession.value = {
      session_id:  result.session_id,
      platform,
      room_url:    roomUrl,
      started_at:  new Date().toISOString(),
      status:      'starting',
      transcript:  [],
      logs:        [],
      error:       null,
      speaking:    false,
    }

    startPolling(result.session_id, {
      onActive: () => { stopJoiningAnimation(); joining.value = false },
      onError: (msg: string) => {
        stopJoiningAnimation()
        joining.value = false
        error.value = msg
        setTimeout(() => error.value = '', 8000)
      },
    })

    setTimeout(() => {
      if (joining.value) {
        joining.value = false
        stopJoiningAnimation()
        error.value = 'Bot is taking longer than expected to join — check the debug logs'
        setTimeout(() => error.value = '', 8000)
      }
    }, JOIN_POLL_MAX_WAIT_MS)

  } catch (e: any) {
    stopJoiningAnimation()
    joining.value = false
    const isAbort = e?.name === 'AbortError' || e?.message?.includes('aborted')
    const msg = e?.data?.message || e?.message || ''
    error.value = isAbort
      ? 'Bot service did not respond — is it running on your VPS?'
      : (msg.includes('ECONNREFUSED') || e?.status === 502)
        ? 'Bot service is not running — start it on your VPS first'
        : msg || 'Failed to join call'
    setTimeout(() => error.value = '', 8000)
  }
}

// ── Leave ─────────────────────────────────────────────────────────────────────
async function leaveCall() {
  if (!activeSession.value) return
  leaving.value = true
  const sid = activeSession.value.session_id
  const sessionSnapshot = { ...activeSession.value }
  try {
    await $fetch('/api/bot/leave', { method: 'POST', body: { session_id: sid } })
  } catch (e: any) {
    if (e?.status !== 404) console.warn('Leave error:', e?.data?.message || e?.message)
  }
  stopPolling()
  clearSavedSession()
  // Save transcript to DB before clearing
  await saveTranscriptToDB(sessionSnapshot)
  await loadPastSessions()
  activeSession.value = null
  leaving.value = false
}

// ── Polling ───────────────────────────────────────────────────────────────────
interface PollCallbacks { onActive?: () => void; onError?: (msg: string) => void }

function startPolling(sessionId: string, callbacks: PollCallbacks = {}) {
  stopPolling()
  pollFailures = 0
  let calledActive = false

  pollInterval = setInterval(async () => {
    try {
      const status = await $fetch<any>(`/api/bot/status?id=${sessionId}`)
      pollFailures = 0
      activeSession.value = status

      await nextTick()
      if (feedEl.value) feedEl.value.scrollTop = feedEl.value.scrollHeight
      if (showLogs.value && logsEl.value) logsEl.value.scrollTop = logsEl.value.scrollHeight

      if (!calledActive && (status.status === 'in_call' || status.status === 'listening')) {
        calledActive = true
        callbacks.onActive?.()
      }

      if (status.status === 'error') {
        stopPolling(); clearSavedSession()
        callbacks.onError?.(status.error || 'Bot encountered an error')
        await saveTranscriptToDB(status)
        await loadPastSessions()
        setTimeout(() => { activeSession.value = null }, 4000)
      } else if (status.status === 'stopped') {
        stopPolling(); clearSavedSession()
        await saveTranscriptToDB(status)
        await loadPastSessions()
        setTimeout(() => { activeSession.value = null }, 4000)
      }
    } catch {
      pollFailures++
      if (pollFailures >= 8) {
        stopPolling()
        error.value = 'Lost connection to bot service'
        setTimeout(() => error.value = '', 5000)
      }
    }
  }, 1500)
}

function stopPolling() {
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
}

// ── On mount ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  await loadPastSessions()
  await loadScheduledBots()

  // Load bot defaults from workspace settings
  try {
    const supabase = useSupabaseClient()
    const { data: ws } = await supabase
      .from('workspaces')
      .select('bot_name, bot_instructions, bot_response_mode')
      .eq('id', workspaceId)
      .single()
    if (ws) {
      if (ws.bot_name)         form.value.bot_name      = ws.bot_name
      if (ws.bot_response_mode) form.value.response_mode = ws.bot_response_mode
    }
  } catch {}

  const saved = loadSavedSession()
  if (saved) {
    try {
      const status = await $fetch<any>(`/api/bot/status?id=${saved.sessionId}`)
      if (status.status !== 'stopped' && status.status !== 'error') {
        activeSession.value = status
        startPolling(saved.sessionId)
        return
      }
    } catch {}
    clearSavedSession()
  }
})

onUnmounted(() => {
  stopPolling()
  stopJoiningAnimation()
})
</script>

<style scoped>
.vb-shell { display: flex; flex-direction: column; gap: 24px; }
.page-header h1 { font-size: 19px; font-weight: 600; }
.page-header p   { max-width: 600px; }

/* ── Session panel ── */
.session-panel { display: flex; flex-direction: column; gap: 12px; flex: 1; min-height: 0; }
.session-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); gap: 12px; }
.session-bar-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; flex-wrap: wrap; }
.live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); flex-shrink: 0; }
.live-dot.listening { background: var(--green); animation: pulse-dot 1.5s infinite; }
.live-dot.in_call   { background: var(--accent); animation: pulse-dot 2s infinite; }
.live-dot.joining, .live-dot.starting { background: var(--amber); animation: pulse-dot 1s infinite; }
.live-dot.error { background: var(--red); }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
.session-platform  { font-size: 13px; font-weight: 600; color: var(--text-1); flex-shrink: 0; }
.session-status-text { font-size: 13px; color: var(--text-2); flex-shrink: 0; }
.session-since { font-size: 12px; color: var(--text-3); flex-shrink: 0; }
.wave-inline { display: flex; gap: 2px; align-items: center; }
.wave-inline span { display: block; width: 3px; border-radius: 2px; background: var(--accent); animation: wave 1.2s infinite ease-in-out; }
.wave-inline span:nth-child(1){ height:6px }.wave-inline span:nth-child(2){ height:12px;animation-delay:.1s }.wave-inline span:nth-child(3){ height:16px;animation-delay:.2s }.wave-inline span:nth-child(4){ height:12px;animation-delay:.3s }.wave-inline span:nth-child(5){ height:6px;animation-delay:.4s }
@keyframes wave { 0%,100%{transform:scaleY(.5)} 50%{transform:scaleY(1)} }
.pulse-inline { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse-dot 1.2s infinite; }
.btn-leave { display: flex; align-items: center; gap: 6px; padding: 7px 14px; background: var(--red-soft); color: var(--red-text); border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; flex-shrink: 0; transition: background .15s; }
.btn-leave:hover { background: #fecaca; }
.btn-leave:disabled { opacity:.5; cursor:not-allowed; }
.session-error { display:flex;align-items:flex-start;gap:8px;padding:12px 14px;background:var(--red-soft);border:1px solid #fca5a5;border-radius:var(--radius);font-size:13px;color:var(--red-text);line-height:1.5;flex-shrink:0; }
.session-body { display:grid;grid-template-columns:1fr 320px;gap:12px;min-height:400px; }
.panel-label { display:flex;align-items:center;gap:8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text-3);padding:11px 16px;border-bottom:1px solid var(--border-soft);flex-shrink:0; }
.entry-count { font-size:11px;color:var(--text-3);opacity:.6;font-weight:400;text-transform:none;letter-spacing:0;margin-left:auto; }
.transcript-panel { display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden; }
.transcript-feed { flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:14px;min-height:200px;max-height:560px; }
.transcript-empty { display:flex;flex-direction:column;align-items:center;gap:10px;color:var(--text-3);font-size:13px;text-align:center;padding:32px 16px;line-height:1.6; }
.transcript-entry { display:flex;flex-direction:column;gap:4px; }
.entry-meta { display:flex;align-items:center;gap:8px; }
.entry-role { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em; }
.entry-time { font-size:10px;color:var(--text-3); }
.transcript-entry.human .entry-role { color:var(--text-3); }
.transcript-entry.bot   .entry-role { color:var(--accent); }
.entry-text { font-size:13px;line-height:1.6;color:var(--text-1);padding:8px 12px;border-radius:8px; }
.transcript-entry.human .entry-text { background:var(--surface-2); }
.transcript-entry.bot   .entry-text { background:var(--accent-soft);border-left:3px solid var(--accent); }
.logs-panel { display:flex;flex-direction:column;background:#0f172a;border-radius:var(--radius);overflow:hidden;border:1px solid #1e293b; }
.logs-toggle { cursor:pointer; }
.logs-toggle:hover { background:rgba(255,255,255,.03); }
.logs-feed { flex:1;overflow-y:auto;padding:8px 14px 12px;display:flex;flex-direction:column;gap:1px;max-height:520px; }
.logs-empty { font-size:12px;color:#334155;font-style:italic;padding:4px 0; }
.log-line { display:flex;gap:10px;font-size:11px;font-family:var(--mono);line-height:1.6; }
.log-ts { color:#334155;flex-shrink:0; }
.log-line.info .log-msg  { color:#64748b; }
.log-line.warn .log-msg  { color:#fbbf24; }
.log-line.error .log-msg { color:#f87171; }

/* ── Join panel ── */
.join-panel { display:flex;flex-direction:column;gap:24px; }
.how-section { display:flex;flex-direction:column;gap:12px; }
.how-item { display:flex;align-items:flex-start;gap:14px; }
.how-num { width:26px;height:26px;border-radius:50%;background:var(--accent-soft);border:1px solid var(--accent-border);color:var(--accent);font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px; }
.how-item div { display:flex;flex-direction:column;gap:2px; }
.how-item strong { font-size:13px;font-weight:600;color:var(--text-1); }
.how-item span { font-size:13px;color:var(--text-2);line-height:1.5; }
.join-form { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;display:flex;flex-direction:column;gap:14px;max-width:600px; }
.field { display:flex;flex-direction:column;gap:5px; }
.field-row { display:flex;gap:12px; }
.field-row .field { flex:1; }
.field label { font-size:12px;font-weight:500;color:var(--text-2); }
.opt { font-weight:400;color:var(--text-3); }
.url-input { padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:var(--mono);background:var(--surface);color:var(--text-1);outline:none;width:100%; }
.url-input:focus { border-color:var(--accent); }
.url-input::placeholder { color:var(--text-3);font-family:inherit; }
.field input,.field select { padding:8px 12px;border:1.5px solid var(--border);border-radius:7px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-1);outline:none;width:100%; }
.field input:focus,.field select:focus { border-color:var(--accent); }
.platform-detected { display:flex;align-items:center;gap:5px;font-size:12px;color:var(--green-text);margin-top:2px; }
.joining-progress { display:flex;flex-direction:column;gap:6px; }
.joining-bar { height:4px;background:var(--surface-2);border-radius:99px;overflow:hidden; }
.joining-fill { height:100%;background:var(--accent);border-radius:99px;transition:width .5s ease; }
.joining-hint { font-size:12px;color:var(--text-3); }
.join-notice { display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--text-3);line-height:1.5;padding:10px 12px;background:var(--surface-2);border-radius:var(--radius-sm); }
.btn-join { display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 20px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;transition:background .15s; }
.btn-join:not(:disabled):hover { background:var(--accent-hover); }
.btn-join:disabled { opacity:.4;cursor:not-allowed; }
.btn-spinner { width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;animation:spin .7s linear infinite; }

/* ── Past meetings ── */
.past-section { }
.past-label { font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin-bottom:10px; }
.past-list { display:flex;flex-direction:column;gap:6px; }
.past-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: border-color .15s;
}
.past-card:hover { border-color: var(--border-hover, #d1d5db); }
.past-card-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.past-title-row { display: flex; align-items: center; gap: 6px; min-width: 0; }
.past-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  flex: 1;
  min-width: 0;
}
.past-title-input {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-1);
  background: var(--surface-2);
  border: 1.5px solid var(--accent);
  border-radius: 5px;
  padding: 2px 7px;
  outline: none;
  flex: 1;
  min-width: 0;
  font-family: inherit;
}
.past-edit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-3);
  cursor: pointer;
  border-radius: 5px;
  opacity: 0;
  transition: opacity .15s, background .15s, color .15s;
  flex-shrink: 0;
}
.past-card:hover .past-edit-btn { opacity: 1; }
.past-edit-btn:hover { background: var(--surface-2); color: var(--accent); }
.past-meta-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.past-platform-badge {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-2);
  background: var(--surface-2);
  padding: 1px 7px;
  border-radius: 99px;
  border: 1px solid var(--border);
}
.past-dot { font-size: 11px; color: var(--text-3); }
.past-time { font-size: 11px; color: var(--text-3); }
.past-status { font-size: 11px; color: var(--text-3); }
.past-status.stopped { color: var(--text-3); }
.past-status.error   { color: var(--red-text); }
.past-card-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.past-action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  font-size: 12px;
  color: var(--text-2);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: background .15s, color .15s;
  white-space: nowrap;
}
.past-action-btn:hover { background: var(--border); color: var(--text-1); }
.past-action-btn.danger { color: var(--red-text); padding: 5px 8px; }
.past-action-btn.danger:hover { background: var(--red-soft); border-color: #fca5a5; }

/* ── Share modal ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}
.share-modal {
  width: 480px;
  max-width: calc(100vw - 32px);
  background: var(--surface, #1a1d23);
  border: 1px solid var(--border, #2a2d35);
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.share-modal-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border-soft, #2a2d35);
}
.share-modal-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: var(--accent-soft, rgba(99,102,241,.12));
  border: 1px solid var(--accent-border, rgba(99,102,241,.25));
  color: var(--accent, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.share-modal-title { font-size: 15px; font-weight: 600; color: var(--text-1); margin: 0; }
.share-modal-sub { font-size: 12px; color: var(--text-3); margin: 3px 0 0; }
.share-modal-close {
  margin-left: auto;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent;
  color: var(--text-3); cursor: pointer;
  border-radius: 6px;
  transition: background .15s, color .15s;
  flex-shrink: 0;
}
.share-modal-close:hover { background: var(--surface-2); color: var(--text-1); }
.share-modal-body { display: flex; flex-direction: column; gap: 0; }

/* Tabs */
.share-tabs {
  display: flex;
  gap: 2px;
  padding: 12px 16px 0;
  border-bottom: 1px solid var(--border-soft, #2a2d35);
}
.share-tab {
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-3);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color .15s, border-color .15s;
  font-family: inherit;
  margin-bottom: -1px;
}
.share-tab:hover { color: var(--text-1); }
.share-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

/* Items */
.share-tab-content { padding: 10px 12px; max-height: 220px; overflow-y: auto; }
.share-items { display: flex; flex-direction: column; gap: 2px; }
.share-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background .12s;
  border: 1px solid transparent;
}
.share-item:hover { background: var(--surface-2); }
.share-item.selected { background: var(--accent-soft); border-color: var(--accent-border); }
.share-item-favicon, .share-item-preview {
  width: 28px; height: 28px;
  background: var(--surface-2);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-3);
  flex-shrink: 0;
  border: 1px solid var(--border-soft);
}
.share-item-name { flex: 1; font-size: 13px; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.share-item-check {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Options */
.share-options {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid var(--border-soft, #2a2d35);
  padding: 4px 0;
}
.share-option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
}
.share-option-row + .share-option-row {
  border-top: 1px solid var(--border-soft, #2a2d35);
}
.share-option-info {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--text-3);
  flex: 1;
  min-width: 0;
}
.share-option-info svg { margin-top: 2px; flex-shrink: 0; }
.share-option-label { display: block; font-size: 13px; font-weight: 500; color: var(--text-1); }
.share-option-desc  { display: block; font-size: 11px; color: var(--text-3); margin-top: 2px; }

/* Toggle */
.toggle {
  width: 36px; height: 20px;
  border-radius: 99px;
  border: none;
  background: var(--border);
  cursor: pointer;
  position: relative;
  transition: background .2s;
  flex-shrink: 0;
  padding: 0;
}
.toggle.on { background: var(--accent); }
.toggle-knob {
  position: absolute;
  top: 3px; left: 3px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: #fff;
  transition: transform .2s;
  display: block;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
}
.toggle.on .toggle-knob { transform: translateX(16px); }

/* Footer */
.share-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--border-soft, #2a2d35);
}
.btn-cancel {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background .15s, color .15s;
}
.btn-cancel:hover { background: var(--surface-2); color: var(--text-1); }
.btn-share {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: background .15s, opacity .15s;
}
.btn-share:not(:disabled):hover { background: var(--accent-hover); }
.btn-share:disabled { opacity: .4; cursor: not-allowed; }

/* Toast */
.toast { position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:8px;font-size:13px;z-index:600; }
.toast.error { background:var(--red);color:#fff; }

/* ── Join tabs ── */
.join-tabs { display:flex; gap:2px; border-bottom:1px solid var(--border-soft,var(--border)); margin:-4px -4px 4px; padding:0 4px; }
.join-tab { display:flex;align-items:center;gap:6px;padding:8px 14px;font-size:13px;font-weight:500;color:var(--text-3);background:transparent;border:none;border-bottom:2px solid transparent;cursor:pointer;font-family:inherit;transition:color .13s,border-color .13s;margin-bottom:-1px; }
.join-tab:hover { color:var(--text-1); }
.join-tab.active { color:var(--accent);border-bottom-color:var(--accent); }

/* ── Inline instructions ── */
.instructions-toggle { display:flex;align-items:center;gap:7px;font-size:12px;font-weight:500;color:var(--text-3);cursor:pointer;padding:2px 0;user-select:none;transition:color .13s; }
.instructions-toggle:hover { color:var(--text-1); }
.instructions-badge { font-size:10px;padding:1px 7px;border-radius:99px;background:var(--accent-soft);color:var(--accent);border:1px solid var(--accent-border); }
.instructions-hint { font-size:11px;color:var(--text-3);font-weight:400;font-style:italic; }
.instructions-field { display:flex;flex-direction:column;gap:6px; }
.instructions-textarea { padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-1);outline:none;width:100%;resize:vertical;min-height:80px;line-height:1.6;box-sizing:border-box; }
.instructions-textarea:focus { border-color:var(--accent); }
.instructions-sub { font-size:11px;color:var(--text-3);line-height:1.5; }
.instructions-sub a { color:var(--accent);text-decoration:none; }
.instructions-sub a:hover { text-decoration:underline; }

/* ── Schedule time row ── */
.sched-time-row { align-items:flex-end; }
.input-field { padding:8px 12px;border:1.5px solid var(--border);border-radius:7px;font-size:13px;font-family:inherit;background:var(--surface);color:var(--text-1);outline:none;width:100%; }
.input-field:focus { border-color:var(--accent); }

/* ── Scheduled status badge ── */
.sched-status-badge { font-size:10px;padding:1px 7px;border-radius:99px;font-weight:600;text-transform:uppercase;letter-spacing:.04em; }
.sched-status-badge.pending  { background:var(--amber-soft,#fef3c7);color:var(--amber-text,#92400e); }
.sched-status-badge.done     { background:var(--green-soft);color:var(--green-text); }
.sched-status-badge.failed   { background:var(--red-soft);color:var(--red-text); }
.sched-status-badge.running  { background:var(--accent-soft);color:var(--accent); }

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Transcript viewer modal ── */
.transcript-modal {
  width: 540px;
  max-width: calc(100vw - 32px);
  max-height: 80vh;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.transcript-modal-body {
  overflow-y: auto;
  padding: 14px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>