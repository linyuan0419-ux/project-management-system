<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Calendar, CheckSquare, Users, DollarSign, FileText, Activity, Edit, Trash2, X, Check, Palette } from '@lucide/vue'
import SimpleGantt from '../components/SimpleGantt.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const projectId = route.params.id

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', name: '概览', icon: Activity },
  { id: 'gantt', name: '甘特图', icon: Calendar },
  { id: 'tasks', name: '任务', icon: CheckSquare },
  { id: 'creative', name: '创意排期', icon: Palette },
  { id: 'suppliers', name: '供应商', icon: Users },
  { id: 'quotes', name: '报价', icon: DollarSign },
  { id: 'files', name: '文件', icon: FileText },
]

// 项目基本信息
const project = ref({
  id: 1,
  name: '某品牌新品发布会',
  client: 'ABC科技',
  stage: '供应商制作',
  progress: 65,
  startDate: '2024-03-01',
  endDate: '2024-04-15',
  budget: 500000,
  description: '为ABC科技举办春季新品发布会，包含舞台搭建、灯光音响、物料制作等。',
})

// 任务列表
const tasks = ref([
  { id: 1, name: '确认活动方案', assignee: '我', deadline: '2024-03-10', status: 'completed', priority: 'high' },
  { id: 2, name: '主视觉设计', assignee: '小王', deadline: '2024-03-25', status: 'in-progress', priority: 'high' },
  { id: 3, name: '展台搭建招标', assignee: '我', deadline: '2024-03-20', status: 'completed', priority: 'medium' },
  { id: 4, name: '供应商合同签订', assignee: '我', deadline: '2024-03-22', status: 'overdue', priority: 'high' },
  { id: 5, name: '物料制作跟进', assignee: '小李', deadline: '2024-04-05', status: 'pending', priority: 'medium' },
])

// 供应商列表
const suppliers = ref([
  { 
    id: 1, 
    name: 'XX展览工厂', 
    contact: '张工 13800138000',
    contractAmount: 120000,
    prepayment: 60000,
    finalPayment: 60000,
    settlement: 118000,
    status: '合作中'
  },
  { 
    id: 2, 
    name: 'XX印刷公司', 
    contact: '李经理 13900139000',
    contractAmount: 35000,
    prepayment: 35000,
    finalPayment: 0,
    settlement: 32000,
    status: '已结算'
  },
  { 
    id: 3, 
    name: 'XX灯光音响', 
    contact: '王总 13700137000',
    contractAmount: 80000,
    prepayment: 40000,
    finalPayment: 40000,
    settlement: 0,
    status: '合作中'
  },
])

// 计算汇总
const totalContract = suppliers.value.reduce((sum, s) => sum + s.contractAmount, 0)
const totalSettlement = suppliers.value.reduce((sum, s) => sum + s.settlement, 0)
const totalPrepayment = suppliers.value.reduce((sum, s) => sum + s.prepayment, 0)
const totalFinal = suppliers.value.reduce((sum, s) => sum + s.finalPayment, 0)
const unpaidCount = suppliers.value.filter(s => s.status === '合作中').length

// 创意排期数据（与创意部关联）
const creativeSchedules = ref([
  { id: 1, type: 'graphic', task: '主视觉设计', designer: '小王', startDate: '2024-03-20', endDate: '2024-03-25', status: '进行中', progress: 60, content: '发布会主KV、邀请函、背景板设计' },
  { id: 2, type: '3d', task: '展台3D建模', designer: '小李', startDate: '2024-03-22', endDate: '2024-03-28', status: '未开始', progress: 0, content: '展台结构、材质、灯光效果设计' },
])

// 创意类型映射
const creativeTypeMap: Record<string, { name: string, color: string }> = {
  graphic: { name: '平面设计', color: '#007AFF' },
  '3d': { name: '3D设计', color: '#5856D6' },
  planning: { name: '策划', color: '#FF9500' },
}

// 项目动态
const activities = [
  { id: 1, content: '更新了项目进度至 65%', time: '2小时前', user: '我' },
  { id: 2, content: '添加了供应商 "XX灯光音响"', time: '昨天', user: '我' },
  { id: 3, content: '完成了任务 "展台搭建招标"', time: '2天前', user: '我' },
  { id: 4, content: '创建了项目', time: '7天前', user: '我' },
]

// 新建任务弹窗
const showNewTaskModal = ref(false)
const newTask = ref({ name: '', assignee: '', deadline: '', priority: 'medium' })

// 新建供应商弹窗
const showNewSupplierModal = ref(false)
const newSupplier = ref({ 
  name: '', contact: '', contractAmount: 0, prepayment: 0, finalPayment: 0, settlement: 0 
})

