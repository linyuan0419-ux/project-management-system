<script setup lang="ts">
import { ref, computed } from 'vue'

interface GanttTask {
  id: string
  name: string
  start: string
  end: string
  progress: number
  color?: string
}

const props = defineProps<{
  tasks: GanttTask[]
}>()

const viewMode = ref<'week' | 'month'>('week')

// 计算日期范围
const dateRange = computed(() => {
  const dates = props.tasks.flatMap(t => [new Date(t.start), new Date(t.end)])
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))
  
  // 扩展范围
  minDate.setDate(minDate.getDate() - 7)
  maxDate.setDate(maxDate.getDate() + 7)
  
  return { start: minDate, end: maxDate }
})

// 生成日期列
const dateColumns = computed(() => {
  const columns = []
  const current = new Date(dateRange.value.start)
  
  while (current <= dateRange.value.end) {
    columns.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  return columns
})

// 格式化日期
const formatDate = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 获取任务位置
const getTaskPosition = (task: GanttTask) => {
  const start = new Date(task.start)
  const end = new Date(task.end)
  const rangeStart = dateRange.value.start
  const rangeEnd = dateRange.value.end
  
  const totalDays = (rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
  const startOffset = (start.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  
  return {
    left: `${(startOffset / totalDays) * 100}%`,
    width: `${(duration / totalDays) * 100}%`
  }
}

// 判断是否是今天
const isToday = (date: Date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// 判断是否是周末
const isWeekend = (date: Date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}
</script>

<template>
  <div class="gantt-container">
    <!-- 视图切换 -->
    <div class="flex items-center justify-end mb-4">
      <div class="flex items-center gap-2 bg-apple-bg rounded-apple-sm p-1">
        <button
          @click="viewMode = 'week'"
          class="px-3 py-1.5 rounded-apple-sm text-sm transition-all"
          :class="viewMode === 'week' ? 'bg-white shadow-sm' : 'text-apple-gray-400'"
        >
          周视图
        </button>
        <button
          @click="viewMode = 'month'"
          class="px-3 py-1.5 rounded-apple-sm text-sm transition-all"
          :class="viewMode === 'month' ? 'bg-white shadow-sm' : 'text-apple-gray-400'"
        >
          月视图
        </button>
      </div>
    </div>

    <!-- 甘特图主体 -->
    <div class="gantt-chart bg-white rounded-apple overflow-hidden">
      <!-- 表头 -->
      <div class="gantt-header flex border-b border-apple-gray-100">
        <div class="task-name-column p-3 bg-apple-bg font-medium text-sm w-40 flex-shrink-0">任务</div>
        <div class="timeline-header flex-1 overflow-hidden">
          <div class="flex" :style="{ minWidth: `${dateColumns.length * (viewMode === 'week' ? 40 : 20)}px` }">
            <div
              v-for="(date, index) in dateColumns"
              :key="index"
              class="text-center text-xs py-2 border-r border-apple-gray-100 flex-shrink-0"
              :class="[
                viewMode === 'week' ? 'w-10' : 'w-5',
                isToday(date) ? 'bg-apple-blue-light text-apple-blue font-medium' : '',
                isWeekend(date) ? 'bg-apple-bg/50' : ''
              ]"
            >
              {{ formatDate(date) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 任务行 -->
      <div class="gantt-body">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="gantt-row flex border-b border-apple-gray-100 hover:bg-apple-bg/30"
        >
          <!-- 任务名称 -->
          <div class="task-name-column p-3 w-40 flex-shrink-0 border-r border-apple-gray-100">
            <p class="text-sm font-medium truncate">{{ task.name }}</p>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-16 progress-bar h-1.5">
                <div class="fill h-full rounded-full" :style="{ width: task.progress + '%' }"></div>
              </div>
              <span class="text-xs text-apple-gray-400">{{ task.progress }}%</span>
            </div>
          </div>

          <!-- 时间轴 -->
          <div class="timeline flex-1 relative overflow-hidden">
            <div
              class="flex h-full"
              :style="{ minWidth: `${dateColumns.length * (viewMode === 'week' ? 40 : 20)}px` }"
            >
              <!-- 日期网格 -->
              <div
                v-for="(date, index) in dateColumns"
                :key="index"
                class="border-r border-apple-gray-100 flex-shrink-0"
                :class="[
                  viewMode === 'week' ? 'w-10' : 'w-5',
                  isToday(date) ? 'bg-apple-blue-light/30' : '',
                  isWeekend(date) ? 'bg-apple-bg/30' : ''
                ]"
              ></div>

              <!-- 任务条 -->
              <div
                class="absolute top-1/2 -translate-y-1/2 h-6 rounded-apple-sm cursor-pointer hover:opacity-80 transition-opacity"
                :style="{
                  left: getTaskPosition(task).left,
                  width: getTaskPosition(task).width,
                  backgroundColor: task.color || '#007AFF'
                }"
              >
                <div class="h-full bg-white/20 rounded-apple-sm overflow-hidden">
                  <div
                    class="h-full bg-white/30"
                    :style="{ width: task.progress + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图例 -->
    <div class="flex items-center gap-6 mt-4 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-apple-blue"></div>
        <span class="text-apple-gray-400">进行中</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-apple-green"></div>
        <span class="text-apple-gray-400">已完成</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-apple-orange"></div>
        <span class="text-apple-gray-400">未开始</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gantt-container {
  overflow-x: auto;
}

.gantt-chart {
  min-width: 600px;
}

.task-name-column {
  position: sticky;
  left: 0;
  z-index: 10;
}

.timeline-header {
  overflow-x: auto;
  scrollbar-width: none;
}

.timeline-header::-webkit-scrollbar {
  display: none;
}
</style>
