<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckSquare, AlertCircle, Briefcase, Clock, Sparkles, Sun, Moon, Coffee } from '@lucide/vue'

const router = useRouter()

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
const todayStats = computed(() => {
  const completed = todayCompleted.value
  const total = todayTasks.length
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
const completeTask = (taskId: number) => {
  completingTask.value = taskId
  setTimeout(() => {
    const task = todayTasks.find(t => t.id === taskId)
    if (task && !task.completed) {
      task.completed = true
      todayCompleted.value++
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

    <!-- 今日行动清单 + 今日成就 + 最近动态 -->
    <div class="grid grid-cols-3 gap-6">
      <!-- 今日待办 -->
      <section class="card col-span-2">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-title-1">今日行动</h3>
          <span class="text-caption text-apple-gray-400">{{ todayStats.completed }}/{{ todayStats.total }} 已完成</span>
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
              <p class="text-display text-2xl">{{ Math.max(0, todayStats.total - todayStats.completed) }}</p>
              <p class="text-caption">待完成</p>
            </div>
          </div>
        </div>
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
</style>
