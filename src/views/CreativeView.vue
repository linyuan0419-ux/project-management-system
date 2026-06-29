<script setup lang="ts">
import { ref, computed } from 'vue'
import { Palette, Box, Lightbulb, Calendar, CheckSquare } from '@lucide/vue'

// 创意工作类型
const creativeTypes = [
  { id: 'graphic', name: '平面设计', icon: Palette, color: '#007AFF' },
  { id: '3d', name: '3D设计', icon: Box, color: '#5856D6' },
  { id: 'planning', name: '策划', icon: Lightbulb, color: '#FF9500' },
]

// 工作排期数据
const schedules = ref([
  {
    id: 1,
    projectName: '某品牌新品发布会',
    type: 'graphic',
    task: '主视觉设计',
    startDate: '2024-03-20',
    endDate: '2024-03-25',
    status: '进行中',
    progress: 60,
    designer: '小王',
    content: '发布会主KV、邀请函、背景板设计',
  },
  {
    id: 2,
    projectName: '某品牌新品发布会',
    type: '3d',
    task: '展台3D建模',
    startDate: '2024-03-22',
    endDate: '2024-03-28',
    status: '未开始',
    progress: 0,
    designer: '小李',
    content: '展台结构、材质、灯光效果设计',
  },
  {
    id: 3,
    projectName: '年度经销商大会',
    type: 'planning',
    task: '活动流程策划',
    startDate: '2024-03-18',
    endDate: '2024-03-22',
    status: '已完成',
    progress: 100,
    designer: '小张',
    content: '活动流程、嘉宾致辞、互动环节策划',
  },
])

const activeType = ref('all')
const viewMode = ref<'calendar' | 'list'>('list')

const filteredSchedules = computed(() => {
  if (activeType.value === 'all') return schedules.value
  return schedules.value.filter(s => s.type === activeType.value)
})

// 获取本周日期
const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const currentWeek = ref('2024年3月18日 - 3月24日')
</script>

<template>
  <div class="space-y-6">
    <!-- 顶部统计卡片 -->
    <div class="grid grid-cols-4 gap-6">
      <div v-for="type in creativeTypes" :key="type.id" class="card cursor-pointer hover:shadow-apple-hover" @click="activeType = type.id">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-apple-sm" :style="{ backgroundColor: type.color + '20' }">
            <component :is="type.icon" class="w-6 h-6" :style="{ color: type.color }" />
          </div>
          <div>
            <p class="text-caption mb-1">{{ type.name }}</p>
            <p class="text-display text-2xl">{{ schedules.filter(s => s.type === type.id).length }}</p>
          </div>
        </div>
      </div>
      <div class="card cursor-pointer" :class="{ 'ring-2 ring-apple-blue': activeType === 'all' }" @click="activeType = 'all'">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-apple-sm bg-apple-bg">
            <CheckSquare class="w-6 h-6 text-apple-gray-400" />
          </div>
          <div>
            <p class="text-caption mb-1">全部工作</p>
            <p class="text-display text-2xl">{{ schedules.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 视图切换和筛选 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 bg-white rounded-apple-sm p-1 shadow-apple">
        <button
          @click="viewMode = 'list'"
          class="px-4 py-2 rounded-apple-sm text-body transition-all"
          :class="viewMode === 'list' ? 'bg-apple-blue text-white' : 'text-apple-gray-400 hover:text-apple-gray-900'"
        >
          列表视图
        </button>
        <button
          @click="viewMode = 'calendar'"
          class="px-4 py-2 rounded-apple-sm text-body transition-all"
          :class="viewMode === 'calendar' ? 'bg-apple-blue text-white' : 'text-apple-gray-400 hover:text-apple-gray-900'"
        >
          日历视图
        </button>
      </div>
      <button class="btn-primary flex items-center gap-2">
        <span>+</span>
        <span>新建排期</span>
      </button>
    </div>

    <!-- 列表视图 -->
    <div v-if="viewMode === 'list'" class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-apple-bg">
          <tr>
            <th class="text-left p-4 text-caption font-medium">项目</th>
            <th class="text-left p-4 text-caption font-medium">类型</th>
            <th class="text-left p-4 text-caption font-medium">工作内容</th>
            <th class="text-left p-4 text-caption font-medium">设计师</th>
            <th class="text-left p-4 text-caption font-medium">时间周期</th>
            <th class="text-left p-4 text-caption font-medium">进度</th>
            <th class="text-left p-4 text-caption font-medium">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="schedule in filteredSchedules" :key="schedule.id" class="border-t border-apple-gray-100 hover:bg-apple-bg/50 cursor-pointer transition-colors">
            <td class="p-4">
              <p class="text-body font-medium">{{ schedule.projectName }}</p>
            </td>
            <td class="p-4">
              <span class="tag" :style="{ 
                backgroundColor: creativeTypes.find(t => t.id === schedule.type)?.color + '20',
                color: creativeTypes.find(t => t.id === schedule.type)?.color
              }">
                {{ creativeTypes.find(t => t.id === schedule.type)?.name }}
              </span>
            </td>
            <td class="p-4">
              <p class="text-body font-medium">{{ schedule.task }}</p>
              <p class="text-caption">{{ schedule.content }}</p>
            </td>
            <td class="p-4 text-body">{{ schedule.designer }}</td>
            <td class="p-4">
              <p class="text-body">{{ schedule.startDate }} ~</p>
              <p class="text-body">{{ schedule.endDate }}</p>
            </td>
            <td class="p-4">
              <div class="w-24 progress-bar">
                <div class="fill" :style="{ width: schedule.progress + '%' }"></div>
              </div>
              <span class="text-caption">{{ schedule.progress }}%</span>
            </td>
            <td class="p-4">
              <span class="tag" :class="{
                'tag-green': schedule.status === '已完成',
                'tag-blue': schedule.status === '进行中',
                'tag-gray': schedule.status === '未开始',
              }">{{ schedule.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 日历视图 -->
    <div v-else class="card">
      <div class="flex items-center justify-between mb-6">
        <h4 class="text-title-2">{{ currentWeek }}</h4>
        <div class="flex items-center gap-2">
          <button class="p-2 hover:bg-apple-bg rounded-apple-sm transition-colors">←</button>
          <button class="p-2 hover:bg-apple-bg rounded-apple-sm transition-colors">→</button>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-4">
        <div v-for="day in weekDays" :key="day" class="text-center">
          <p class="text-caption mb-2">{{ day }}</p>
          <div class="min-h-[120px] bg-apple-bg rounded-apple-sm p-2 space-y-2">
            <div v-for="schedule in filteredSchedules" :key="schedule.id" 
                 class="p-2 rounded-apple-sm text-xs cursor-pointer hover:opacity-80 transition-opacity"
                 :style="{ 
                   backgroundColor: creativeTypes.find(t => t.id === schedule.type)?.color + '20',
                   color: creativeTypes.find(t => t.id === schedule.type)?.color
                 }">
              {{ schedule.task }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
