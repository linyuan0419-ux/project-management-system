<script setup lang="ts">
import { ref, computed } from 'vue'
import { Palette, Box, Lightbulb, Calendar, CheckSquare, User, Search, Plus } from '@lucide/vue'

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
const viewMode = ref<'calendar' | 'list'>('list')

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

// 获取设计师工作量统计
const getDesignerStats = (designer: string) => {
  const works = schedules.value.filter(s => s.designer === designer)
  return {
    total: works.length,
    completed: works.filter(s => s.status === '已完成').length,
    inProgress: works.filter(s => s.status === '进行中').length,
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

// 获取本周日期
const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const currentWeek = ref('2024年3月18日 - 3月24日')
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
              class="px-4 py-2 rounded-apple-sm text-body transition-all flex items-center gap-2"
              :class="selectedDesigner === designer ? 'bg-apple-blue text-white' : 'bg-apple-bg hover:bg-apple-gray-100'"
            >
              {{ designer }}
              <span class="text-xs opacity-70">({{ getDesignerStats(designer).total }})</span>
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
          </tr>
        </tbody>
      </table>
      <div v-if="filteredSchedules.length === 0" class="p-12 text-center">
        <p class="text-apple-gray-400 text-body">暂无符合条件的工作</p>
      </div>
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
          <button @click="showNewWorkModal = false" class="btn-primary">创建</button>
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
