<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CheckSquare, AlertCircle, Briefcase, Clock, Sparkles, Sun, Moon, Coffee, Heart, Droplets, Fish, Cat, Smile } from '@lucide/vue'
import { loadData, autoSave } from '../stores/dbSync'

const router = useRouter()

// ========== 电子宠物小猫系统 ==========
// 小猫状态
const catState = ref({
  hunger: 80,      // 饥饿值 0-100
  thirst: 80,      // 口渴值 0-100
  mood: 80,        // 心情值 0-100
  energy: 80,      // 精力值 0-100
})

// 自动保存小猫状态
watch(catState, (newVal) => {
  autoSave('catState', newVal, 'current')
}, { deep: true })

// 小猫表情和状态
const catStatus = computed(() => {
  const { hunger, thirst, mood, energy } = catState.value
  const avg = (hunger + thirst + mood + energy) / 4
  
  if (avg >= 80) return { emoji: '😸', text: '开心', color: '#34C759', desc: '喵~ 今天工作很顺利呢！' }
  if (avg >= 60) return { emoji: '😺', text: '满足', color: '#007AFF', desc: '喵喵~ 状态不错哦' }
  if (avg >= 40) return { emoji: '😐', text: '一般', color: '#FF9500', desc: '喵... 有点饿了' }
  if (avg >= 20) return { emoji: '😿', text: '疲惫', color: '#FF3B30', desc: '喵喵... 需要休息' }
  return { emoji: '😾', text: '不开心', color: '#8E8E93', desc: '喵呜... 快给我吃的！' }
})

// 食物库存
const inventory = ref({
  food: 3,     // 猫粮
  water: 3,    // 水
  snack: 1,    // 零食
})

// 自动保存库存
watch(inventory, (newVal) => {
  autoSave('inventory', newVal, 'current')
}, { deep: true })

// 小猫表情和状态
const catStatus = computed(() => {
  const { hunger, thirst, mood, energy } = catState.value
  const avg = (hunger + thirst + mood + energy) / 4
  
  if (avg >= 80) return { emoji: '😸', text: '开心', color: '#34C759', desc: '喵~ 今天工作很顺利呢！' }
  if (avg >= 60) return { emoji: '😺', text: '满足', color: '#007AFF', desc: '喵喵~ 状态不错哦' }
  if (avg >= 40) return { emoji: '😐', text: '一般', color: '#FF9500', desc: '喵... 有点饿了' }
  if (avg >= 20) return { emoji: '😿', text: '疲惫', color: '#FF3B30', desc: '喵喵... 需要休息' }
  return { emoji: '😾', text: '不开心', color: '#8E8E93', desc: '喵呜... 快给我吃的！' }
})

// 食物库存
const inventory = ref({
  food: 3,     // 猫粮
  water: 3,    // 水
  snack: 1,    // 零食
})

// 喂食
const feedCat = (type: 'food' | 'water' | 'snack') => {
  if (inventory.value[type] <= 0) return
  
  inventory.value[type]--
  
  if (type === 'food') {
    catState.value.hunger = Math.min(100, catState.value.hunger + 30)
    catState.value.energy = Math.min(100, catState.value.energy + 10)
  } else if (type === 'water') {
    catState.value.thirst = Math.min(100, catState.value.thirst + 30)
    catState.value.energy = Math.min(100, catState.value.energy + 5)
  } else if (type === 'snack') {
    catState.value.hunger = Math.min(100, catState.value.hunger + 20)
    catState.value.mood = Math.min(100, catState.value.mood + 30)
  }
}

// 互动
const playWithCat = () => {
  catState.value.mood = Math.min(100, catState.value.mood + 15)
  catState.value.energy = Math.max(0, catState.value.energy - 5)
}

// 完成任务获得食物
const earnReward = (taskCompleted: boolean) => {
  if (taskCompleted) {
    const rand = Math.random()
    if (rand < 0.5) inventory.value.food++
    else if (rand < 0.8) inventory.value.water++
    else inventory.value.snack++
  }
}

