<template>
  <div class="artifact-panel">
    <div v-if="!artifacts.length" class="empty">
      Artifacts will appear here once agents complete their work
    </div>

    <div v-else>
      <div
        v-for="artifact in artifacts"
        :key="artifact.id"
        class="artifact-card"
        :class="{ active: selectedId === artifact.id }"
        @click="selectedId = artifact.id"
      >
        <div class="artifact-header">
          <span class="artifact-type-badge" :class="artifact.type">{{ artifact.type }}</span>
          <span class="artifact-title">{{ artifact.title }}</span>
          <span class="artifact-version">v{{ artifact.version }}</span>
        </div>
        <div v-if="selectedId === artifact.id" class="artifact-content">
          {{ artifact.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Artifact, Task } from '~/types'
defineProps<{ artifacts: Artifact[]; activeTask: Task | null }>()
const selectedId = ref<string | null>(null)
</script>

<style scoped>
.artifact-panel { flex: 1; overflow-y: auto; padding: 12px; }
.empty { padding: 24px 16px; text-align: center; font-size: 13px; color: #9ca3af; line-height: 1.6; }
.artifact-card {
  border: 1px solid #e5e7eb; border-radius: 8px;
  margin-bottom: 8px; overflow: hidden; cursor: pointer;
}
.artifact-card:hover { border-color: #d1d5db; }
.artifact-card.active { border-color: #2563eb; }
.artifact-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 12px;
  background: #f9fafb;
}
.artifact-title { flex: 1; font-size: 13px; font-weight: 500; }
.artifact-version { font-size: 11px; color: #9ca3af; }
.artifact-type-badge {
  font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px;
  text-transform: uppercase; letter-spacing: 0.05em;
}
.research { background: #dbeafe; color: #1e40af; }
.document { background: #d1fae5; color: #065f46; }
.summary { background: #fef3c7; color: #92400e; }
.analyst { background: #ede9fe; color: #5b21b6; }
.other { background: #f3f4f6; color: #374151; }
.artifact-content {
  padding: 12px; font-size: 12px; line-height: 1.6;
  white-space: pre-wrap; color: #374151; max-height: 400px; overflow-y: auto;
  border-top: 1px solid #e5e7eb;
}
</style>