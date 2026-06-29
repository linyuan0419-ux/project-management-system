<script setup lang="ts">
import { ref } from 'vue'
import { CheckSquare, AlertCircle, Briefcase, Clock } from '@lucide/vue'

// 概览数据
const stats = [
  { label: '进行中项目', value: 5, change: '+2', icon: Briefcase, color: 'blue' },
  { label: '今日待办', value: 8, change: '3已完成', icon: CheckSquare, color: 'green' },
  { label: '逾期任务', value: 2, change: '需关注', icon: AlertCircle, color: 'red' },
  { label: '本周周报', value: '未提交', change: '周五截止', icon: Clock, color: 'orange' },
]

// 进行中项目
const activeProjects = [
  { id: 1, name: '某品牌新品发布会', client: 'ABC科技', stage: '供应商制作', progress: 65, daysLeft: 12, suppliers: 4, unpaid: 2, color: '#007AFF' },
  { id: 2, name: '年度经销商大会', client: 'XYZ汽车', stage: '现场搭建', progress: 80, daysLeft: 5, suppliers: 6, unpaid: 3, color: '#34C759' },
  { id: 3, name: '展厅设计提案', client: 'DEF地产', stage: '创意策展', progress: 40, daysLeft: 20, suppliers: 2, unpaid: 1, color: '#FF9500' },
]

// 今日待办
const todayTasks = [
  { id: 1, title: '确认展台搭建方案', project: '某品牌新品发布会', type: 'my', priority: 'high' },
  { id: 2, title: '支付尾款给搭建商', project: '年度经销商大会', type: 'finance', priority: 'high' },
  { id: 3, title: '跟进物料制作进度', project: '某品牌新品发布会', type: 'supplier', priority: 'normal' },
]

// 最近动态
const recentActivities = [
  { id: 1, content: '创建了项目 "某品牌新品发布会"', time: '2小时前' },
  { id: 2, content: '更新了 "年度经销商大会" 进度至 80%', time: '4小时前' },
  { id: 3, content: '添加了供应商 "XX展览工厂"', time: '昨天' },
]
</script>

<template>
  <div class="space-y-8">
    <!-- 数据概览卡片 -->
    <div class="grid grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="card">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-caption mb-1">{{ stat.label }}</p>
            <p class="text-display">{{ stat.value }}</p>
            <p class="text-caption mt-2" :class="{
              'text-apple-green': stat.color === 'green',
              'text-apple-red': stat.color === 'red',
              'text-apple-orange': stat.color === 'orange',
              'text-apple-blue': stat.color === 'blue',
            }">{{ stat.change }}</p>
          </div>
          <div class="p-3 rounded-apple-sm" :class="{
            'bg-apple-blue-light': stat.color === 'blue',
            'bg-green-50': stat.color === 'green',
            'bg-red-50': stat.color === 'red',
            'bg-orange-50': stat.color === 'orange',
          }">
            <component :is="stat.icon" class="w-6 h-6" :class="{
              'text-apple-blue': stat.color === 'blue',
              'text-apple-green': stat.color === 'green',
              'text-apple-red': stat.color === 'red',
              'text-apple-orange': stat.color === 'orange',
            }" />
          </div>
        </div>
      </div>
    </div>

    <!-- 项目冲刺走廊 -->
    <section>
      <h3 class="text-title-1 mb-6">进行中项目</h3>
      <div class="grid grid-cols-3 gap-6">
        <div v-for="project in activeProjects" :key="project.id" class="card cursor-pointer">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-1 h-8 rounded-full" :style="{ backgroundColor: project.color }"></div>
            <div>
              <p class="text-title-2">{{ project.name }}</p>
              <p class="text-caption">{{ project.client }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2 mb-4">
            <span class="tag" :class="{
              'tag-orange': project.stage === '创意策展',
              'tag-blue': project.stage === '供应商制作',
              'tag-green': project.stage === '现场搭建',
            }">{{ project.stage }}</span>
            <span class="tag tag-red" v-if="project.daysLeft <= 7">{{ project.daysLeft }}天后截止</span>
            <span class="tag tag-orange" v-else-if="project.daysLeft <= 14">{{ project.daysLeft }}天后截止</span>
            <span class="tag tag-gray" v-else>{{ project.daysLeft }}天后截止</span>
          </div>

          <div class="mb-4">
            <div class="flex items-center justify-between text-caption mb-2">
              <span>进度</span>
              <span>{{ project.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="fill" :style="{ width: project.progress + '%', backgroundColor: project.color }"></div>
            </div>
          </div>

          <div class="flex items-center justify-between text-caption">
            <span>{{ project.suppliers }}家供应商</span>
            <span v-if="project.unpaid > 0" class="text-apple-red">{{ project.unpaid }}家未结清</span>
            <span v-else class="text-apple-green">已结清</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 今日行动清单 + 最近动态 -->
    <div class="grid grid-cols-2 gap-6">
      <!-- 今日待办 -->
      <section class="card">
        <h3 class="text-title-1 mb-6">今日行动</h3>
        <div class="space-y-4">
          <div v-for="task in todayTasks" :key="task.id" class="flex items-start gap-3 p-3 rounded-apple-sm hover:bg-apple-bg transition-colors cursor-pointer">
            <div class="w-2 h-2 rounded-full mt-2" :class="{
              'bg-apple-red': task.priority === 'high',
              'bg-apple-orange': task.priority === 'normal',
            }"></div>
            <div class="flex-1">
              <p class="text-body font-medium">{{ task.title }}</p>
              <p class="text-caption">{{ task.project }}</p>
            </div>
            <span class="tag" :class="{
              'tag-red': task.type === 'finance',
              'tag-blue': task.type === 'my',
              'tag-orange': task.type === 'supplier',
            }">
              {{ task.type === 'finance' ? '财务' : task.type === 'my' ? '待办' : '供应商' }}
            </span>
          </div>
        </div>
      </section>

      <!-- 最近动态 -->
      <section class="card">
        <h3 class="text-title-1 mb-6">最近动态</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start gap-3">
            <div class="w-2 h-2 rounded-full bg-apple-blue mt-2"></div>
            <div>
              <p class="text-body">{{ activity.content }}</p>
              <p class="text-caption">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