// 自然衰减（每30秒）
let decayInterval: number | null = null
onMounted(async () => {
  // ========== 数据持久化：加载保存的数据 ==========
  // 加载小猫状态
  const savedCatState = await loadData('catState', 'current')
  if (savedCatState && savedCatState.hunger !== undefined) {
    catState.value = savedCatState
  }
  
  // 加载库存
  const savedInventory = await loadData('inventory', 'current')
  if (savedInventory) {
    inventory.value = { ...inventory.value, ...savedInventory }
  }
  
  // 加载今日完成数
  const savedStats = await loadData('todayStats', 'current')
  if (savedStats) {
    todayCompleted.value = savedStats.completed || 0
  }
  
  // 加载任务完成状态
  const savedTasks = await loadData('todayStats', 'tasks')
  if (savedTasks && todayTasks.value) {
    const completedMap = savedTasks as Record<number, boolean>
    todayTasks.value = todayTasks.value.map(task => ({
      ...task,
      completed: completedMap[task.id] || false
    }))
    todayCompleted.value = todayTasks.value.filter(t => t.completed).length
  }

  // 启动自然衰减
  decayInterval = window.setInterval(() => {
    catState.value.hunger = Math.max(0, catState.value.hunger - 2)
    catState.value.thirst = Math.max(0, catState.value.thirst - 3)
    catState.value.mood = Math.max(0, catState.value.mood - 1)
    catState.value.energy = Math.max(0, catState.value.energy - 1)
  }, 30000)
})

onUnmounted(() => {
  if (decayInterval) clearInterval(decayInterval)
})

// ========== 治愈系功能 ==========
// 1. 人性化问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) {
    return { text: '早上好，新的一天开始了', icon: Sun, color: '#FF9500' }
  } else if (hour >= 12 && hour < 18) {
    return { text: '下午好，记得抽空休息一下', icon: Coffee, color: '#007AFF' }
  } else {
    return { text: '晚上好，今天辛苦了', icon: Moon, color: '#5856D6' }
  }
})

// 2. 鼓励签文案库
const quotes = [
  '每一个项目，都是成长的阶梯。',
  '今天的努力，是明天的底气。',
  '慢慢来，好戏都在烟火里。',
  '你已经做得很棒了，继续加油！',
  '保持热爱，奔赴山海。',
  '星光不问赶路人，时光不负有心人。',
  '今天的你，比昨天更优秀。',
  '所有的美好，都在路上。',
]
const todayQuote = ref('')
onMounted(() => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  todayQuote.value = quotes[dayOfYear % quotes.length]
})

// 3. 今日成就统计
const todayCompleted = ref(0)

// 自动保存今日完成数
watch(todayCompleted, (newVal) => {
  autoSave('todayStats', { completed: newVal }, 'current')
  // 同时保存任务完成状态
  const taskStatus: Record<number, boolean> = {}
  todayTasks.value?.forEach(task => {
    taskStatus[task.id] = task.completed
  })
  autoSave('todayStats', taskStatus, 'tasks')
}, { immediate: false })

const todayStats = computed(() => {
  const completed = todayCompleted.value
  const total = todayTasks.value?.length || 0
  return {
    completed,
    total,
    progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    message: completed === 0 ? '开始今天的第一项任务吧' :
             completed < total / 2 ? '已经开了个好头，继续加油！' :
             completed < total ? '快要完成了，坚持就是胜利！' :
             '太棒了！今天的任务全部完成 🎉'
  }
})

// 4. 任务完成动效
const completingTask = ref<number | null>(null)
const showReward = ref(false)
const rewardType = ref<'food' | 'water' | 'snack'>('food')

const completeTask = (taskId: number) => {
  completingTask.value = taskId
  setTimeout(() => {
    const task = todayTasks.value.find(t => t.id === taskId)
    if (task && !task.completed) {
      task.completed = true
      todayCompleted.value++
      // 获得奖励
      const rand = Math.random()
      if (rand < 0.5) {
        rewardType.value = 'food'
        inventory.value.food++
      } else if (rand < 0.8) {
        rewardType.value = 'water'
        inventory.value.water++
      } else {
        rewardType.value = 'snack'
        inventory.value.snack++
      }
      showReward.value = true
      setTimeout(() => showReward.value = false, 2000)
    }
    completingTask.value = null
  }, 300)
}

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
const todayTasks = ref([
  { id: 1, title: '确认展台搭建方案', project: '某品牌新品发布会', type: 'my', priority: 'high', completed: false },
  { id: 2, title: '支付尾款给搭建商', project: '年度经销商大会', type: 'finance', priority: 'high', completed: false },
  { id: 3, title: '跟进物料制作进度', project: '某品牌新品发布会', type: 'supplier', priority: 'normal', completed: false },
])

// 最近动态
const recentActivities = [
  { id: 1, content: '创建了项目 "某品牌新品发布会"', time: '2小时前' },
  { id: 2, content: '更新了 "年度经销商大会" 进度至 80%', time: '4小时前' },
  { id: 3, content: '添加了供应商 "XX展览工厂"', time: '昨天' },
]
</script>

