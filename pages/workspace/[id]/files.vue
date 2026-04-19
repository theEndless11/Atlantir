<template>
  <div class="page-shell kb-shell">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Knowledge base</h1>
        <p>Everything agents know about your company — docs, guides, context</p>
      </div>
      <label class="btn btn-primary upload-label">
        <input type="file" multiple accept=".pdf,.docx,.txt,.md" @change="handleUpload" />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span v-if="!uploading">Upload files</span>
        <span v-else>Uploading…</span>
      </label>
    </div>

    <!-- Upload progress -->
    <div v-if="uploading" class="upload-progress">
      <div class="upload-fill" :style="{ width: uploadProgress + '%' }" />
      <span>{{ uploadStatus }}</span>
    </div>

    <!-- Agent knowledge summary banner -->
    <div class="knowledge-banner">
      <div class="banner-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      </div>
      <div class="banner-content">
        <div class="banner-title">How agents use this knowledge</div>
        <p class="banner-desc">
          Every file you upload is chunked and semantically indexed. When an agent runs a task, it searches this knowledge base and injects the most relevant passages into its context automatically — no manual referencing needed.
        </p>
        <div class="banner-capabilities">
          <div class="cap-chip"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Company-specific answers</div>
          <div class="cap-chip"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Personalised writing & emails</div>
          <div class="cap-chip"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Context-aware research</div>
          <div class="cap-chip"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Accurate internal references</div>
        </div>
      </div>
      <div class="banner-stats" v-if="files.length">
        <div class="stat-block">
          <span class="stat-big">{{ files.length }}</span>
          <span class="stat-label">Files</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-block">
          <span class="stat-big">{{ totalChunks }}</span>
          <span class="stat-label">Chunks indexed</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-block">
          <span class="stat-big">{{ formatSize(totalBytes) }}</span>
          <span class="stat-label">Total size</span>
        </div>
      </div>
    </div>

    <!-- What agents know — displayed as agent's own words -->
    <div v-if="agentKnowledge.length" class="agent-knowledge-section">
      <div class="section-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        What agents know
      </div>
      <div class="agent-knowledge-card">
        <div class="ak-agent-row">
          <div class="ak-avatar">A</div>
          <span class="ak-agent-name">Agent knowledge summary</span>
          <span class="ak-badge">{{ totalChunks }} passages indexed</span>
        </div>
        <div class="ak-prose">
          <p v-for="(para, i) in agentKnowledge" :key="i" class="ak-para">{{ para }}</p>
        </div>
      </div>
    </div>

    <!-- What to upload section if empty -->
    <div v-if="!loading && !files.length" class="empty-guide">
      <div class="empty-title">Your knowledge base is empty</div>
      <p class="empty-subtitle">Add files to give agents company-specific context. Here are the best things to upload:</p>
      <div class="suggestions-grid">
        <div v-for="s in suggestions" :key="s.title" class="suggestion-card">
          <div class="sug-icon">{{ s.emoji }}</div>
          <div class="sug-body">
            <div class="sug-title">{{ s.title }}</div>
            <div class="sug-desc">{{ s.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Files list -->
    <div v-if="loading" class="loading-row">
      <div class="spinner spinner-dark" /> Loading files…
    </div>

    <div v-else-if="files.length" class="files-section">
      <div class="section-label">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        All files
      </div>
      <div class="files-list">
        <div v-for="file in files" :key="file.id" class="file-row">
          <div class="file-icon" :class="fileType(file)">
            <svg v-if="fileType(file) === 'pdf'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            <svg v-else-if="fileType(file) === 'doc'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
          </div>
          <div class="file-info">
            <span class="file-name">{{ file.filename }}</span>
            <span class="file-meta">{{ formatSize(file.size_bytes) }} · {{ formatDate(file.created_at) }}</span>
          </div>
          <div class="file-badge" :class="indexStatus(file)">
            <svg v-if="indexStatus(file) === 'indexed'" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <svg v-else-if="indexStatus(file) === 'failed'" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            <div v-else class="badge-spinner" />
            {{ indexLabel(file) }}
          </div>
          <button class="btn-icon file-del" @click="deleteFile(file.id)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6m4-6v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Supported formats note -->
    <div class="formats-note">
      Supported: PDF, Word (.docx), plain text (.txt), Markdown (.md) · Max 20MB per file
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'workspace' })
import type { WorkspaceFile } from '~/types'

const route = useRoute()
const workspaceId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id as string
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const files          = ref<WorkspaceFile[]>([])
const loading        = ref(false)
const uploading      = ref(false)
const uploadProgress = ref(0)
const uploadStatus   = ref('')
const knowledgeTopics  = ref<{ file: string; preview: string; chunks: number }[]>([])
const agentKnowledge   = ref<string[]>([])

