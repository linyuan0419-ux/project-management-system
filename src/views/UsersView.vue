<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { Users, Plus, Edit, Trash2, Shield, User, X, Check } from '@lucide/vue'

const authStore = useAuthStore()

// 新建/编辑用户
const showUserModal = ref(false)
const isEditing = ref(false)
const editingUserId = ref<number | null>(null)

const userForm = ref({
  name: '',
  username: '',
  role: 'user' as 'admin' | 'user',
  department: '项目部',
})

const departments = ['管理部', '项目部', '创意部', '财务部', '技术部']

const openAddModal = () => {
  isEditing.value = false
  editingUserId.value = null
  userForm.value = { name: '', username: '', role: 'user', department: '项目部' }
  showUserModal.value = true
}

const openEditModal = (user: any) => {
  isEditing.value = true
  editingUserId.value = user.id
  userForm.value = { 
    name: user.name, 
    username: user.username, 
    role: user.role, 
    department: user.department || '项目部'
  }
  showUserModal.value = true
}

const saveUser = () => {
  if (isEditing.value && editingUserId.value) {
    authStore.updateUser(editingUserId.value, userForm.value)
  } else {
    authStore.addUser(userForm.value)
  }
  showUserModal.value = false
}

const deleteUser = (userId: number) => {
  if (confirm('确定要删除此用户吗？此操作不可恢复。')) {
    authStore.deleteUser(userId)
  }
}

const getRoleBadgeClass = (role: string) => {
  return role === 'admin' 
    ? 'bg-apple-red/10 text-apple-red' 
    : 'bg-apple-blue/10 text-apple-blue'
}

const getRoleText = (role: string) => {
  return role === 'admin' ? '管理员' : '普通用户'
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-title-1">用户管理</h3>
        <p class="text-caption mt-1">管理系统用户账号和权限</p>
      </div>
      <button 
        v-if="authStore.isAdmin"
        @click="openAddModal" 
        class="btn-primary flex items-center gap-2"
      >
        <Plus class="w-4 h-4" />
        <span>新建用户</span>
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-apple-blue-light rounded-apple-sm">
            <Users class="w-6 h-6 text-apple-blue" />
          </div>
          <div>
            <p class="text-caption">总用户数</p>
            <p class="text-display text-2xl">{{ authStore.users.length }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-apple-red/10 rounded-apple-sm">
            <Shield class="w-6 h-6 text-apple-red" />
          </div>
          <div>
            <p class="text-caption">管理员</p>
            <p class="text-display text-2xl">{{ authStore.users.filter(u => u.role === 'admin').length }}</p>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-apple-blue-light rounded-apple-sm">
            <User class="w-6 h-6 text-apple-blue" />
          </div>
          <div>
            <p class="text-caption">普通用户</p>
            <p class="text-display text-2xl">{{ authStore.users.filter(u => u.role === 'user').length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-apple-bg">
          <tr>
            <th class="text-left p-4 text-caption font-medium">用户</th>
            <th class="text-left p-4 text-caption font-medium">用户名</th>
            <th class="text-left p-4 text-caption font-medium">部门</th>
            <th class="text-left p-4 text-caption font-medium">角色</th>
            <th class="text-left p-4 text-caption font-medium w-32">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in authStore.users" :key="user.id" class="border-t border-apple-gray-100 hover:bg-apple-bg/50 transition-colors">
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-apple-blue flex items-center justify-center text-white font-medium">
                  {{ user.name.charAt(0) }}
                </div>
                <span class="text-body font-medium">{{ user.name }}</span>
              </div>
            </td>
            <td class="p-4 text-body">{{ user.username }}</td>
            <td class="p-4 text-body">{{ user.department || '-' }}</td>
            <td class="p-4">
              <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getRoleBadgeClass(user.role)">
                {{ getRoleText(user.role) }}
              </span>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2" v-if="authStore.isAdmin">
                <button 
                  @click="openEditModal(user)" 
                  class="p-1.5 text-apple-gray-400 hover:text-apple-blue rounded transition-colors"
                  :disabled="user.id === authStore.currentUser?.id"
                  :title="user.id === authStore.currentUser?.id ? '不能编辑自己' : '编辑'"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button 
                  @click="deleteUser(user.id)" 
                  class="p-1.5 text-apple-gray-400 hover:text-apple-red rounded transition-colors"
                  :disabled="user.id === authStore.currentUser?.id"
                  :title="user.id === authStore.currentUser?.id ? '不能删除自己' : '删除'"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
              <span v-else class="text-caption">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 权限说明 -->
    <div class="card bg-apple-blue-light/30">
      <h4 class="text-title-2 mb-4">权限说明</h4>
      <div class="space-y-2 text-body">
        <p><span class="font-medium text-apple-red">管理员</span>：可以管理所有项目、用户、查看所有数据</p>
        <p><span class="font-medium text-apple-blue">普通用户</span>：可以查看和编辑自己参与的项目</p>
      </div>
    </div>

    <!-- 新建/编辑用户弹窗 -->
    <div v-if="showUserModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showUserModal = false">
      <div class="bg-white rounded-apple p-8 w-[400px] max-w-[90vw]">
        <h4 class="text-title-1 mb-6">{{ isEditing ? '编辑用户' : '新建用户' }}</h4>
        <div class="space-y-4">
          <div>
            <label class="text-caption block mb-2">姓名 <span class="text-apple-red">*</span></label>
            <input v-model="userForm.name" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入姓名">
          </div>
          <div>
            <label class="text-caption block mb-2">用户名 <span class="text-apple-red">*</span></label>
            <input v-model="userForm.username" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入用户名" :disabled="isEditing">
            <p class="text-caption mt-1" v-if="!isEditing">初始密码与用户名相同</p>
          </div>
          <div>
            <label class="text-caption block mb-2">部门</label>
            <select v-model="userForm.department" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>
          <div>
            <label class="text-caption block mb-2">角色</label>
            <div class="flex items-center gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="userForm.role" type="radio" value="user" class="w-4 h-4 text-apple-blue">
                <span class="text-body">普通用户</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input v-model="userForm.role" type="radio" value="admin" class="w-4 h-4 text-apple-red">
                <span class="text-body">管理员</span>
              </label>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-8">
          <button @click="showUserModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="saveUser" class="btn-primary" :disabled="!userForm.name || !userForm.username">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
