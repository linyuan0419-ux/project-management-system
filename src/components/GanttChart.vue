<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Task {
  id: string
  name: string
  start: string
  end: string
  progress: number
  dependencies?: string
  custom_class?: string
}

interface Props {
  tasks: Task[]
  viewMode?: 'Day' | 'Week' | 'Month' | 'Quarter'
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'Week'
})

const ganttContainer = ref<HTMLElement | null>(null)
const gantt = ref<any>(null)

onMounted(async () => {
  if (ganttContainer.value) {
    const Gantt = (await import('frappe-gantt')).default
    gantt.value = new Gantt(ganttContainer.value, props.tasks, {
      view_mode: props.viewMode,
      date_format: 'YYYY-MM-DD',
      language: 'zh',
      custom_popup_html: (task: any) => {
        return `
          <div class="bg-white rounded-apple-sm shadow-apple p-3 min-w-[200px]">
            <h5 class="text-body font-medium mb-2">${task.name}</h5>
            <div class="text-caption space-y-1">
              <p>开始: ${task.start}</p>
              <p>结束: ${task.end}</p>
              <p>进度: ${task.progress}%</p>
            </div>
          </div>
        `
      },
      on_click: (task: Task) => {
        console.log('点击任务:', task)
      },
      on_date_change: (task: Task, start: string, end: string) => {
        console.log('日期变更:', task, start, end)
      },
      on_progress_change: (task: Task, progress: number) => {
        console.log('进度变更:', task, progress)
      }
    })
  }
})

watch(() => props.viewMode, (newMode) => {
  if (gantt.value) {
    gantt.value.change_view_mode(newMode)
  }
})

watch(() => props.tasks, (newTasks) => {
  if (gantt.value) {
    gantt.value.refresh(newTasks)
  }
}, { deep: true })
</script>

<template>
  <div ref="ganttContainer" class="gantt-chart"></div>
</template>

<style>
/* 覆盖 frappe-gantt 默认样式，匹配苹果风格 */
.gantt-chart {
  font-family: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", -apple-system, sans-serif;
}

.gantt-chart .bar {
  fill: #007AFF;
  rx: 4;
  ry: 4;
}

.gantt-chart .bar-progress {
  fill: #409CFF;
}

.gantt-chart .bar-label {
  fill: #1D1D1F;
  font-size: 12px;
  font-weight: 500;
}

.gantt-chart .tick {
  stroke: #E5E5EA;
}

.gantt-chart .grid-header {
  fill: #F5F5F7;
  stroke: #E5E5EA;
}

.gantt-chart .grid-row {
  fill: #FFFFFF;
  stroke: #E5E5EA;
}

.gantt-chart .grid-row:nth-child(even) {
  fill: #FAFAFA;
}

.gantt-chart .today-highlight {
  fill: #E8F2FF;
  opacity: 0.5;
}

.gantt-chart .bar-wrapper:hover .bar {
  fill: #409CFF;
}

.gantt-chart .handle {
  fill: #007AFF;
}

.gantt-chart .progress-handle {
  fill: #FFFFFF;
  stroke: #007AFF;
  stroke-width: 2;
}

/* 隐藏默认 popup，使用自定义 */
.gantt-chart .popup-wrapper {
  display: none;
}
</style>