<template>
  <div class="space-y-8">
    <!-- 治愈系问候语 -->
    <div class="card bg-gradient-to-r from-apple-bg to-white">
      <div class="flex items-center gap-4">
        <div class="p-3 rounded-apple-sm" :style="{ backgroundColor: greeting.color + '20' }">
          <component :is="greeting.icon" class="w-6 h-6" :style="{ color: greeting.color }" />
        </div>
        <div class="flex-1">
          <p class="text-title-2">{{ greeting.text }}</p>
          <p class="text-body text-apple-gray-400 mt-1">{{ todayQuote }}</p>
        </div>
        <div class="flex items-center gap-2 text-apple-gray-400">
          <Sparkles class="w-4 h-4" />
          <span class="text-caption">今日能量</span>
        </div>
      </div>
    </div>

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
        <div v-for="project in activeProjects" :key="project.id" class="card cursor-pointer" @click="router.push(`/projects/${project.id}`)">
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

    <!-- 今日行动清单 + 今日成就 + 电子宠物 + 最近动态 -->
    <div class="grid grid-cols-4 gap-6">
      <!-- 今日待办 -->
      <section class="card col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-title-1">今日行动</h3>
          <span class="text-caption text-apple-gray-400">{{ todayStats.completed }}/{{ todayStats.total || 0 }} 已完成</span>
        </div>
        <!-- 获得奖励提示 -->
        <div v-if="showReward" class="mb-4 p-3 bg-green-50 rounded-apple-sm flex items-center gap-3 animate-reward">
          <div class="w-8 h-8 rounded-full bg-apple-green flex items-center justify-center">
            <component :is="rewardType === 'food' ? Fish : rewardType === 'water' ? Droplets : Heart" class="w-4 h-4 text-white" />
          </div>
          <p class="text-body text-apple-green">
            任务完成！获得 {{ rewardType === 'food' ? '猫粮' : rewardType === 'water' ? '水' : '零食' }} ×1 🎉
          </p>
        </div>
        <div class="space-y-3">
          <div v-for="task in todayTasks" :key="task.id" 
               class="flex items-start gap-3 p-3 rounded-apple-sm transition-all duration-300"
               :class="{
                 'bg-apple-bg': task.completed,
                 'hover:bg-apple-bg/50': !task.completed,
                 'opacity-60': task.completed,
                 'scale-[0.98] opacity-0': completingTask === task.id
               }">
            <!-- 治愈系复选框 -->
            <button 
              @click="!task.completed && completeTask(task.id)"
              class="mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
              :class="{
                'border-apple-gray-200 bg-white': !task.completed,
                'border-apple-green bg-apple-green': task.completed,
                'hover:border-apple-green': !task.completed,
              }"
              :disabled="task.completed"
            >
              <svg v-if="task.completed" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <div class="flex-1">
              <p class="text-body font-medium transition-all" :class="{ 'line-through text-apple-gray-400': task.completed }">{{ task.title }}</p>
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
        <!-- 完成提示 -->
        <div v-if="todayStats.completed === todayStats.total && todayStats.total > 0" class="mt-4 p-3 bg-green-50 rounded-apple-sm text-center">
          <p class="text-body text-apple-green">🎉 {{ todayStats.message }}</p>
        </div>
      </section>

      <!-- 今日成就卡片 -->
      <section class="card bg-gradient-to-br from-apple-bg to-white">
        <div class="flex items-center gap-2 mb-4">
          <Sparkles class="w-5 h-5 text-apple-orange" />
          <h3 class="text-title-1">今日成就</h3>
        </div>
        <div class="space-y-4">
          <!-- 进度圆环 -->
          <div class="flex items-center justify-center">
            <div class="relative w-24 h-24">
              <svg class="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#F2F2F7" stroke-width="8" fill="none" />
                <circle cx="48" cy="48" r="40" :stroke="todayStats.progress === 100 ? '#34C759' : '#007AFF'" 
                        stroke-width="8" fill="none" 
                        :stroke-dasharray="251.2" 
                        :stroke-dashoffset="251.2 - (251.2 * todayStats.progress / 100)"
                        class="transition-all duration-500" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-title-2">{{ todayStats.progress }}%</span>
              </div>
            </div>
          </div>
          <!-- 成就文案 -->
          <div class="text-center">
            <p class="text-body text-apple-gray-600">{{ todayStats.message }}</p>
          </div>
          <!-- 小统计 -->
          <div class="grid grid-cols-2 gap-3 pt-4 border-t border-apple-gray-100">
            <div class="text-center">
              <p class="text-display text-2xl text-apple-green">{{ todayStats.completed }}</p>
              <p class="text-caption">已完成</p>
            </div>
            <div class="text-center">
              <p class="text-display text-2xl">{{ Math.max(0, (todayStats.total || 0) - todayStats.completed) }}</p>
              <p class="text-caption">待完成</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 电子宠物小猫 -->
      <section class="card bg-gradient-to-br from-orange-50 to-white">
        <div class="flex items-center gap-2 mb-4">
          <Cat class="w-5 h-5 text-apple-orange" />
          <h3 class="text-title-1">工作伙伴</h3>
        </div>
        
        <!-- 小猫状态 -->
        <div class="text-center mb-4">
          <div class="text-6xl mb-2">{{ catStatus.emoji }}</div>
          <p class="text-title-2" :style="{ color: catStatus.color }">{{ catStatus.text }}</p>
          <p class="text-caption text-apple-gray-400 mt-1">{{ catStatus.desc }}</p>
        </div>

        <!-- 状态条 -->
        <div class="space-y-3 mb-4">
          <div>
            <div class="flex items-center justify-between text-caption mb-1">
              <span class="flex items-center gap-1"><Fish class="w-3 h-3" /> 饱食度</span>
              <span>{{ catState.hunger }}%</span>
            </div>
            <div class="h-2 bg-apple-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" 
                   :style="{ width: catState.hunger + '%', backgroundColor: catState.hunger > 60 ? '#34C759' : catState.hunger > 30 ? '#FF9500' : '#FF3B30' }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between text-caption mb-1">
              <span class="flex items-center gap-1"><Droplets class="w-3 h-3" /> 水分</span>
              <span>{{ catState.thirst }}%</span>
            </div>
            <div class="h-2 bg-apple-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" 
                   :style="{ width: catState.thirst + '%', backgroundColor: catState.thirst > 60 ? '#007AFF' : catState.thirst > 30 ? '#FF9500' : '#FF3B30' }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between text-caption mb-1">
              <span class="flex items-center gap-1"><Heart class="w-3 h-3" /> 心情</span>
              <span>{{ catState.mood }}%</span>
            </div>
            <div class="h-2 bg-apple-gray-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500" 
                   :style="{ width: catState.mood + '%', backgroundColor: catState.mood > 60 ? '#FF2D55' : catState.mood > 30 ? '#FF9500' : '#8E8E93' }"></div>
            </div>
          </div>
        </div>

        <!-- 喂食按钮 -->
        <div class="grid grid-cols-3 gap-2 mb-3">
          <button 
            @click="feedCat('food')" 
            :disabled="inventory.food <= 0 || catState.hunger >= 100"
            class="p-2 rounded-apple-sm bg-white border border-apple-gray-100 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Fish class="w-4 h-4 mx-auto mb-1" :class="inventory.food > 0 ? 'text-apple-orange' : 'text-apple-gray-300'" />
            <p class="text-caption">猫粮</p>
            <p class="text-caption font-medium">×{{ inventory.food }}</p>
          </button>
          <button 
            @click="feedCat('water')" 
            :disabled="inventory.water <= 0 || catState.thirst >= 100"
            class="p-2 rounded-apple-sm bg-white border border-apple-gray-100 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Droplets class="w-4 h-4 mx-auto mb-1" :class="inventory.water > 0 ? 'text-apple-blue' : 'text-apple-gray-300'" />
            <p class="text-caption">水</p>
            <p class="text-caption font-medium">×{{ inventory.water }}</p>
          </button>
          <button 
            @click="feedCat('snack')" 
            :disabled="inventory.snack <= 0 || catState.mood >= 100"
            class="p-2 rounded-apple-sm bg-white border border-apple-gray-100 hover:bg-pink-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart class="w-4 h-4 mx-auto mb-1" :class="inventory.snack > 0 ? 'text-apple-red' : 'text-apple-gray-300'" />
            <p class="text-caption">零食</p>
            <p class="text-caption font-medium">×{{ inventory.snack }}</p>
          </button>
        </div>

        <!-- 互动按钮 -->
        <button 
          @click="playWithCat"
          :disabled="catState.energy < 10"
          class="w-full py-2 rounded-apple-sm bg-apple-bg hover:bg-apple-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Smile class="w-4 h-4" />
          <span class="text-body">摸摸头</span>
        </button>

        <!-- 提示 -->
        <p class="text-caption text-apple-gray-400 text-center mt-3">
          完成任务可获得食物奖励
        </p>
      </section>
    </div>

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
</template>

<style scoped>
/* 治愈系动画 */
@keyframes check-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 复选框完成动画 */
button:active:not(:disabled) {
  animation: check-bounce 0.3s ease;
}

/* 卡片入场动画 */
.card {
  animation: fade-in-up 0.5s ease-out;
}

/* 渐变背景动画 */
.bg-gradient-to-r,
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 奖励动画 */
@keyframes reward-pop {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-reward {
  animation: reward-pop 0.3s ease-out;
}

/* 小猫表情动画 */
@keyframes cat-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.text-6xl {
  animation: cat-bounce 2s ease-in-out infinite;
}

/* 状态条闪烁（低状态时） */
@keyframes pulse-warning {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.pulse-warning {
  animation: pulse-warning 1s ease-in-out infinite;
}
</style>