// 报价数据
const quotes = ref([
  { id: 1, name: '舞台搭建', category: '搭建', costPrice: 80000, quotePrice: 120000, quantity: 1, remark: '含基础灯光' },
  { id: 2, name: 'LED屏幕租赁', category: '搭建', costPrice: 30000, quotePrice: 45000, quantity: 1, remark: 'P3高清屏' },
  { id: 3, name: '宣传物料制作', category: '物料', costPrice: 15000, quotePrice: 25000, quantity: 1, remark: '海报、易拉宝等' },
  { id: 4, name: '主持人费用', category: '人员', costPrice: 5000, quotePrice: 8000, quantity: 1, remark: '专业主持人' },
  { id: 5, name: '摄影摄像', category: '人员', costPrice: 6000, quotePrice: 10000, quantity: 2, remark: '双机位' },
])

// 报价版本
const quoteVersions = ref([
  { id: 1, name: 'V3 - 最终报价', status: '已确认', date: '2024-03-15', amount: 458000 },
  { id: 2, name: 'V2 - 调整版', status: '草稿', date: '2024-03-10', amount: 485000 },
  { id: 3, name: 'V1 - 初版', status: '草稿', date: '2024-03-05', amount: 520000 },
])

// 报价计算
const totalQuoteCost = computed(() => quotes.value.reduce((sum, q) => sum + q.costPrice * q.quantity, 0))
const totalQuoteAmount = computed(() => quotes.value.reduce((sum, q) => sum + q.quotePrice * q.quantity, 0))
const estimatedProfit = computed(() => totalQuoteAmount.value - totalQuoteCost.value)
const profitMargin = computed(() => totalQuoteAmount.value > 0 ? Math.round((estimatedProfit.value / totalQuoteAmount.value) * 100) : 0)

// 新建报价弹窗
const showNewQuoteModal = ref(false)
const newQuote = ref({
  name: '', category: '搭建', costPrice: 0, quotePrice: 0, quantity: 1, remark: ''
})

// 甘特图数据
const ganttTasks = ref([
  { id: '1', name: '确认活动方案', start: '2024-03-01', end: '2024-03-10', progress: 100, color: '#34C759' },
  { id: '2', name: '主视觉设计', start: '2024-03-11', end: '2024-03-25', progress: 60, color: '#007AFF' },
  { id: '3', name: '展台搭建招标', start: '2024-03-15', end: '2024-03-20', progress: 100, color: '#34C759' },
  { id: '4', name: '供应商合同签订', start: '2024-03-21', end: '2024-03-25', progress: 30, color: '#007AFF' },
  { id: '5', name: '物料制作跟进', start: '2024-03-26', end: '2024-04-05', progress: 0, color: '#FF9500' },
  { id: '6', name: '现场搭建', start: '2024-04-10', end: '2024-04-14', progress: 0, color: '#FF9500' },
  { id: '7', name: '活动执行', start: '2024-04-15', end: '2024-04-15', progress: 0, color: '#FF9500' },
])

// ========== 编辑功能 ==========
// 编辑任务
const editingTask = ref<number | null>(null)
const editTaskData = ref({ name: '', assignee: '', deadline: '', priority: 'medium', status: 'pending' })

const startEditTask = (task: any) => {
  editingTask.value = task.id
  editTaskData.value = { ...task }
}

const saveTask = () => {
  const index = tasks.value.findIndex(t => t.id === editingTask.value)
  if (index !== -1) {
    tasks.value[index] = { ...tasks.value[index], ...editTaskData.value }
  }
  editingTask.value = null
}

const cancelEditTask = () => {
  editingTask.value = null
}

// 删除任务确认弹窗
const showDeleteTaskConfirm = ref(false)
const taskToDelete = ref<number | null>(null)

const openDeleteTaskConfirm = (taskId: number) => {
  taskToDelete.value = taskId
  showDeleteTaskConfirm.value = true
}

const confirmDeleteTask = () => {
  if (taskToDelete.value) {
    tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value)
    showDeleteTaskConfirm.value = false
    taskToDelete.value = null
  }
}

const cancelDeleteTask = () => {
  showDeleteTaskConfirm.value = false
  taskToDelete.value = null
}

// 编辑供应商
const editingSupplier = ref<number | null>(null)
const editSupplierData = ref({ name: '', contact: '', contractAmount: 0, prepayment: 0, finalPayment: 0, settlement: 0, status: '合作中' })

const startEditSupplier = (supplier: any) => {
  editingSupplier.value = supplier.id
  editSupplierData.value = { ...supplier }
}

const saveSupplier = () => {
  const index = suppliers.value.findIndex(s => s.id === editingSupplier.value)
  if (index !== -1) {
    suppliers.value[index] = { ...suppliers.value[index], ...editSupplierData.value }
  }
  editingSupplier.value = null
}

const cancelEditSupplier = () => {
  editingSupplier.value = null
}

// 删除供应商确认弹窗
const showDeleteSupplierConfirm = ref(false)
const supplierToDelete = ref<number | null>(null)

const openDeleteSupplierConfirm = (supplierId: number) => {
  supplierToDelete.value = supplierId
  showDeleteSupplierConfirm.value = true
}

const confirmDeleteSupplier = () => {
  if (supplierToDelete.value) {
    suppliers.value = suppliers.value.filter(s => s.id !== supplierToDelete.value)
    showDeleteSupplierConfirm.value = false
    supplierToDelete.value = null
  }
}

