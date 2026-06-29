<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Briefcase, Users, Palette, FileText, Settings } from '@lucide/vue'

const route = useRoute()
const router = useRouter()

const navItems = [
  { name: '工作台', path: '/', icon: LayoutDashboard },
  { name: '项目', path: '/projects', icon: Briefcase },
  { name: '客户', path: '/clients', icon: Users },
  { name: '创意部', path: '/creative', icon: Palette },
  { name: '周报', path: '/reports', icon: FileText },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// 新建项目弹窗
const showNewProjectModal = ref(false)
const newProject = ref({
  name: '',
  client: '',
  clientContact: '',
  type: 'direct',
  stage: 'idea',
  budget: 0,
  startDate: '',
  endDate: '',
  description: '',
})

const projectStages = [
  { id: 'pitch', name: '打标' },
  { id: 'idea', name: '创意策展' },
  { id: 'production', name: '供应商制作' },
  { id: 'onsite', name: '现场搭建' },
  { id: 'close', name: '撤场结案' },
]

const createProject = () => {
  // 这里应该调用API保存项目
  console.log('创建项目:', newProject.value)
  showNewProjectModal.value = false
  // 重置表单
  newProject.value = {
    name: '',
    client: '',
    clientContact: '',
    type: 'direct',
    stage: 'idea',
    budget: 0,
    startDate: '',
    endDate: '',
    description: '',
  }
  // 刷新页面或跳转到项目列表
  router.push('/projects')
}
</script>

<template>
  <div class="min-h-screen bg-apple-bg">
    <!-- 侧边导航栏 -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-apple border-r border-apple-gray-100 z-50">
      <div class="p-6">
        <h1 class="text-title-1 mb-8">项目管理系统</h1>
        
        <nav class="space-y-2">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-apple-sm transition-all duration-200"
            :class="isActive(item.path) 
              ? 'bg-apple-blue text-white' 
              : 'text-apple-gray-900 hover:bg-apple-bg'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="text-body font-medium">{{ item.name }}</span>
          </router-link>
        </nav>
      </div>
      
      <!-- 底部设置 -->
      <div class="absolute bottom-0 left-0 right-0 p-6 border-t border-apple-gray-100">
        <button class="flex items-center gap-3 px-4 py-3 text-apple-gray-400 hover:text-apple-gray-900 transition-colors">
          <Settings class="w-5 h-5" />
          <span class="text-body">设置</span>
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="ml-64 min-h-screen">
      <!-- 顶部毛玻璃导航栏 -->
      <header class="navbar sticky top-0 z-40">
        <div class="flex items-center justify-between">
          <h2 class="text-title-2">{{ route.meta.title || '工作台' }}</h2>
          <div class="flex items-center gap-4">
            <button @click="showNewProjectModal = true" class="btn-primary flex items-center gap-2">
              <span class="text-lg">+</span>
              <span>新建项目</span>
            </button>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <div class="p-8">
        <slot />
      </div>
    </main>

    <!-- 新建项目弹窗 -->
    <div v-if="showNewProjectModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showNewProjectModal = false">
      <div class="bg-white rounded-apple p-8 w-[560px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <h4 class="text-title-1 mb-6">新建项目</h4>
        
        <div class="space-y-5">
          <!-- 项目名称 -->
          <div>
            <label class="text-caption block mb-2">项目名称 <span class="text-apple-red">*</span></label>
            <input v-model="newProject.name" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入项目名称">
          </div>

          <!-- 客户信息 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-caption block mb-2">客户公司名称 <span class="text-apple-red">*</span></label>
              <input v-model="newProject.client" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入客户名称">
            </div>
            <div>
              <label class="text-caption block mb-2">客户负责人</label>
              <input v-model="newProject.clientContact" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="姓名 + 电话">
            </div>
          </div>

          <!-- 项目类型 -->
          <div>
            <label class="text-caption block mb-2">项目类型</label>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="newProject.type" type="radio" value="direct" class="w-4 h-4 text-apple-blue">
                <span class="text-body">直接落地</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="newProject.type" type="radio" value="pitch" class="w-4 h-4 text-apple-blue">
                <span class="text-body">打标项目</span>
              </label>
            </div>
          </div>

          <!-- 项目阶段 -->
          <div>
            <label class="text-caption block mb-2">当前阶段</label>
            <select v-model="newProject.stage" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
              <option v-for="stage in projectStages" :key="stage.id" :value="stage.id">{{ stage.name }}</option>
            </select>
          </div>

          <!-- 项目周期 -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-caption block mb-2">开始日期</label>
              <input v-model="newProject.startDate" type="date" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
            </div>
            <div>
              <label class="text-caption block mb-2">结束日期</label>
              <input v-model="newProject.endDate" type="date" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
            </div>
          </div>

          <!-- 项目预算 -->
          <div>
            <label class="text-caption block mb-2">项目预算</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-apple-gray-400">¥</span>
              <input v-model="newProject.budget" type="number" class="w-full pl-8 pr-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入预算金额">
            </div>
          </div>

          <!-- 项目描述 -->
          <div>
            <label class="text-caption block mb-2">项目描述</label>
            <textarea v-model="newProject.description" rows="3" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue resize-none" placeholder="输入项目描述"></textarea>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-apple-gray-100">
          <button @click="showNewProjectModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="createProject" class="btn-primary" :disabled="!newProject.name || !newProject.client">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>
