<template>
  <div class="chat-panel">
    <div ref="scrollEl" class="messages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="msg.sender_type"
      >
        <div class="msg-meta">
          <span class="msg-sender">
            {{ msg.sender_type === 'agent' ? (msg.agent_type || 'Agent') : 'You' }}
          </span>
          <span class="msg-time">{{ formatTime(msg.created_at) }}</span>
        </div>
        <div class="msg-content">{{ msg.content }}</div>
      </div>

      <div v-if="running" class="message agent">
        <div class="msg-meta"><span class="msg-sender">Agent</span></div>
        <div class="msg-content typing">
          <span /><span /><span />
        </div>
      </div>
    </div>

    <div class="chat-footer">
      <div v-if="canRun && !running" class="run-bar">
        <button class="btn-run" @click="$emit('run-agent')">
          Run agent
        </button>
      </div>
      <div class="input-row">
        <textarea
          v-model="draft"
          class="chat-input"
          placeholder="Message or answer agent's question..."
          rows="2"
          @keydown.enter.exact.prevent="send"
        />
        <button class="btn-send" :disabled="!draft.trim()" @click="send">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message, Task } from '~/types'

const props = defineProps<{
  taskId: string
  messages: Message[]
  running: boolean
}>()

const emit = defineEmits(['send', 'run-agent'])
const draft = ref('')
const scrollEl = ref<HTMLElement>()

const canRun = computed(() => {
  const store = useWorkspaceStore()
  const task = store.activeTask
  return task?.status === 'approved'
})

function send() {
  if (!draft.value.trim()) return
  emit('send', draft.value.trim())
  draft.value = ''
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

watch(() => props.messages, async () => {
  await nextTick()
  if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}, { deep: true })
</script>

<style scoped>
.chat-panel { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
.messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.message { max-width: 85%; }
.message.human { align-self: flex-end; }
.message.agent { align-self: flex-start; }
.msg-meta { display: flex; gap: 8px; align-items: baseline; margin-bottom: 3px; }
.msg-sender { font-size: 11px; font-weight: 600; color: #374151; }
.msg-time { font-size: 11px; color: #9ca3af; }
.msg-content {
  font-size: 13px; line-height: 1.5; padding: 10px 14px;
  border-radius: 12px; white-space: pre-wrap;
}
.human .msg-content { background: #2563eb; color: white; border-radius: 12px 12px 2px 12px; }
.agent .msg-content { background: #f3f4f6; color: #111827; border-radius: 12px 12px 12px 2px; }
.chat-footer { border-top: 1px solid #e5e7eb; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.run-bar { display: flex; justify-content: center; }
.btn-run {
  padding: 6px 20px; background: #059669; color: white;
  border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500;
}
.btn-run:hover { background: #047857; }
.input-row { display: flex; gap: 8px; align-items: flex-end; }
.chat-input {
  flex: 1; resize: none; font-size: 13px;
  border: 1px solid #e5e7eb; border-radius: 8px;
  padding: 8px 12px; font-family: inherit; line-height: 1.5;
}
.chat-input:focus { outline: none; border-color: #2563eb; }
.btn-send {
  padding: 8px 16px; background: #2563eb; color: white;
  border: none; border-radius: 8px; cursor: pointer; font-size: 13px;
}
.btn-send:disabled { opacity: 0.4; cursor: not-allowed; }
.typing { display: flex; gap: 4px; align-items: center; min-height: 20px; }
.typing span {
  width: 6px; height: 6px; background: #9ca3af; border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
</style>