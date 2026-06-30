<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Lock, User } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const success = authStore.login(username.value, password.value)
  if (success) {
    router.push('/')
  } else {
    error.value = '用户名或密码错误'
  }
  
  isLoading.value = false
}


</script>

<template>
  <div class="min-h-screen bg-apple-bg flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-apple-blue rounded-apple flex items-center justify-center mx-auto mb-4">
          <Lock class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-title-1">项目管理系统</h1>
        <p class="text-caption mt-2">内部员工登录</p>
      </div>

      <!-- 登录表单 -->
      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="text-caption block mb-2">用户名</label>
            <div class="relative">
              <User class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-400" />
              <input
                v-model="username"
                type="text"
                class="w-full pl-10 pr-4 py-3 border border-apple-gray-100 rounded-apple-sm text-body focus:outline-none focus:border-apple-blue"
                placeholder="请输入用户名"
                required
              />
            </div>
          </div>

          <div>
            <label class="text-caption block mb-2">密码</label>
            <div class="relative">
              <Lock class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-400" />
              <input
                v-model="password"
                type="password"
                class="w-full pl-10 pr-4 py-3 border border-apple-gray-100 rounded-apple-sm text-body focus:outline-none focus:border-apple-blue"
                placeholder="请输入密码"
                required
              />
            </div>
          </div>

          <div v-if="error" class="p-3 bg-red-50 text-apple-red rounded-apple-sm text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            <span v-if="isLoading">登录中...</span>
            <span v-else>登录</span>
          </button>
        </form>


      </div>

      <!-- 版权信息 -->
      <p class="text-center text-caption mt-8">
        © 2024 项目管理系统 v1.0.0 · 仅供内部使用
      </p>
    </div>
  </div>
</template>
