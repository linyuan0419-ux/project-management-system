<script setup lang="ts">
import { ref, computed } from 'vue'
import { Palette, Box, Lightbulb, Calendar, CheckSquare, User, Search, Plus, Edit2, Trash2, X, Check, BarChart3 } from '@lucide/vue'
import SimpleGantt from '../components/SimpleGantt.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// 创意工作类型
const creativeTypes = [
  { id: 'graphic', name: '平面设计', icon: Palette, color: '#007AFF' },
  { id: '3d', name: '3D设计', icon: Box, color: '#5856D6' },
  { id: 'planning', name: '策划', icon: Lightbulb, color: '#FF9500' },
]

// 设计师列表
const designers = ref(['小王', '小李', '小张', '小陈', '小刘'])

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
  {
    id: 4,
    projectName: '展厅设计提案',
    type: 'graphic',
    task: '宣传册设计',
    startDate: '2024-03-25',
    endDate: '2024-03-30',
    status: '进行中',
    progress: 30,
    designer: '小王',
    content: '企业宣传册、产品手册设计',
  },
  {
    id: 5,
    projectName: '快闪店搭建',
    type: '3d',
    task: '空间效果图',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    status: '已完成',
    progress: 100,
    designer: '小李',
    content: '快闪店空间设计、效果图渲染',
  },
])

const activeType = ref('all')
const selectedDesigner = ref('all')
const searchQuery = ref('')
const viewMode = ref<'list' | 'calendar' | 'gantt'>('list')

// 编辑状态
const editingId = ref<number | null>(null)
const editForm = ref({
  projectName: '',
  type: 'graphic',
  task: '',
  designer: '',
  startDate: '',
  endDate: '',
  status: '未开始',
  progress: 0,
  content: '',
})

// 筛选后的工作列表
const filteredSchedules = computed(() => {
  let result = schedules.value
  
  // 按类型筛选
  if (activeType.value !== 'all') {
    result = result.filter(s => s.type === activeType.value)
  }
  
  // 按设计师筛选
  if (selectedDesigner.value !== 'all') {
    result = result.filter(s => s.designer === selectedDesigner.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.projectName.toLowerCase().includes(query) ||
      s.task.toLowerCase().includes(query) ||
      s.content.toLowerCase().includes(query)
    )
  }
  
  return result
})

// 甘特图任务数据
const ganttTasks = computed(() => {
  return filteredSchedules.value.map(s => ({
    id: String(s.id),
    name: `${s.designer} - ${s.task}`,
    start: s.startDate,
    end: s.endDate,
    progress: s.progress,
    status: s.status === '已完成' ? 'completed' : s.status === '进行中' ? 'in-progress' : 'pending',
    custom_class: s.type,
  }))
})

// 获取设计师工作量统计
const getDesignerStats = (designer: string) => {
  const works = schedules.value.filter(s => s.designer === designer)
  return {
    total: works.length,
    completed: works.filter(s => s.status === '已完成').length,
    inProgress: works.filter(s => s.status === '进行中').length,
  }
}

// 开始编辑
const startEdit = (schedule: any) => {
  editingId.value = schedule.id
  editForm.value = { ...schedule }
}

// 保存编辑
const saveEdit = () => {
  const index = schedules.value.findIndex(s => s.id === editingId.value)
  if (index !== -1) {
    schedules.value[index] = { ...editForm.value, id: editingId.value }
  }
  editingId.value = null
}

// 取消编辑
const cancelEdit = () => {
  editingId.value = null
}

// 删除排期
const deleteSchedule = (id: number) => {
  if (confirm('确定要删除此排期吗？')) {
    schedules.value = schedules.value.filter(s => s.id !== id)
  }
}

// 更新进度
const updateProgress = (id: number, progress: number) => {
  const schedule = schedules.value.find(s => s.id === id)
  if (schedule) {
    schedule.progress = progress
    if (progress === 100) {
      schedule.status = '已完成'
    } else if (progress > 0) {
      schedule.status = '进行中'
    } else {
      schedule.status = '未开始'
    }
  }
}

// 新建工作弹窗
const showNewWorkModal = ref(false)
const newWork = ref({
  projectName: '',
  type: 'graphic',
  task: '',
  designer: '',
  startDate: '',
  endDate: '',
  content: '',
})

const createWork = () => {
  const newId = Math.max(...schedules.value.map(s => s.id)) + 1
  schedules.value.push({
    id: newId,
    ...newWork.value,
    status: '未开始',
    progress: 0,
  })
  showNewWorkModal.value = false
  newWork.value = {
    projectName: '',
    type: 'graphic',
    task: '',
    designer: '',
    startDate: '',
    endDate: '',
    content: '',
  }
}

// 添加设计师
const showAddDesignerModal = ref(false)
const newDesignerName = ref('')

const addDesigner = () => {
  if (newDesignerName.value.trim()) {
    designers.value.push(newDesignerName.value.trim())
    newDesignerName.value = ''
    showAddDesignerModal.value = false
  }
}

