<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Briefcase, Users, FileText, Settings } from '@lucide/vue'

const route = useRoute()
const router = useRouter()

const navItems = [
  { name: '工作台', path: '/', icon: LayoutDashboard },
  { name: '项目', path: '/projects', icon: Briefcase },
  { name: '客户', path: '/clients', icon: Users },
  { name: '周报', path: '/reports', icon: FileText },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
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
            <button class="btn-primary flex items-center gap-2">
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
  </div>
</template>
