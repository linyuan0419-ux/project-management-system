<script setup lang="ts">
import { ref, computed } from 'vue'
import { FileText, Download, CheckCircle, RefreshCw, Sparkles } from '@lucide/vue'

const currentWeek = ref('2024年第12周 (3月18日 - 3月24日)')
const reportStatus = ref<'draft' | 'submitted'>('draft')
const isGenerating = ref(false)

// 原始数据（模拟从数据库获取）
const rawData = ref({
  tasks: [
    { id: 1, name: '确认活动方案', project: '某品牌新品发布会', status: 'completed', completedAt: '2024-03-19' },
    { id: 2, name: '主视觉设计', project: '某品牌新品发布会', status: 'completed', completedAt: '2024-03-20' },
    { id: 3, name: '展台搭建招标', project: '某品牌新品发布会', status: 'completed', completedAt: '2024-03-18' },
    { id: 4, name: '供应商合同签订', project: '某品牌新品发布会', status: 'in-progress', completedAt: null },
    { id: 5, name: '物料制作跟进', project: '某品牌新品发布会', status: 'pending', completedAt: null },
    { id: 6, name: '场地勘察', project: '年度经销商大会', status: 'completed', completedAt: '2024-03-19' },
    { id: 7, name: '流程策划', project: '年度经销商大会', status: 'completed', completedAt: '2024-03-21' },
    { id: 8, name: '嘉宾邀请', project: '年度经销商大会', status: 'overdue', completedAt: null },
  ],
  projects: [
    { id: 1, name: '某品牌新品发布会', progress: 65, lastWeekProgress: 45 },
    { id: 2, name: '年度经销商大会', progress: 80, lastWeekProgress: 70 },
    { id: 3, name: '展厅设计提案', progress: 40, lastWeekProgress: 20 },
  ],
  suppliers: [
    { name: 'XX展览工厂', action: '合同签订', amount: 120000 },
    { name: 'XX印刷公司', action: '结算完成', amount: 32000 },
  ]
})

// 自动生成的周报内容
const generatedReport = computed(() => {
  const completed = rawData.value.tasks.filter(t => t.status === 'completed')
  const inProgress = rawData.value.tasks.filter(t => t.status === 'in-progress')
  const overdue = rawData.value.tasks.filter(t => t.status === 'overdue')
  
  return {
    completedTasks: completed.length,
    inProgressTasks: inProgress.length,
    overdueTasks: overdue.length,
    completedList: completed.map(t => `【${t.project}】${t.name}`),
    inProgressList: inProgress.map(t => `【${t.project}】${t.name}（进行中）`),
    overdueList: overdue.map(t => `【${t.project}】${t.name}（已逾期）`),
  }
})

// 本周统计数据
const weekStats = computed(() => ({
  completedTasks: generatedReport.value.completedTasks,
  inProgressTasks: generatedReport.value.inProgressTasks,
  overdueTasks: generatedReport.value.overdueTasks,
  newProjects: 1,
  completedProjects: 0,
}))

// 本周项目进展
const projectUpdates = computed(() => 
  rawData.value.projects.map(p => ({
    name: p.name,
    progress: p.progress,
    lastWeek: p.lastWeekProgress,
    change: `+${p.progress - p.lastWeekProgress}%`
  }))
)

// 下周计划（可编辑）
const nextWeekPlans = ref([
  '完成某品牌新品发布会的供应商确认',
  '年度经销商大会现场搭建进场',
  '提交展厅设计提案终稿',
])

const newPlan = ref('')
const addPlan = () => {
  if (newPlan.value.trim()) {
    nextWeekPlans.value.push(newPlan.value.trim())
    newPlan.value = ''
  }
}
const removePlan = (index: number) => {
  nextWeekPlans.value.splice(index, 1)
}

// 历史周报
const historyReports = ref([
  { week: '2024年第11周', status: '已提交', date: '2024-03-15' },
  { week: '2024年第10周', status: '已提交', date: '2024-03-08' },
  { week: '2024年第9周', status: '已提交', date: '2024-03-01' },
])

// 自动生成周报
const generateReport = async () => {
  isGenerating.value = true
  // 模拟生成过程
  await new Promise(resolve => setTimeout(resolve, 1500))
  isGenerating.value = false
}