// 删除设计师（仅开发者）
const deleteDesigner = (designer: string) => {
  // 检查权限
  if (!authStore.isDeveloper) {
    alert('只有开发者可以删除设计师')
    return
  }
  
  const designerWorks = schedules.value.filter(s => s.designer === designer)
  
  if (confirm(`确定要删除设计师 "${designer}" 吗？\n\n该设计师有 ${designerWorks.length} 个排期，删除后将同步清除这些排期。\n\n此操作不可恢复！`)) {
    // 删除该设计师的所有排期
    schedules.value = schedules.value.filter(s => s.designer !== designer)
    // 删除设计师
    designers.value = designers.value.filter(d => d !== designer)
    // 如果当前筛选的是该设计师，重置筛选
    if (selectedDesigner.value === designer) {
      selectedDesigner.value = 'all'
    }
  }
}

// 获取本周日期
const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const currentWeek = ref('2024年3月18日 - 3月24日')

// 获取日期范围内的所有日期
const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const current = new Date(start)
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

// 检查排期是否在某天
const isScheduleOnDay = (schedule: any, dayIndex: number): boolean => {
  // 简化处理：假设 weekDays 对应某一周的7天
  // 实际应该根据具体日期计算
  return true // 简化显示
}
</script>

<template>
  <div class="space-y-6">
    <!-- 顶部统计卡片 -->
    <div class="grid grid-cols-4 gap-6">
      <div v-for="type in creativeTypes" :key="type.id" 
           class="card cursor-pointer hover:shadow-apple-hover" 
           :class="{ 'ring-2 ring-apple-blue': activeType === type.id }"
           @click="activeType = activeType === type.id ? 'all' : type.id">
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

    <!-- 设计师筛选栏 -->
    <div class="card">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <User class="w-5 h-5 text-apple-gray-400" />
            <span class="text-body font-medium">设计师：</span>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              @click="selectedDesigner = 'all'"
              class="px-4 py-2 rounded-apple-sm text-body transition-all"
              :class="selectedDesigner === 'all' ? 'bg-apple-blue text-white' : 'bg-apple-bg hover:bg-apple-gray-100'"
            >
              全部
            </button>
            <button
              v-for="designer in designers" :key="designer"
              @click="selectedDesigner = selectedDesigner === designer ? 'all' : designer"
              class="px-4 py-2 rounded-apple-sm text-body transition-all flex items-center gap-2 group"
              :class="selectedDesigner === designer ? 'bg-apple-blue text-white' : 'bg-apple-bg hover:bg-apple-gray-100'"
            >
              {{ designer }}
              <span class="text-xs opacity-70">({{ getDesignerStats(designer).total }})</span>
              <!-- 删除设计师按钮（仅开发者可见） -->
              <button
                v-if="authStore.isDeveloper && selectedDesigner !== designer"
                @click.stop="deleteDesigner(designer)"
                class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                title="删除设计师"
              >
                <Trash2 class="w-3 h-3 text-apple-red" />
              </button>
            </button>
            <button @click="showAddDesignerModal = true" class="p-2 rounded-apple-sm bg-apple-bg hover:bg-apple-gray-100 transition-colors">
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索项目或任务..."
              class="pl-9 pr-4 py-2 bg-apple-bg rounded-apple-sm text-body focus:outline-none focus:ring-2 focus:ring-apple-blue w-64"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 视图切换和新建按钮 -->
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
        <button
          @click="viewMode = 'gantt'"
          class="px-4 py-2 rounded-apple-sm text-body transition-all flex items-center gap-2"
          :class="viewMode === 'gantt' ? 'bg-apple-blue text-white' : 'text-apple-gray-400 hover:text-apple-gray-900'"
        >
          <BarChart3 class="w-4 h-4" />
          甘特图
        </button>
      </div>
      <button @click="showNewWorkModal = true" class="btn-primary flex items-center gap-2">
        <Plus class="w-4 h-4" />
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
            <th class="text-left p-4 text-caption font-medium w-24">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="schedule in filteredSchedules" :key="schedule.id" class="border-t border-apple-gray-100 hover:bg-apple-bg/50 transition-colors">
            <!-- 编辑模式 -->
            <template v-if="editingId === schedule.id">
              <td class="p-4">
                <input v-model="editForm.projectName" type="text" class="w-full px-2 py-1 border border-apple-gray-100 rounded text-sm" />
              </td>
              <td class="p-4">
                <select v-model="editForm.type" class="px-2 py-1 border border-apple-gray-100 rounded text-sm">
                  <option v-for="type in creativeTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
                </select>
              </td>
              <td class="p-4">
                <input v-model="editForm.task" type="text" class="w-full px-2 py-1 border border-apple-gray-100 rounded text-sm mb-1" />
                <input v-model="editForm.content" type="text" class="w-full px-2 py-1 border border-apple-gray-100 rounded text-sm text-apple-gray-400" />
              </td>
              <td class="p-4">
                <select v-model="editForm.designer" class="px-2 py-1 border border-apple-gray-100 rounded text-sm">
                  <option v-for="d in designers" :key="d" :value="d">{{ d }}</option>
                </select>
              </td>
              <td class="p-4">
                <input v-model="editForm.startDate" type="date" class="px-2 py-1 border border-apple-gray-100 rounded text-sm mb-1" />
                <input v-model="editForm.endDate" type="date" class="px-2 py-1 border border-apple-gray-100 rounded text-sm" />
              </td>
              <td class="p-4">
                <input 
                  v-model.number="editForm.progress" 
                  type="range" 
                  min="0" 
                  max="100" 
                  class="w-20 mb-1"
                />
                <span class="text-caption">{{ editForm.progress }}%</span>
              </td>
              <td class="p-4">
                <select v-model="editForm.status" class="px-2 py-1 border border-apple-gray-100 rounded text-sm">
                  <option value="未开始">未开始</option>
                  <option value="进行中">进行中</option>
                  <option value="已完成">已完成</option>
                </select>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-1">
                  <button @click="saveEdit" class="p-1.5 text-apple-green hover:bg-green-50 rounded">
                    <Check class="w-4 h-4" />
                  </button>
                  <button @click="cancelEdit" class="p-1.5 text-apple-gray-400 hover:bg-apple-bg rounded">
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </template>
            <!-- 显示模式 -->
            <template v-else>
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
              <td class="p-4">
                <span class="px-3 py-1 bg-apple-bg rounded-full text-body text-sm">{{ schedule.designer }}</span>
              </td>
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
              <td class="p-4">
                <div class="flex items-center gap-1">
                  <button @click="startEdit(schedule)" class="p-1.5 text-apple-gray-400 hover:text-apple-blue hover:bg-apple-bg rounded transition-colors" title="编辑">
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <!-- 仅开发者可删除排期 -->
                  <button 
                    v-if="authStore.isDeveloper"
                    @click="deleteSchedule(schedule.id)" 
                    class="p-1.5 text-apple-gray-400 hover:text-apple-red hover:bg-red-50 rounded transition-colors" 
                    title="删除"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredSchedules.length === 0" class="p-12 text-center">
        <p class="text-apple-gray-400 text-body">暂无符合条件的工作</p>
      </div>
    </div>

    <!-- 日历视图 -->
    <div v-else-if="viewMode === 'calendar'" class="card">
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
                 }"
                 @click="startEdit(schedule)">
              {{ schedule.designer }} - {{ schedule.task }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 甘特图视图 -->
    <div v-else-if="viewMode === 'gantt'" class="card">
      <div class="flex items-center justify-between mb-6">
        <h4 class="text-title-2">设计师排期甘特图</h4>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            <span class="text-caption">已完成</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            <span class="text-caption">进行中</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="w-3 h-3 rounded-full bg-orange-400"></span>
            <span class="text-caption">未开始</span>
          </div>
        </div>
      </div>
      <SimpleGantt 
        :tasks="ganttTasks"
        view-mode="week"
        @task-click="(task) => startEdit(filteredSchedules.find(s => s.id === Number(task.id)))"
      />
    </div>

    <!-- 新建工作弹窗 -->
    <div v-if="showNewWorkModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNewWorkModal = false">
      <div class="bg-white rounded-apple p-8 w-[480px] max-w-[90vw]">
        <h4 class="text-title-1 mb-6">新建工作排期</h4>
        <div class="space-y-4">
          <div>
            <label class="text-caption block mb-2">所属项目</label>
            <input v-model="newWork.projectName" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入项目名称">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-caption block mb-2">工作类型</label>
              <select v-model="newWork.type" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
                <option v-for="type in creativeTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-caption block mb-2">设计师</label>
              <select v-model="newWork.designer" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
                <option value="">选择设计师</option>
                <option v-for="designer in designers" :key="designer" :value="designer">{{ designer }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-caption block mb-2">工作内容</label>
            <input v-model="newWork.task" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入工作内容">
          </div>
          <div>
            <label class="text-caption block mb-2">详细描述</label>
            <textarea v-model="newWork.content" rows="2" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue resize-none" placeholder="输入详细描述"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-caption block mb-2">开始日期</label>
              <input v-model="newWork.startDate" type="date" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
            </div>
            <div>
              <label class="text-caption block mb-2">结束日期</label>
              <input v-model="newWork.endDate" type="date" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-8">
          <button @click="showNewWorkModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="createWork" class="btn-primary" :disabled="!newWork.projectName || !newWork.task || !newWork.designer">创建</button>
        </div>
      </div>
    </div>

    <!-- 添加设计师弹窗 -->
    <div v-if="showAddDesignerModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showAddDesignerModal = false">
      <div class="bg-white rounded-apple p-8 w-[360px] max-w-[90vw]">
        <h4 class="text-title-1 mb-6">添加设计师</h4>
        <div>
          <label class="text-caption block mb-2">设计师姓名</label>
          <input v-model="newDesignerName" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入设计师姓名">
        </div>
        <div class="flex items-center justify-end gap-3 mt-8">
          <button @click="showAddDesignerModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="addDesigner" class="btn-primary" :disabled="!newDesignerName.trim()">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>