const totalChunks = computed(() => files.value.reduce((sum, f) => sum + ((f.embedding_meta as any)?.chunks || 0), 0))
const totalBytes  = computed(() => files.value.reduce((sum, f) => sum + (f.size_bytes || 0), 0))

const suggestions = [
  { emoji: '📋', title: 'Company overview', desc: 'Mission, values, team structure, product description' },
  { emoji: '📖', title: 'Product docs', desc: 'Features, pricing, FAQs, release notes' },
  { emoji: '✉️', title: 'Email templates', desc: 'Sales outreach, onboarding, support responses' },
  { emoji: '📊', title: 'Strategy docs', desc: 'OKRs, roadmaps, competitive analysis' },
  { emoji: '🤝', title: 'SOPs & playbooks', desc: 'How processes work, who owns what' },
  { emoji: '📝', title: 'Meeting notes', desc: 'Past decisions, action items, context' },
]

async function loadFiles() {
  loading.value = true
  try {
    const data = await $fetch<WorkspaceFile[]>(`/api/files?workspace_id=${workspaceId}`)
    files.value = data || []
    await loadChunkPreviews()
  } finally {
    loading.value = false
  }
}

async function loadChunkPreviews() {
  try {
    const sb = useSupabaseClient()
    const { data } = await sb
      .from('file_chunks')
      .select('content, file_id')
      .eq('workspace_id', workspaceId)
      .limit(30)
    if (!data?.length) return

    // Group by file, take first chunk as preview
    const byFile = new Map<string, string[]>()
    for (const chunk of data) {
      if (!byFile.has(chunk.file_id)) byFile.set(chunk.file_id, [])
      byFile.get(chunk.file_id)!.push(chunk.content)
    }

    knowledgeTopics.value = []
    agentKnowledge.value  = []

    // Build agent-voice prose — take first chunk from each file as a clean paragraph
    const allContent: string[] = []
    for (const [fileId, chunks] of byFile.entries()) {
      const file = files.value.find(f => f.id === fileId)
      if (!file) continue
      const preview = chunks[0]?.slice(0, 180).replace(/\s+/g, ' ').trim() || ''
      knowledgeTopics.value.push({
        file: file.filename,
        preview: preview ? preview + (preview.length >= 180 ? '…' : '') : '',
        chunks: chunks.length,
      })
      // Add meaningful chunk content as agent prose
      for (const chunk of chunks.slice(0, 2)) {
        const clean = chunk.slice(0, 320).replace(/\s+/g, ' ').trim()
        if (clean.length > 40) allContent.push(clean)
      }
    }
    agentKnowledge.value = allContent.slice(0, 6)
  } catch {}
}

async function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  uploading.value = true; uploadProgress.value = 0
  const total = input.files.length
  for (let i = 0; i < total; i++) {
    const file = input.files[i]
    uploadStatus.value = `Uploading ${file.name}…`
    uploadProgress.value = Math.round((i / total) * 80)
    const form = new FormData()
    form.append('file', file)
    form.append('workspace_id', workspaceId)
    form.append('user_id', user.value?.id || '')
    try { await $fetch('/api/files/upload', { method: 'POST', body: form }) }
    catch (err: any) { alert(`Failed: ${err?.data?.message || err.message}`) }
  }
  uploadProgress.value = 100; uploadStatus.value = 'Done!'
  await loadFiles()
  setTimeout(() => { uploading.value = false }, 1200)
  input.value = ''
}

async function deleteFile(fileId: string) {
  if (!confirm('Delete this file and its indexed chunks?')) return
  await $fetch('/api/files/delete', { method: 'POST', body: { file_id: fileId } })
  files.value = files.value.filter(f => f.id !== fileId)
  knowledgeTopics.value = knowledgeTopics.value.filter(t => {
    const file = files.value.find(f => f.filename === t.file)
    return !!file
  })
}

