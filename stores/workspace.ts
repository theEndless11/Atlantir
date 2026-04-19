import { defineStore } from 'pinia'
import type { Workspace, Task, Message, Meeting, Artifact } from '~/types'

export const useWorkspaceStore = defineStore('workspace', () => {
  const supabase = useSupabaseClient()

  const currentWorkspace = ref<Workspace | null>(null)
  const workspaces = ref<Workspace[]>([])

  let _workspaceChannel: ReturnType<typeof supabase.channel> | null = null
  let _subscribedWorkspaceId: string | null = null
  const tasks = ref<Task[]>([])
  const messages = ref<Message[]>([])
  const meetings = ref<Meeting[]>([])
  const artifacts = ref<Artifact[]>([])
  const activeTaskId = ref<string | null>(null)

  const pendingTasks = computed(() => tasks.value.filter(t => t.status === 'pending_approval'))
  const activeTasks = computed(() => tasks.value.filter(t => ['approved','in_progress','needs_clarification'].includes(t.status)))
  const completedTasks = computed(() => tasks.value.filter(t => t.status === 'completed'))
  const activeTask = computed(() => tasks.value.find(t => t.id === activeTaskId.value) || null)
  const taskMessages = computed(() => messages.value.filter(m => m.task_id === activeTaskId.value))

  // Show all artifacts for active task — loaded on workspace mount so survives refresh
  const taskArtifacts = computed(() =>
    artifacts.value.filter(a => a.task_id === activeTaskId.value)
  )

  async function loadWorkspaces() {
    const { data } = await supabase.from('workspaces').select('*').order('created_at')
    workspaces.value = data || []
    if (data?.length && !currentWorkspace.value) {
      currentWorkspace.value = data[0]
    }
  }

  async function loadTasks(workspaceId: string) {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
    tasks.value = data || []
  }

  async function loadMessages(taskId: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at')
    messages.value = [...messages.value.filter(m => m.task_id !== taskId), ...(data || [])]
  }

  async function loadArtifacts(workspaceId: string) {
    const { data } = await supabase
      .from('artifacts')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
    artifacts.value = data || []
  }

  async function approveTask(taskId: string, agentType: string) {
    const user = useSupabaseUser()
    const result = await $fetch<Task>('/api/tasks/approve', {
      method: 'POST',
      body: { task_id: taskId, assigned_agent: agentType, approved_by: user.value?.id }
    })
    const idx = tasks.value.findIndex(t => t.id === taskId)
    if (idx !== -1) tasks.value[idx] = result
    return result
  }

  async function rejectTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'cancelled' })
      .eq('id', taskId)
    if (!error) {
      const idx = tasks.value.findIndex(t => t.id === taskId)
      if (idx !== -1) tasks.value[idx] = { ...tasks.value[idx], status: 'cancelled' }
      if (activeTaskId.value === taskId) activeTaskId.value = null
    }
  }

  async function deleteTask(taskId: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (!error) {
      tasks.value = tasks.value.filter(t => t.id !== taskId)
      if (activeTaskId.value === taskId) activeTaskId.value = null
    }
  }

  async function runTask(taskId: string) {
    return $fetch('/api/agents/run', { method: 'POST', body: { task_id: taskId } })
  }

  async function sendMessage(content: string, taskId?: string, meetingId?: string) {
    const user = useSupabaseUser()
    const wsId = currentWorkspace.value?.id
    if (!wsId) return
    return $fetch('/api/messages', {
      method: 'POST',
      body: {
        workspace_id: wsId,
        task_id: taskId || null,
        meeting_id: meetingId || null,
        sender_id: user.value?.id,
        content
      }
    })
  }

  async function processMeetingTranscript(transcript: string, meetingId?: string) {
    const wsId = currentWorkspace.value?.id
    if (!wsId) return
    const result = await $fetch('/api/meetings/process', {
      method: 'POST',
      body: { workspace_id: wsId, meeting_id: meetingId, transcript }
    })
    // Reload tasks immediately — don't rely solely on realtime
    await loadTasks(wsId)
    return result
  }

  function subscribeToWorkspace(workspaceId: string) {
    // Guard: already subscribed to this workspace
    if (_subscribedWorkspaceId === workspaceId && _workspaceChannel) return

    // Tear down previous subscription if switching workspaces
    if (_workspaceChannel) {
      _workspaceChannel.unsubscribe()
      _workspaceChannel = null
      _subscribedWorkspaceId = null
    }

    _subscribedWorkspaceId = workspaceId
    _workspaceChannel = supabase
      .channel(`workspace:${workspaceId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `workspace_id=eq.${workspaceId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // avoid duplicates from realtime + initial load
            if (!tasks.value.find(t => t.id === (payload.new as Task).id)) {
              tasks.value.unshift(payload.new as Task)
            }
          }
          if (payload.eventType === 'UPDATE') {
            const idx = tasks.value.findIndex(t => t.id === (payload.new as Task).id)
            if (idx !== -1) tasks.value[idx] = payload.new as Task
          }
          if (payload.eventType === 'DELETE') {
            tasks.value = tasks.value.filter(t => t.id !== (payload.old as Task).id)
          }
        }
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `workspace_id=eq.${workspaceId}` },
        (payload) => {
          if (!messages.value.find(m => m.id === (payload.new as Message).id)) {
            messages.value.push(payload.new as Message)
          }
        }
      )
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'artifacts', filter: `workspace_id=eq.${workspaceId}` },
        (payload) => {
          if (!artifacts.value.find(a => a.id === (payload.new as Artifact).id)) {
            artifacts.value.unshift(payload.new as Artifact)
          }
        }
      )
      .subscribe()
    return _workspaceChannel
  }

  return {
    currentWorkspace, workspaces, tasks, messages, meetings, artifacts, activeTaskId,
    pendingTasks, activeTasks, completedTasks, activeTask, taskMessages, taskArtifacts,
    loadWorkspaces, loadTasks, loadMessages, loadArtifacts,
    approveTask, rejectTask, deleteTask, runTask, sendMessage,
    processMeetingTranscript, subscribeToWorkspace
  }
})