// 导出周报
const exportReport = () => {
  const content = `
# ${currentWeek.value} 工作周报

## 一、本周工作总结

### 已完成任务（${weekStats.value.completedTasks}项）
${generatedReport.value.completedList.map(item => `- ${item}`).join('\n')}

### 进行中任务（${weekStats.value.inProgressTasks}项）
${generatedReport.value.inProgressList.map(item => `- ${item}`).join('\n')}

### 逾期任务（${weekStats.value.overdueTasks}项）
${generatedReport.value.overdueList.map(item => `- ${item}`).join('\n') || '无'}

## 二、项目进展
${projectUpdates.value.map(p => `- ${p.name}：进度 ${p.progress}%（较上周${p.change}）`).join('\n')}

## 三、下周计划
${nextWeekPlans.value.map((plan, i) => `${i + 1}. ${plan}`).join('\n')}

## 四、供应商动态
${rawData.value.suppliers.map(s => `- ${s.name}：${s.action}`).join('\n')}
  `.trim()
  
  // 创建下载
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `周报-${currentWeek.value}.md`
  a.click()
  URL.revokeObjectURL(url)
}
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
          <button 
            @click="generateReport"
            :disabled="isGenerating"
            class="flex items-center gap-2 px-4 py-2 border border-apple-blue text-apple-blue rounded-apple-sm text-body hover:bg-apple-blue-light transition-colors"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isGenerating }" />
            <span>{{ isGenerating ? '生成中...' : '重新生成' }}</span>
          </button>
          <button 
            @click="exportReport"
            class="flex items-center gap-2 px-4 py-2 border border-apple-gray-100 rounded-apple-sm text-body hover:bg-apple-bg transition-colors"
          >
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

      <!-- 自动生成提示 -->
      <div class="flex items-center gap-3 p-4 bg-apple-blue-light rounded-apple-sm mb-6">
        <Sparkles class="w-5 h-5 text-apple-blue" />
        <p class="text-body text-apple-blue">本周报已根据本周项目数据自动生成，你可以直接编辑修改</p>
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

        <!-- 自动生成的工作总结 -->
        <div class="card">
          <h4 class="text-title-2 mb-4">本周工作总结（自动生成）</h4>
          <div class="space-y-4">
            <div v-if="generatedReport.completedList.length > 0">
              <h5 class="text-body font-medium mb-2 text-apple-green">✓ 已完成任务</h5>
              <ul class="space-y-1 pl-4">
                <li v-for="(item, index) in generatedReport.completedList" :key="index" class="text-body text-apple-gray-900">• {{ item }}</li>
              </ul>
            </div>
            <div v-if="generatedReport.inProgressList.length > 0">
              <h5 class="text-body font-medium mb-2 text-apple-blue">→ 进行中任务</h5>
              <ul class="space-y-1 pl-4">
                <li v-for="(item, index) in generatedReport.inProgressList" :key="index" class="text-body text-apple-gray-900">• {{ item }}</li>
              </ul>
            </div>
            <div v-if="generatedReport.overdueList.length > 0">
              <h5 class="text-body font-medium mb-2 text-apple-red">⚠ 逾期任务</h5>
              <ul class="space-y-1 pl-4">
                <li v-for="(item, index) in generatedReport.overdueList" :key="index" class="text-body text-apple-gray-900">• {{ item }}</li>
              </ul>
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
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-title-2">下周计划</h4>
            <span class="text-caption text-apple-gray-400">{{ nextWeekPlans.length }} 项</span>
          </div>
          <div class="space-y-3">
            <div 
              v-for="(plan, index) in nextWeekPlans" 
              :key="index"
              class="flex items-start gap-3 p-3 bg-apple-bg rounded-apple-sm group"
            >
              <span class="text-apple-blue font-medium mt-0.5">{{ index + 1 }}.</span>
              <p class="text-body flex-1">{{ plan }}</p>
              <button @click="removePlan(index)" class="text-apple-gray-400 hover:text-apple-red transition-colors opacity-0 group-hover:opacity-100">×</button>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-4">
            <input 
              v-model="newPlan" 
              @keyup.enter="addPlan"
              type="text" 
              class="flex-1 px-4 py-2 border border-apple-gray-100 rounded-apple-sm text-body focus:outline-none focus:border-apple-blue" 
              placeholder="添加下周计划..."
            >
            <button @click="addPlan" class="btn-primary px-4">+</button>
          </div>
        </div>

        <!-- 供应商动态 -->
        <div class="card">
          <h4 class="text-title-2 mb-4">供应商动态</h4>
          <div class="space-y-3">
            <div v-for="supplier in rawData.suppliers" :key="supplier.name" class="flex items-center justify-between p-3 bg-apple-bg rounded-apple-sm">
              <div>
                <p class="text-body font-medium">{{ supplier.name }}</p>
                <p class="text-caption">{{ supplier.action }}</p>
              </div>
              <span class="text-body font-mono">¥{{ supplier.amount.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：历史周报 -->
      <div class="space-y-6">
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

        <!-- 快捷操作 -->
        <div class="card">
          <h4 class="text-title-2 mb-4">快捷操作</h4>
          <div class="space-y-3">
            <button class="w-full p-3 bg-apple-bg rounded-apple-sm text-body hover:bg-apple-gray-100 transition-colors text-left">
              📋 复制上周框架
            </button>
            <button class="w-full p-3 bg-apple-bg rounded-apple-sm text-body hover:bg-apple-gray-100 transition-colors text-left">
              📧 发送给领导
            </button>
            <button class="w-full p-3 bg-apple-bg rounded-apple-sm text-body hover:bg-apple-gray-100 transition-colors text-left">
              🖨️ 打印预览
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
