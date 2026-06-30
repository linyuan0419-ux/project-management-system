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

// 用户密码存储（实际项目中应该加密）
interface UserPassword {
  username: string
  password: string
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

  // 用户密码存储（初始密码与用户名相同）
  const userPasswords = ref<UserPassword[]>(
    users.value.map(u => ({ username: u.username, password: u.username }))
  )

  // 从localStorage读取密码
  const savedPasswords = localStorage.getItem('userPasswords')
  if (savedPasswords) {
    userPasswords.value = JSON.parse(savedPasswords)
  }

  // 保存密码到localStorage
  watch(userPasswords, (newPasswords) => {
    localStorage.setItem('userPasswords', JSON.stringify(newPasswords))
  }, { deep: true })

  // 登录
  const login = (username: string, password: string): boolean => {
    const user = users.value.find(u => u.username === username)
    const userPass = userPasswords.value.find(p => p.username === username)
    
    if (user && userPass && userPass.password === password) {
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

  // 修改密码（任何用户都可以修改自己的密码）
  const changePassword = (oldPassword: string, newPassword: string): boolean => {
    if (!currentUser.value) return false
    
    const userPassIndex = userPasswords.value.findIndex(
      p => p.username === currentUser.value?.username
    )
    
    if (userPassIndex === -1) return false
    
    // 验证旧密码
    if (userPasswords.value[userPassIndex].password !== oldPassword) {
      return false
    }
    
    // 更新密码
    userPasswords.value[userPassIndex].password = newPassword
    return true
  }

  // 修改用户名（任何用户都可以修改自己的用户名）
  const changeUsername = (newUsername: string): boolean => {
    if (!currentUser.value) return false
    
    // 检查新用户名是否已存在
    const existingUser = users.value.find(u => u.username === newUsername && u.id !== currentUser.value?.id)
    if (existingUser) return false
    
    const oldUsername = currentUser.value.username
    
    // 更新用户列表
    const userIndex = users.value.findIndex(u => u.id === currentUser.value?.id)
    if (userIndex !== -1) {
      users.value[userIndex].username = newUsername
    }
    
    // 更新密码列表
    const passIndex = userPasswords.value.findIndex(p => p.username === oldUsername)
    if (passIndex !== -1) {
      userPasswords.value[passIndex].username = newUsername
    }
    
    // 更新当前用户
    currentUser.value = { ...currentUser.value, username: newUsername }
    
    return true
  }

  // 修改个人信息（任何用户都可以修改自己的信息）
  const updateProfile = (updates: Partial<User>): boolean => {
    if (!currentUser.value) return false
    
    const userIndex = users.value.findIndex(u => u.id === currentUser.value?.id)
    if (userIndex !== -1) {
      users.value[userIndex] = { ...users.value[userIndex], ...updates }
      currentUser.value = { ...currentUser.value, ...updates }
      return true
    }
    return false
  }

  // 重置用户密码（仅管理员）
  const resetPassword = (userId: number): boolean => {
    if (!isAdmin.value) return false
    
    const user = users.value.find(u => u.id === userId)
    if (!user) return false
    
    const passIndex = userPasswords.value.findIndex(p => p.username === user.username)
    if (passIndex !== -1) {
      // 重置为与用户名相同
      userPasswords.value[passIndex].password = user.username
      return true
    }
    return false
  }

  // 添加用户（仅管理员）
  const addUser = (user: Omit<User, 'id'>): boolean => {
    if (!isAdmin.value) return false
    
    // 检查用户名是否已存在
    const existingUser = users.value.find(u => u.username === user.username)
    if (existingUser) return false
    
    const newId = Math.max(...users.value.map(u => u.id)) + 1
    const newUser = { ...user, id: newId }
    users.value.push(newUser)
    
    // 设置初始密码与用户名相同
    userPasswords.value.push({
      username: user.username,
      password: user.username
    })
    
    return true
  }

  // 删除用户（仅管理员）
  const deleteUser = (userId: number): boolean => {
    if (!isAdmin.value) return false
    if (currentUser.value?.id === userId) return false // 不能删除自己
    
    const user = users.value.find(u => u.id === userId)
    if (user) {
      // 删除密码记录
      userPasswords.value = userPasswords.value.filter(p => p.username !== user.username)
      // 删除用户
      users.value = users.value.filter(u => u.id !== userId)
      return true
    }
    return false
  }

  // 更新用户（仅管理员）
  const updateUser = (userId: number, updates: Partial<User>): boolean => {
    if (!isAdmin.value) return false
    
    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      // 如果修改了用户名，同步更新密码记录
      if (updates.username && updates.username !== users.value[index].username) {
        const passIndex = userPasswords.value.findIndex(
          p => p.username === users.value[index].username
        )
        if (passIndex !== -1) {
          userPasswords.value[passIndex].username = updates.username
        }
      }
      
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
    changePassword,
    changeUsername,
    updateProfile,
    resetPassword,
    addUser,
    deleteUser,
    updateUser,
  }
})
