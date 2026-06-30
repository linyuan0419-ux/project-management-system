import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export interface User {
  id: number
  name: string
  username: string
  role: 'admin' | 'user'
  avatar?: string
  department?: string
}

export const useAuthStore = defineStore('auth', () => {
  // 从localStorage读取登录状态
  const savedUser = localStorage.getItem('currentUser')
  
  // 当前登录用户
  const currentUser = ref<User | null>(savedUser ? JSON.parse(savedUser) : null)
  const isLoggedIn = computed(() => !!currentUser.value)
  const isAdmin = computed(() => currentUser.value?.role === 'admin')
  
  // 监听用户变化，保存到localStorage
  watch(currentUser, (newUser) => {
    if (newUser) {
      localStorage.setItem('currentUser', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('currentUser')
    }
  }, { deep: true })

  // 用户列表（模拟数据库）
  const users = ref<User[]>([
    { id: 1, name: '管理员', username: 'admin', role: 'admin', department: '管理部' },
    { id: 2, name: '张三', username: 'zhangsan', role: 'user', department: '项目部' },
    { id: 3, name: '李四', username: 'lisi', role: 'user', department: '创意部' },
    { id: 4, name: '王五', username: 'wangwu', role: 'user', department: '项目部' },
    { id: 5, name: '赵六', username: 'zhaoliu', role: 'user', department: '财务部' },
  ])

  // 登录
  const login = (username: string, password: string): boolean => {
    // 简单验证：密码与用户名相同
    const user = users.value.find(u => u.username === username)
    if (user && password === username) {
      currentUser.value = user
      return true
    }
    return false
  }

  // 登出
  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  // 添加用户（仅管理员）
  const addUser = (user: Omit<User, 'id'>): boolean => {
    if (!isAdmin.value) return false
    const newId = Math.max(...users.value.map(u => u.id)) + 1
    users.value.push({ ...user, id: newId })
    return true
  }

  // 删除用户（仅管理员）
  const deleteUser = (userId: number): boolean => {
    if (!isAdmin.value) return false
    if (currentUser.value?.id === userId) return false // 不能删除自己
    users.value = users.value.filter(u => u.id !== userId)
    return true
  }

  // 更新用户（仅管理员）
  const updateUser = (userId: number, updates: Partial<User>): boolean => {
    if (!isAdmin.value) return false
    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...updates }
      // 如果更新的是当前登录用户，同步更新
      if (currentUser.value?.id === userId) {
        currentUser.value = { ...currentUser.value, ...updates }
      }
      return true
    }
    return false
  }

  return {
    currentUser,
    isLoggedIn,
    isAdmin,
    users,
    login,
    logout,
    addUser,
    deleteUser,
    updateUser,
  }
})