const cancelDeleteSupplier = () => {
  showDeleteSupplierConfirm.value = false
  supplierToDelete.value = null
}

// 编辑报价
const editingQuote = ref<number | null>(null)
const editQuoteData = ref({ name: '', category: '搭建', costPrice: 0, quotePrice: 0, quantity: 1, remark: '' })

const startEditQuote = (quote: any) => {
  editingQuote.value = quote.id
  editQuoteData.value = { ...quote }
}

const saveQuote = () => {
  const index = quotes.value.findIndex(q => q.id === editingQuote.value)
  if (index !== -1) {
    quotes.value[index] = { ...quotes.value[index], ...editQuoteData.value }
  }
  editingQuote.value = null
}

const cancelEditQuote = () => {
  editingQuote.value = null
}

// 删除报价确认弹窗
const showDeleteQuoteConfirm = ref(false)
const quoteToDelete = ref<number | null>(null)

const openDeleteQuoteConfirm = (quoteId: number) => {
  quoteToDelete.value = quoteId
  showDeleteQuoteConfirm.value = true
}

const confirmDeleteQuote = () => {
  if (quoteToDelete.value) {
    quotes.value = quotes.value.filter(q => q.id !== quoteToDelete.value)
    showDeleteQuoteConfirm.value = false
    quoteToDelete.value = null
  }
}

