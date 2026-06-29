<script setup lang="ts">
import { ref } from 'vue'
import { FileText, Download, CheckCircle } from '@lucide/vue'

const currentWeek = ref('2024年第12周 (3月18日 - 3月24日)')
const reportStatus = ref<'draft' | 'submitted'>('draft')

// 本周统计数据
const weekStats = {
  completedTasks: 12,
  inProgressTasks: 8,
  overdueTasks: 2,
  newProjects: 1,
  completedProjects: 0,
}

// 本周项目进展
const projectUpdates = [
  { name: '某品牌新品发布会', progress: 65, lastWeek: 45, change: '+20%' },
  { name: '年度经销商大会', progress: 80, lastWeek: 70, change: '+10%' },
  { name: '展厅设计提案', progress: 40, lastWeek: 20, change: '+20%' },
]

// 下周计划
const nextWeekPlans = ref([
  '完成某品牌新品发布会的供应商确认',
  '年度经销商大会现场搭建进场',
  '提交展厅设计提案终稿',
])

// 历史周报
const historyReports = [
  { week: '2024年第11周', status: '已提交', date: '2024-03-15' },
  { week: '2024年第10周', status: '已提交', date: '2024-03-08' },
  { week: '2024年第9周', status: '已提交', date: '2024-03-01' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- 当前周报状态 -->
    <div class="card">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-apple-blue-light rounded-apple-sm">
            <FileText class="w-6 h-6 text-apple-blue" />
          </div>
          <div>
            <h3 class="text-title-1">{{ currentWeek }}</h3>
            <p class="text-caption">周报 {{ reportStatus === 'draft' ? '草稿' : '已提交' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="flex items-center gap-2 px-4 py-2 border border-apple-gray-100 rounded-apple-sm text-body hover:bg-apple-bg transition-colors">
            <Download class="w-4 h-4" />
            <span>导出</span>
          </button>
          <button 
            v-if="reportStatus === 'draft'"
            @click="reportStatus = 'submitted'"
            class="btn-primary flex items-center gap-2"
          >
            <CheckCircle class="w-4 h-4" />
            <span>提交周报</span>
          </button>
          <span v-else class="tag tag-green flex items-center gap-1">
            <CheckCircle class="w-3 h-3" />
            已提交
          </span>
        </div>
      </div>
    </div>

    <!-- 周报内容编辑区 -->
    <div class="grid grid-cols-3 gap-6">
      <!-- 左侧：数据统计和项目进展 -->
      <div class="col-span-2 space-y-6">
        <!-- 本周统计 -->
        <div class="card">
          <h4 class="text-title-2 mb-4">本周统计</h4>
          <div class="grid grid-cols-5 gap-4">
            <div class="text-center p-4 bg-apple-bg rounded-apple-sm">
              <p class="text-display text-2xl">{{ weekStats.completedTasks }}</p>
              <p class="text-caption">完成任务</p>
            </div>
            <div class="text-center p-4 bg-apple-bg rounded-apple-sm">
              <p class="text-display text-2xl">{{ weekStats.inProgressTasks }}</p>
              <p class="text-caption">进行中</p>
            </div>
            <div class="text-center p-4 bg-apple-bg rounded-apple-sm">
              <p class="text-display text-2xl text-apple-red">{{ weekStats.overdueTasks }}</p>
              <p class="text-caption">逾期</p>
            </div>
            <div class="text-center p-4 bg-apple-bg rounded-apple-sm">
              <p class="text-display text-2xl">{{ weekStats.newProjects }}</p>
              <p class="text-caption">新增项目</p>
            </div>
            <div class="text-center p-4 bg-apple-bg rounded-apple-sm">
              <p class="text-display text-2xl">{{ weekStats.completedProjects }}</p>
              <p class="text-caption">完成项目</p>
            </div>
          </div>
        </div>

        <!-- 项目进展 -->
        <div class="card">
          <h4 class="text-title-2 mb-4">项目进展</h4>
          <div class="space-y-4">
            <div v-for="project in projectUpdates" :key="project.name" class="p-4 bg-apple-bg rounded-apple-sm">
              <div class="flex items-center justify-between mb-2">
                <span class="text-body font-medium">{{ project.name }}</span>
                <span class="text-caption text-apple-green">{{ project.change }}</span>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex-1 progress-bar">
                  <div class="fill" :style="{ width: project.progress + '%' }"></div>
                </div>
                <span class="text-caption w-12 text-right">{{ project.progress }}%</span>
              </div>
              <p class="text-caption mt-2">上周：{{ project.lastWeek }}%</p>
            </div>
          </div>
        </div>

        <!-- 下周计划 -->
        <div class="card">
          <h4 class="text-title-2 mb-4">下周计划</h4>
          <div class="space-y-3">
            <div 
              v-for="(plan, index) in nextWeekPlans" 
              :key="index"
              class="flex items-start gap-3 p-3 bg-apple-bg rounded-apple-sm"
            >
              <span class="text-apple-blue font-medium">{{ index + 1 }}.</span>
              <p class="text-body flex-1">{{ plan }}</p>
              <button class="text-apple-gray-400 hover:text-apple-red transition-colors">×</button>
            </div>
          </div>
          <button class="mt-4 flex items-center gap-2 text-apple-blue hover:text-apple-blue-hover transition-colors">
            <span>+</span>
            <span>添加计划</span>
          </button>
        </div>
      </div>

      <!-- 右侧：历史周报 -->
      <div class="card h-fit">
        <h4 class="text-title-2 mb-4">历史周报</h4>
        <div class="space-y-3">
          <div 
            v-for="report in historyReports" 
            :key="report.week"
            class="flex items-center justify-between p-3 bg-apple-bg rounded-apple-sm cursor-pointer hover:bg-apple-gray-100 transition-colors"
          >
            <div>
              <p class="text-body font-medium">{{ report.week }}</p>
              <p class="text-caption">{{ report.date }}</p>
            </div>
            <span class="tag tag-green">{{ report.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