function fileType(f: WorkspaceFile) {
  if (f.mime_type === 'application/pdf') return 'pdf'
  if (f.mime_type?.includes('wordprocessingml')) return 'doc'
  return 'txt'
}
function fileTypeClass(name: string) {
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.docx')) return 'doc'
  return 'txt'
}
function formatSize(bytes?: number) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes/1024).toFixed(1)}KB`
  return `${(bytes/1024/1024).toFixed(1)}MB`
}
function formatDate(ts: string) { return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) }
function indexStatus(f: WorkspaceFile) {
  const s = (f.embedding_meta as any)?.status
  if (s === 'indexed') return 'indexed'
  if (s === 'index_failed') return 'failed'
  return 'pending'
}
function indexLabel(f: WorkspaceFile) {
  const s = indexStatus(f)
  if (s === 'indexed') return `${(f.embedding_meta as any)?.chunks || 0} chunks`
  if (s === 'failed')  return 'Index failed'
  return 'Indexing…'
}

onMounted(loadFiles)
</script>

<style scoped>
.kb-shell { padding-bottom: 40px; }
.upload-label { cursor: pointer; gap: 7px; }
.upload-label input { display: none; }

.upload-progress { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; padding: 10px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.upload-fill { height: 3px; background: var(--accent); border-radius: 2px; flex-shrink: 0; transition: width .3s; }
.upload-progress span { font-size: 12px; color: var(--text-2); }

/* Banner */
.knowledge-banner { display: flex; gap: 18px; align-items: flex-start; padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 20px; }
.banner-icon { width: 42px; height: 42px; border-radius: 10px; background: var(--accent-soft); border: 1px solid var(--accent-border); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
.banner-content { flex: 1; }
.banner-title { font-size: 14px; font-weight: 600; color: var(--text-1); margin-bottom: 5px; }
.banner-desc  { font-size: 13px; color: var(--text-2); line-height: 1.6; margin-bottom: 10px; }
.banner-capabilities { display: flex; flex-wrap: wrap; gap: 6px; }
.cap-chip { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--green-text); background: var(--green-soft); padding: 3px 9px; border-radius: 20px; }
.banner-stats { display: flex; align-items: center; gap: 0; flex-shrink: 0; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.stat-block { display: flex; flex-direction: column; align-items: center; padding: 12px 18px; }
.stat-big   { font-size: 22px; font-weight: 700; color: var(--text-1); line-height: 1; }
.stat-label { font-size: 10px; color: var(--text-3); margin-top: 3px; white-space: nowrap; }
.stat-divider { width: 1px; background: var(--border); height: 40px; }

/* Topics */
.section-label { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-3); margin-bottom: 12px; }

/* Agent knowledge section */
.agent-knowledge-section { margin-bottom: 20px; }
.agent-knowledge-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); overflow: hidden;
}
.ak-agent-row {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px; border-bottom: 1px solid var(--border-soft);
  background: var(--surface-2);
}
.ak-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--accent); color: #fff;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.ak-agent-name { font-size: 12px; font-weight: 600; color: var(--text-1); flex: 1; }
.ak-badge { font-size: 10px; color: var(--green-text); background: var(--green-soft); padding: 2px 8px; border-radius: 10px; }
.ak-prose { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.ak-para {
  font-size: 13px; color: var(--text-1); line-height: 1.7;
  padding: 10px 12px;
  background: var(--surface-2); border-radius: 8px;
  border-left: 2px solid var(--accent-border);
}

/* Empty guide */
.empty-guide { padding: 24px 0; }
.empty-title    { font-size: 16px; font-weight: 600; color: var(--text-1); margin-bottom: 6px; }
.empty-subtitle { font-size: 13px; color: var(--text-2); margin-bottom: 20px; }
.suggestions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
.suggestion-card { display: flex; gap: 12px; padding: 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.sug-icon  { font-size: 22px; flex-shrink: 0; }
.sug-title { font-size: 13px; font-weight: 500; color: var(--text-1); margin-bottom: 3px; }
.sug-desc  { font-size: 12px; color: var(--text-2); line-height: 1.5; }

/* Loading */
.loading-row { display: flex; align-items: center; gap: 10px; color: var(--text-3); font-size: 13px; padding: 32px 0; }

/* Files */
.files-section { margin-bottom: 16px; }
.files-list { display: flex; flex-direction: column; gap: 2px; }
.file-row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); transition: border-color .13s; }
.file-row:hover { border-color: var(--text-3); }
.file-icon { width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.file-icon.pdf { background: var(--red-soft);   color: var(--red-text); }
.file-icon.doc { background: var(--blue-soft);  color: var(--blue-text); }
.file-icon.txt { background: var(--surface-2);  color: var(--text-2); }
.file-info  { flex: 1; min-width: 0; }
.file-name  { font-size: 13px; font-weight: 500; color: var(--text-1); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-meta  { font-size: 11px; color: var(--text-3); }
.file-badge { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 20px; white-space: nowrap; }
.file-badge.indexed { background: var(--green-soft); color: var(--green-text); }
.file-badge.failed  { background: var(--red-soft);   color: var(--red-text); }
.file-badge.pending { background: var(--amber-soft); color: var(--amber-text); }
.badge-spinner { width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid currentColor; border-top-color: transparent; animation: spin .7s linear infinite; }
.file-del { color: var(--text-3); }
.file-del:hover { color: var(--red-text); background: var(--red-soft); }

.formats-note { font-size: 11px; color: var(--text-3); margin-top: 8px; }
@keyframes spin { to{transform:rotate(360deg)} }
</style>