const cancelDeleteQuote = () => {
  showDeleteQuoteConfirm.value = false
  quoteToDelete.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- 返回按钮和标题 -->
    <div class="flex items-center gap-4">
      <button 
        @click="router.push('/projects')"
        class="flex items-center gap-2 text-apple-gray-400 hover:text-apple-gray-900 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
        <span>返回项目列表</span>
      </button>
    </div>

    <!-- 项目头部信息 -->
    <div class="card">
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-apple bg-apple-blue flex items-center justify-center text-white text-2xl font-bold">
            {{ project.name.charAt(0) }}
          </div>
          <div>
            <h2 class="text-title-1 mb-2">{{ project.name }}</h2>
            <div class="flex items-center gap-3">
              <span class="tag tag-blue">{{ project.client }}</span>
              <span class="tag tag-orange">{{ project.stage }}</span>
            </div>
            <p class="text-body text-apple-gray-400 mt-3 max-w-2xl">{{ project.description }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-caption mb-1">项目进度</p>
          <p class="text-display">{{ project.progress }}%</p>
        </div>
      </div>

      <!-- 关键信息 -->
      <div class="grid grid-cols-4 gap-6 mt-6 pt-6 border-t border-apple-gray-100">
        <div>
          <p class="text-caption mb-1">项目周期</p>
          <p class="text-body font-medium">{{ project.startDate }} ~ {{ project.endDate }}</p>
        </div>
        <div>
          <p class="text-caption mb-1">项目预算</p>
          <p class="text-body font-medium font-mono">¥{{ project.budget.toLocaleString() }}</p>
        </div>
        <div>
          <p class="text-caption mb-1">供应商</p>
          <p class="text-body font-medium">{{ suppliers.length }} 家 / <span class="text-apple-red">{{ unpaidCount }} 家未结清</span></p>
        </div>
        <div>
          <p class="text-caption mb-1">任务完成</p>
          <p class="text-body font-medium">{{ tasks.filter(t => t.status === 'completed').length }} / {{ tasks.length }}</p>
        </div>
      </div>
    </div>

    <!-- Tab 导航 -->
    <div class="flex items-center gap-2 border-b border-apple-gray-100">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="flex items-center gap-2 px-6 py-3 text-body transition-all border-b-2"
        :class="activeTab === tab.id 
          ? 'border-apple-blue text-apple-blue' 
          : 'border-transparent text-apple-gray-400 hover:text-apple-gray-900'"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <!-- 概览 Tab -->
    <div v-if="activeTab === 'overview'" class="grid grid-cols-3 gap-6">
      <!-- 左侧：进度和时间线 -->
      <div class="col-span-2 space-y-6">
        <!-- 整体进度 -->
        <div class="card">
          <h4 class="text-title-2 mb-4">整体进度</h4>
          <div class="progress-bar h-3">
            <div class="fill h-full rounded-full" :style="{ width: project.progress + '%' }"></div>
          </div>
          <div class="flex items-center justify-between mt-4">
            <div v-for="(stage, index) in ['打标', '创意', '制作', '搭建', '结案']" :key="stage" 
                 class="flex flex-col items-center">
              <div class="w-3 h-3 rounded-full mb-2" 
                   :class="index < 3 ? 'bg-apple-blue' : 'bg-apple-gray-100'"></div>
              <span class="text-caption" :class="index < 3 ? 'text-apple-blue' : 'text-apple-gray-400'">{{ stage }}</span>
            </div>
          </div>
        </div>

        <!-- 最近任务 -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-title-2">最近任务</h4>
            <button @click="activeTab = 'tasks'" class="text-apple-blue hover:text-apple-blue-hover text-body">查看全部 →</button>
          </div>
          <div class="space-y-3">
            <div v-for="task in tasks.slice(0, 3)" :key="task.id" 
                 class="flex items-center justify-between p-3 bg-apple-bg rounded-apple-sm">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full" :class="{
                  'bg-apple-green': task.status === 'completed',
                  'bg-apple-blue': task.status === 'in-progress',
                  'bg-apple-red': task.status === 'overdue',
                  'bg-apple-gray-100': task.status === 'pending'
                }"></div>
                <span class="text-body">{{ task.name }}</span>
              </div>
              <span class="text-caption">{{ task.assignee }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：动态和快捷操作 -->
      <div class="space-y-6">
        <!-- 快捷操作 -->
        <div class="card">
          <h4 class="text-title-2 mb-4">快捷操作</h4>
          <div class="space-y-3">
            <button @click="showNewTaskModal = true" class="w-full p-3 bg-apple-bg rounded-apple-sm text-body hover:bg-apple-gray-100 transition-colors text-left">
              + 新建任务
            </button>
            <button @click="showNewSupplierModal = true" class="w-full p-3 bg-apple-bg rounded-apple-sm text-body hover:bg-apple-gray-100 transition-colors text-left">
              + 添加供应商
            </button>
            <button class="w-full p-3 bg-apple-bg rounded-apple-sm text-body hover:bg-apple-gray-100 transition-colors text-left">
              + 上传文件
            </button>
          </div>
        </div>

        <!-- 项目动态 -->
        <div class="card">
          <h4 class="text-title-2 mb-4">项目动态</h4>
          <div class="space-y-4">
            <div v-for="activity in activities" :key="activity.id" class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-apple-blue mt-2"></div>
              <div>
                <p class="text-body">{{ activity.content }}</p>
                <p class="text-caption">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 甘特图 Tab -->
    <div v-else-if="activeTab === 'gantt'" class="card">
      <div class="flex items-center justify-between mb-6">
        <h4 class="text-title-2">项目甘特图</h4>
        <div class="flex items-center gap-2 text-sm text-apple-gray-400">
          <span class="w-3 h-3 rounded-full bg-apple-green"></span> 已完成
          <span class="w-3 h-3 rounded-full bg-apple-blue"></span> 进行中
          <span class="w-3 h-3 rounded-full bg-apple-orange"></span> 未开始
        </div>
      </div>
      <SimpleGantt :tasks="ganttTasks" />
    </div>

    <!-- 任务 Tab -->
    <div v-else-if="activeTab === 'tasks'" class="card overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-apple-gray-100">
        <h4 class="text-title-2">任务列表</h4>
        <button @click="showNewTaskModal = true" class="btn-primary">+ 新建任务</button>
      </div>
      <table class="w-full">
        <thead class="bg-apple-bg">
          <tr>
            <th class="text-left p-4 text-caption font-medium">任务</th>
            <th class="text-left p-4 text-caption font-medium">负责人</th>
            <th class="text-left p-4 text-caption font-medium">截止日期</th>
            <th class="text-left p-4 text-caption font-medium">优先级</th>
            <th class="text-left p-4 text-caption font-medium">状态</th>
            <th class="text-left p-4 text-caption font-medium w-24">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id" class="border-t border-apple-gray-100 hover:bg-apple-bg/50 transition-colors group">
            <!-- 编辑模式 -->
            <template v-if="editingTask === task.id">
              <td class="p-4"><input v-model="editTaskData.name" class="w-full px-2 py-1 border rounded text-sm" /></td>
              <td class="p-4"><input v-model="editTaskData.assignee" class="w-full px-2 py-1 border rounded text-sm" /></td>
              <td class="p-4"><input v-model="editTaskData.deadline" type="date" class="w-full px-2 py-1 border rounded text-sm" /></td>
              <td class="p-4">
                <select v-model="editTaskData.priority" class="px-2 py-1 border rounded text-sm">
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </td>
              <td class="p-4">
                <select v-model="editTaskData.status" class="px-2 py-1 border rounded text-sm">
                  <option value="completed">已完成</option>
                  <option value="in-progress">进行中</option>
                  <option value="overdue">已逾期</option>
                  <option value="pending">待处理</option>
                </select>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-1">
                  <button @click="saveTask" class="p-1 text-apple-green hover:bg-green-50 rounded"><Check class="w-4 h-4" /></button>
                  <button @click="cancelEditTask" class="p-1 text-apple-gray-400 hover:bg-apple-bg rounded"><X class="w-4 h-4" /></button>
                </div>
              </td>
            </template>
            <!-- 显示模式 -->
            <template v-else>
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <input type="checkbox" :checked="task.status === 'completed'" class="w-4 h-4 rounded border-apple-gray-100">
                  <span class="text-body" :class="{ 'line-through text-apple-gray-400': task.status === 'completed' }">{{ task.name }}</span>
                </div>
              </td>
              <td class="p-4 text-body">{{ task.assignee }}</td>
              <td class="p-4 text-body">{{ task.deadline }}</td>
              <td class="p-4">
                <span class="tag" :class="{
                  'tag-red': task.priority === 'high',
                  'tag-orange': task.priority === 'medium',
                  'tag-gray': task.priority === 'low'
                }">{{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}</span>
              </td>
              <td class="p-4">
                <span class="tag" :class="{
                  'tag-green': task.status === 'completed',
                  'tag-blue': task.status === 'in-progress',
                  'tag-red': task.status === 'overdue',
                  'tag-gray': task.status === 'pending'
                }">{{ task.status === 'completed' ? '已完成' : task.status === 'in-progress' ? '进行中' : task.status === 'overdue' ? '已逾期' : '待处理' }}</span>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="startEditTask(task)" class="p-1 text-apple-gray-400 hover:text-apple-blue rounded" title="编辑"><Edit class="w-4 h-4" /></button>
                  <button @click="openDeleteTaskConfirm(task.id)" class="p-1 text-apple-gray-400 hover:text-apple-red rounded" title="删除"><Trash2 class="w-4 h-4" /></button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 创意排期 Tab -->
    <div v-else-if="activeTab === 'creative'" class="card overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-apple-gray-100">
        <h4 class="text-title-2">创意排期</h4>
        <router-link to="/creative" class="btn-primary">前往创意部管理</router-link>
      </div>
      <table class="w-full">
        <thead class="bg-apple-bg">
          <tr>
            <th class="text-left p-4 text-caption font-medium">类型</th>
            <th class="text-left p-4 text-caption font-medium">工作内容</th>
            <th class="text-left p-4 text-caption font-medium">设计师</th>
            <th class="text-left p-4 text-caption font-medium">时间周期</th>
            <th class="text-left p-4 text-caption font-medium">进度</th>
            <th class="text-left p-4 text-caption font-medium">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="schedule in creativeSchedules" :key="schedule.id" class="border-t border-apple-gray-100 hover:bg-apple-bg/50 transition-colors">
            <td class="p-4">
              <span class="tag" :style="{ backgroundColor: creativeTypeMap[schedule.type]?.color + '20', color: creativeTypeMap[schedule.type]?.color }">
                {{ creativeTypeMap[schedule.type]?.name }}
              </span>
            </td>
            <td class="p-4">
              <p class="text-body font-medium">{{ schedule.task }}</p>
              <p class="text-caption text-apple-gray-400">{{ schedule.content }}</p>
            </td>
            <td class="p-4 text-body">{{ schedule.designer }}</td>
            <td class="p-4 text-body">{{ schedule.startDate }} ~ {{ schedule.endDate }}</td>
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
                'tag-gray': schedule.status === '未开始'
              }">{{ schedule.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="creativeSchedules.length === 0" class="p-8 text-center text-apple-gray-400">
        <p>暂无创意排期</p>
        <router-link to="/creative" class="text-apple-blue hover:underline mt-2 inline-block">前往创意部添加排期</router-link>
      </div>
    </div>

    <!-- 供应商 Tab -->
    <div v-else-if="activeTab === 'suppliers'" class="space-y-6">
      <!-- 财务汇总卡片 -->
      <div class="grid grid-cols-4 gap-6">
        <div class="card">
          <p class="text-caption mb-1">合同金额合计</p>
          <p class="text-display text-2xl font-mono">¥{{ totalContract.toLocaleString() }}</p>
        </div>
        <div class="card">
          <p class="text-caption mb-1">结算金额合计</p>
          <p class="text-display text-2xl font-mono">¥{{ totalSettlement.toLocaleString() }}</p>
        </div>
        <div class="card">
          <p class="text-caption mb-1">预付款合计</p>
          <p class="text-display text-2xl font-mono">¥{{ totalPrepayment.toLocaleString() }}</p>
        </div>
        <div class="card">
          <p class="text-caption mb-1">尾款合计</p>
          <p class="text-display text-2xl font-mono">¥{{ totalFinal.toLocaleString() }}</p>
        </div>
      </div>

      <!-- 供应商表格 -->
      <div class="card overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-apple-gray-100">
          <h4 class="text-title-2">供应商列表</h4>
          <button @click="showNewSupplierModal = true" class="btn-primary">+ 添加供应商</button>
        </div>
        <table class="w-full">
          <thead class="bg-apple-bg">
            <tr>
              <th class="text-left p-4 text-caption font-medium">供应商</th>
              <th class="text-left p-4 text-caption font-medium">对接人</th>
              <th class="text-right p-4 text-caption font-medium">合同金额</th>
              <th class="text-right p-4 text-caption font-medium">预付款</th>
              <th class="text-right p-4 text-caption font-medium">尾款</th>
              <th class="text-right p-4 text-caption font-medium">结算金额</th>
              <th class="text-left p-4 text-caption font-medium">状态</th>
              <th class="text-left p-4 text-caption font-medium w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="supplier in suppliers" :key="supplier.id" class="border-t border-apple-gray-100 hover:bg-apple-bg/50 transition-colors group">
              <!-- 编辑模式 -->
              <template v-if="editingSupplier === supplier.id">
                <td class="p-4"><input v-model="editSupplierData.name" class="w-full px-2 py-1 border rounded text-sm" /></td>
                <td class="p-4"><input v-model="editSupplierData.contact" class="w-full px-2 py-1 border rounded text-sm" /></td>
                <td class="p-4"><input v-model.number="editSupplierData.contractAmount" type="number" class="w-full px-2 py-1 border rounded text-sm text-right" /></td>
                <td class="p-4"><input v-model.number="editSupplierData.prepayment" type="number" class="w-full px-2 py-1 border rounded text-sm text-right" /></td>
                <td class="p-4"><input v-model.number="editSupplierData.finalPayment" type="number" class="w-full px-2 py-1 border rounded text-sm text-right" /></td>
                <td class="p-4"><input v-model.number="editSupplierData.settlement" type="number" class="w-full px-2 py-1 border rounded text-sm text-right" /></td>
                <td class="p-4">
                  <select v-model="editSupplierData.status" class="px-2 py-1 border rounded text-sm">
                    <option value="合作中">合作中</option>
                    <option value="已结算">已结算</option>
                    <option value="已终止">已终止</option>
                  </select>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-1">
                    <button @click="saveSupplier" class="p-1 text-apple-green hover:bg-green-50 rounded"><Check class="w-4 h-4" /></button>
                    <button @click="cancelEditSupplier" class="p-1 text-apple-gray-400 hover:bg-apple-bg rounded"><X class="w-4 h-4" /></button>
                  </div>
                </td>
              </template>
              <!-- 显示模式 -->
              <template v-else>
                <td class="p-4">
                  <p class="text-body font-medium">{{ supplier.name }}</p>
                </td>
                <td class="p-4 text-body">{{ supplier.contact }}</td>
                <td class="p-4 text-right font-mono text-body">¥{{ supplier.contractAmount.toLocaleString() }}</td>
                <td class="p-4 text-right font-mono text-body">¥{{ supplier.prepayment.toLocaleString() }}</td>
                <td class="p-4 text-right font-mono text-body">¥{{ supplier.finalPayment.toLocaleString() }}</td>
                <td class="p-4 text-right font-mono text-body">{{ supplier.settlement > 0 ? '¥' + supplier.settlement.toLocaleString() : '-' }}</td>
                <td class="p-4">
                  <span class="tag" :class="{
                    'tag-blue': supplier.status === '合作中',
                    'tag-green': supplier.status === '已结算',
                    'tag-gray': supplier.status === '已终止'
                  }">{{ supplier.status }}</span>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="startEditSupplier(supplier)" class="p-1 text-apple-gray-400 hover:text-apple-blue rounded" title="编辑"><Edit class="w-4 h-4" /></button>
                    <button @click="openDeleteSupplierConfirm(supplier.id)" class="p-1 text-apple-gray-400 hover:text-apple-red rounded" title="删除"><Trash2 class="w-4 h-4" /></button>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 报价 Tab -->
    <div v-else-if="activeTab === 'quotes'" class="space-y-6">
      <!-- 报价汇总 -->
      <div class="grid grid-cols-4 gap-6">
        <div class="card">
          <p class="text-caption mb-1">项目预算</p>
          <p class="text-display text-2xl font-mono">¥{{ project.budget.toLocaleString() }}</p>
        </div>
        <div class="card">
          <p class="text-caption mb-1">已报成本</p>
          <p class="text-display text-2xl font-mono">¥{{ totalQuoteCost.toLocaleString() }}</p>
        </div>
        <div class="card">
          <p class="text-caption mb-1">报价金额</p>
          <p class="text-display text-2xl font-mono">¥{{ totalQuoteAmount.toLocaleString() }}</p>
        </div>
        <div class="card">
          <p class="text-caption mb-1">预计利润</p>
          <p class="text-display text-2xl font-mono" :class="estimatedProfit >= 0 ? 'text-apple-green' : 'text-apple-red'">
            ¥{{ estimatedProfit.toLocaleString() }}
          </p>
          <p class="text-caption">{{ profitMargin }}%</p>
        </div>
      </div>

      <!-- 报价明细表 -->
      <div class="card overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-apple-gray-100">
          <h4 class="text-title-2">报价明细</h4>
          <button @click="showNewQuoteModal = true" class="btn-primary">+ 添加报价项</button>
        </div>
        <table class="w-full">
          <thead class="bg-apple-bg">
            <tr>
              <th class="text-left p-4 text-caption font-medium">报价项</th>
              <th class="text-left p-4 text-caption font-medium">类别</th>
              <th class="text-right p-4 text-caption font-medium">成本价</th>
              <th class="text-right p-4 text-caption font-medium">报价</th>
              <th class="text-right p-4 text-caption font-medium">数量</th>
              <th class="text-right p-4 text-caption font-medium">小计</th>
              <th class="text-left p-4 text-caption font-medium">备注</th>
              <th class="text-left p-4 text-caption font-medium w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="quote in quotes" :key="quote.id" class="border-t border-apple-gray-100 hover:bg-apple-bg/50 transition-colors group">
              <!-- 编辑模式 -->
              <template v-if="editingQuote === quote.id">
                <td class="p-4"><input v-model="editQuoteData.name" class="w-full px-2 py-1 border rounded text-sm" /></td>
                <td class="p-4">
                  <select v-model="editQuoteData.category" class="px-2 py-1 border rounded text-sm">
                    <option value="搭建">搭建</option>
                    <option value="物料">物料</option>
                    <option value="人员">人员</option>
                    <option value="其他">其他</option>
                  </select>
                </td>
                <td class="p-4"><input v-model.number="editQuoteData.costPrice" type="number" class="w-full px-2 py-1 border rounded text-sm text-right" /></td>
                <td class="p-4"><input v-model.number="editQuoteData.quotePrice" type="number" class="w-full px-2 py-1 border rounded text-sm text-right" /></td>
                <td class="p-4"><input v-model.number="editQuoteData.quantity" type="number" class="w-full px-2 py-1 border rounded text-sm text-right" /></td>
                <td class="p-4 text-right font-mono text-body">¥{{ (editQuoteData.quotePrice * editQuoteData.quantity).toLocaleString() }}</td>
                <td class="p-4"><input v-model="editQuoteData.remark" class="w-full px-2 py-1 border rounded text-sm" /></td>
                <td class="p-4">
                  <div class="flex items-center gap-1">
                    <button @click="saveQuote" class="p-1 text-apple-green hover:bg-green-50 rounded"><Check class="w-4 h-4" /></button>
                    <button @click="cancelEditQuote" class="p-1 text-apple-gray-400 hover:bg-apple-bg rounded"><X class="w-4 h-4" /></button>
                  </div>
                </td>
              </template>
              <!-- 显示模式 -->
              <template v-else>
                <td class="p-4">
                  <p class="text-body font-medium">{{ quote.name }}</p>
                </td>
                <td class="p-4">
                  <span class="tag" :class="{
                    'tag-blue': quote.category === '搭建',
                    'tag-orange': quote.category === '物料',
                    'tag-green': quote.category === '人员',
                    'tag-gray': quote.category === '其他'
                  }">{{ quote.category }}</span>
                </td>
                <td class="p-4 text-right font-mono text-body">¥{{ quote.costPrice.toLocaleString() }}</td>
                <td class="p-4 text-right font-mono text-body">¥{{ quote.quotePrice.toLocaleString() }}</td>
                <td class="p-4 text-right text-body">{{ quote.quantity }}</td>
                <td class="p-4 text-right font-mono text-body font-medium">¥{{ (quote.quotePrice * quote.quantity).toLocaleString() }}</td>
                <td class="p-4 text-caption">{{ quote.remark || '-' }}</td>
                <td class="p-4">
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="startEditQuote(quote)" class="p-1 text-apple-gray-400 hover:text-apple-blue rounded" title="编辑"><Edit class="w-4 h-4" /></button>
                    <button @click="openDeleteQuoteConfirm(quote.id)" class="p-1 text-apple-gray-400 hover:text-apple-red rounded" title="删除"><Trash2 class="w-4 h-4" /></button>
                  </div>
                </td>
              </template>
            </tr>
          </tbody>
          <tfoot class="bg-apple-bg font-medium">
            <tr>
              <td colspan="2" class="p-4 text-right text-body">合计</td>
              <td class="p-4 text-right font-mono">¥{{ totalQuoteCost.toLocaleString() }}</td>
              <td class="p-4 text-right font-mono">¥{{ totalQuoteAmount.toLocaleString() }}</td>
              <td colspan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- 报价版本历史 -->
      <div class="card">
        <h4 class="text-title-2 mb-4">报价版本</h4>
        <div class="space-y-3">
          <div v-for="version in quoteVersions" :key="version.id" 
               class="flex items-center justify-between p-3 bg-apple-bg rounded-apple-sm">
            <div class="flex items-center gap-4">
              <span class="text-body font-medium">{{ version.name }}</span>
              <span class="tag" :class="{
                'tag-green': version.status === '已确认',
                'tag-blue': version.status === '待确认',
                'tag-gray': version.status === '草稿'
              }">{{ version.status }}</span>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-caption">{{ version.date }}</span>
              <span class="text-body font-mono">¥{{ version.amount.toLocaleString() }}</span>
              <button class="text-apple-blue hover:text-apple-blue-hover text-body">查看</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 其他 Tab 占位 -->
    <div v-else class="card p-12 text-center">
      <p class="text-apple-gray-400 text-body">{{ tabs.find(t => t.id === activeTab)?.name }}功能开发中...</p>
    </div>

    <!-- 新建任务弹窗 -->
    <div v-if="showNewTaskModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNewTaskModal = false">
      <div class="bg-white rounded-apple p-8 w-[480px] max-w-[90vw]">
        <h4 class="text-title-1 mb-6">新建任务</h4>
        <div class="space-y-4">
          <div>
            <label class="text-caption block mb-2">任务名称</label>
            <input v-model="newTask.name" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入任务名称">
          </div>
          <div>
            <label class="text-caption block mb-2">负责人</label>
            <input v-model="newTask.assignee" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入负责人">
          </div>
          <div>
            <label class="text-caption block mb-2">截止日期</label>
            <input v-model="newTask.deadline" type="date" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
          </div>
          <div>
            <label class="text-caption block mb-2">优先级</label>
            <select v-model="newTask.priority" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-8">
          <button @click="showNewTaskModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="showNewTaskModal = false" class="btn-primary">创建</button>
        </div>
      </div>
    </div>

    <!-- 新建供应商弹窗 -->
    <div v-if="showNewSupplierModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNewSupplierModal = false">
      <div class="bg-white rounded-apple p-8 w-[480px] max-w-[90vw]">
        <h4 class="text-title-1 mb-6">添加供应商</h4>
        <div class="space-y-4">
          <div>
            <label class="text-caption block mb-2">供应商名称</label>
            <input v-model="newSupplier.name" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入供应商名称">
          </div>
          <div>
            <label class="text-caption block mb-2">对接人及联系方式</label>
            <input v-model="newSupplier.contact" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="如：张经理 13800138000">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-caption block mb-2">合同金额</label>
              <input v-model="newSupplier.contractAmount" type="number" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="0">
            </div>
            <div>
              <label class="text-caption block mb-2">预付款</label>
              <input v-model="newSupplier.prepayment" type="number" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="0">
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-8">
          <button @click="showNewSupplierModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="showNewSupplierModal = false" class="btn-primary">添加</button>
        </div>
      </div>
    </div>

    <!-- 新建报价弹窗 -->
    <div v-if="showNewQuoteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNewQuoteModal = false">
      <div class="bg-white rounded-apple p-8 w-[480px] max-w-[90vw]">
        <h4 class="text-title-1 mb-6">添加报价项</h4>
        <div class="space-y-4">
          <div>
            <label class="text-caption block mb-2">报价项名称</label>
            <input v-model="newQuote.name" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="如：舞台搭建">
          </div>
          <div>
            <label class="text-caption block mb-2">类别</label>
            <select v-model="newQuote.category" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
              <option value="搭建">搭建</option>
              <option value="物料">物料</option>
              <option value="人员">人员</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-caption block mb-2">成本价</label>
              <input v-model="newQuote.costPrice" type="number" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="0">
            </div>
            <div>
              <label class="text-caption block mb-2">报价</label>
              <input v-model="newQuote.quotePrice" type="number" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="0">
            </div>
          </div>
          <div>
            <label class="text-caption block mb-2">数量</label>
            <input v-model="newQuote.quantity" type="number" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="1">
          </div>
          <div>
            <label class="text-caption block mb-2">备注</label>
            <input v-model="newQuote.remark" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="可选">
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-8">
          <button @click="showNewQuoteModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="showNewQuoteModal = false" class="btn-primary">添加</button>
        </div>
      </div>
    </div>

    <!-- 删除任务确认弹窗 -->
    <div v-if="showDeleteTaskConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="cancelDeleteTask">
      <div class="bg-white rounded-apple p-8 w-[400px] max-w-[90vw]">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-red-100 rounded-full">
            <Trash2 class="w-6 h-6 text-apple-red" />
          </div>
          <h4 class="text-title-1">确认删除任务</h4>
        </div>
        <p class="text-body mb-6">确定要删除此任务吗？此操作不可恢复。</p>
        <div class="flex items-center justify-end gap-3">
          <button @click="cancelDeleteTask" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="confirmDeleteTask" class="px-6 py-2 bg-apple-red text-white rounded-apple-sm hover:bg-red-600 transition-colors">确认删除</button>
        </div>
      </div>
    </div>

    <!-- 删除供应商确认弹窗 -->
    <div v-if="showDeleteSupplierConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="cancelDeleteSupplier">
      <div class="bg-white rounded-apple p-8 w-[400px] max-w-[90vw]">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-red-100 rounded-full">
            <Trash2 class="w-6 h-6 text-apple-red" />
          </div>
          <h4 class="text-title-1">确认删除供应商</h4>
        </div>
        <p class="text-body mb-6">确定要删除此供应商吗？此操作不可恢复。</p>
        <div class="flex items-center justify-end gap-3">
          <button @click="cancelDeleteSupplier" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="confirmDeleteSupplier" class="px-6 py-2 bg-apple-red text-white rounded-apple-sm hover:bg-red-600 transition-colors">确认删除</button>
        </div>
      </div>
    </div>

    <!-- 删除报价确认弹窗 -->
    <div v-if="showDeleteQuoteConfirm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="cancelDeleteQuote">
      <div class="bg-white rounded-apple p-8 w-[400px] max-w-[90vw]">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-red-100 rounded-full">
            <Trash2 class="w-6 h-6 text-apple-red" />
          </div>
          <h4 class="text-title-1">确认删除报价项</h4>
        </div>
        <p class="text-body mb-6">确定要删除此报价项吗？此操作不可恢复。</p>
        <div class="flex items-center justify-end gap-3">
          <button @click="cancelDeleteQuote" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="confirmDeleteQuote" class="px-6 py-2 bg-apple-red text-white rounded-apple-sm hover:bg-red-600 transition-colors">确认删除</button>
        </div>
      </div>
    </div>
  </div>
</template>
