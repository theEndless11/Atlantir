<template>
  <div class="task-card" :class="{ active }" @click="$emit('click')">
    <div class="task-top">
      <span class="task-title">{{ task.title }}</span>
      <span class="priority-dot" :class="task.priority" />
    </div>
    <div class="task-meta">
      <TaskStatusBadge :status="task.status" />
      <span v-if="task.assigned_agent" class="agent-label">{{ task.assigned_agent }}</span>
    </div>

    <!-- Approval controls -->
    <div v-if="task.status === 'pending_approval'" class="approval-row" @click.stop>
      <select v-model="selectedAgent" class="agent-select">
        <option value="">Assign agent...</option>
        <option value="research">Research</option>
        <option value="writer">Writer</option>
        <option value="analyst">Analyst</option>
        <option value="executor">Executor</option>
      </select>
      <button class="btn-approve" :disabled="!selectedAgent" @click="$emit('approve', selectedAgent)">
        Approve
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types'

defineProps<{ task: Task; active: boolean }>()
defineEmits(['click', 'approve'])

const selectedAgent = ref('' as string)
</script>

<style scoped>
.task-card {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.1s;
}
.task-card:hover { background: #f9fafb; }
.task-card.active { background: #eff6ff; }
.task-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}
.task-title { font-size: 13px; font-weight: 500; line-height: 1.4; }
.priority-dot {
  width: 7px; height: 7px;
  border-radius: 50%; flex-shrink: 0; margin-top: 4px;
}
.priority-dot.low { background: #6ee7b7; }
.priority-dot.medium { background: #fbbf24; }
.priority-dot.high { background: #f97316; }
.priority-dot.urgent { background: #ef4444; }
.task-meta { display: flex; align-items: center; gap: 6px; }
.agent-label {
  font-size: 11px; color: #6b7280;
  background: #f3f4f6; padding: 1px 6px; border-radius: 4px;
}
.approval-row { display: flex; gap: 6px; margin-top: 8px; }
.agent-select {
  flex: 1; font-size: 12px;
  border: 1px solid #e5e7eb; border-radius: 6px; padding: 4px 8px;
}
.btn-approve {
  font-size: 12px; padding: 4px 10px;
  background: #2563eb; color: white;
  border: none; border-radius: 6px; cursor: pointer;
}
.btn-approve:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-approve:hover:not(:disabled) { background: #1d4ed8; }
</style>