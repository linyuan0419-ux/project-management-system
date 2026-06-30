<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { User, Lock, Key, CheckCircle, AlertCircle } from '@lucide/vue'

const authStore = useAuthStore()

// 修改用户名
const showUsernameModal = ref(false)
const newUsername = ref('')
const usernameError = ref('')
const usernameSuccess = ref('')

const openUsernameModal = () => {
  newUsername.value = ''
  usernameError.value = ''
  usernameSuccess.value = ''
  showUsernameModal.value = true
}

const saveUsername = () => {
  usernameError.value = ''
  usernameSuccess.value = ''
  
  if (!newUsername.value.trim()) {
    usernameError.value = '用户名不能为空'
    return
  }
  
  if (newUsername.value === authStore.currentUser?.username) {
    usernameError.value = '新用户名不能与当前用户名相同'
    return
  }
  
  const success = authStore.changeUsername(newUsername.value.trim())
  if (success) {
    usernameSuccess.value = '用户名修改成功！'
    setTimeout(() => {
      showUsernameModal.value = false
    }, 1500)
  } else {
    usernameError.value = '该用户名已被使用'
  }
}

// 修改密码
const showPasswordModal = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordError = ref('')
const passwordSuccess = ref('')

const openPasswordModal = () => {
  passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  passwordError.value = ''
  passwordSuccess.value = ''
  showPasswordModal.value = true
}

// 密码强度验证
const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 6) {
    return { valid: false, message: '密码至少6位' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密码必须包含大写字母' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密码必须包含小写字母' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密码必须包含数字' }
  }
  return { valid: true, message: '' }
}

const savePassword = () => {
  passwordError.value = ''
  passwordSuccess.value = ''
  
  if (!passwordForm.value.oldPassword) {
    passwordError.value = '请输入旧密码'
    return
  }
  
  if (!passwordForm.value.newPassword) {
    passwordError.value = '请输入新密码'
    return
  }
  
  // 验证密码强度
  const validation = validatePassword(passwordForm.value.newPassword)
  if (!validation.valid) {
    passwordError.value = validation.message
    return
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = '两次输入的密码不一致'
    return
  }
  
  const success = authStore.changePassword(
    passwordForm.value.oldPassword,
    passwordForm.value.newPassword
  )
  
  if (success) {
    passwordSuccess.value = '密码修改成功！请使用新密码重新登录。'
    setTimeout(() => {
      showPasswordModal.value = false
      authStore.logout()
    }, 2000)
  } else {
    passwordError.value = '旧密码错误'
  }
}

// 修改个人信息
const showProfileModal = ref(false)
const profileForm = ref({
  name: authStore.currentUser?.name || '',
  department: authStore.currentUser?.department || '项目部'
})
const profileSuccess = ref('')

const openProfileModal = () => {
  profileForm.value = {
    name: authStore.currentUser?.name || '',
    department: authStore.currentUser?.department || '项目部'
  }
  profileSuccess.value = ''
  showProfileModal.value = true
}

const saveProfile = () => {
  profileSuccess.value = ''
  
  if (!profileForm.value.name.trim()) {
    return
  }
  
  authStore.updateProfile({
    name: profileForm.value.name.trim(),
    department: profileForm.value.department
  })
  
  profileSuccess.value = '个人信息更新成功！'
  setTimeout(() => {
    showProfileModal.value = false
  }, 1500)
}

const departments = ['管理部', '项目部', '创意部', '财务部', '技术部']
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div>
      <h3 class="text-title-1">个人设置</h3>
      <p class="text-caption mt-1">管理您的账号信息和安全设置</p>
    </div>

    <!-- 个人信息卡片 -->
    <div class="card">
      <div class="flex items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-apple bg-apple-blue flex items-center justify-center text-white text-2xl font-bold">
            {{ authStore.currentUser?.name.charAt(0) }}
          </div>
          <div>
            <h4 class="text-title-2">{{ authStore.currentUser?.name }}</h4>
            <div class="flex items-center gap-2 mt-1">
              <span class="tag" :class="authStore.isDeveloper ? 'tag-red' : authStore.isManager ? 'tag-blue' : 'tag-gray'">
                {{ authStore.isDeveloper ? '开发者' : authStore.isManager ? '管理员' : '普通用户' }}
              </span>
              <span class="text-caption">{{ authStore.currentUser?.department }}</span>
            </div>
          </div>
        </div>
        <button @click="openProfileModal" class="btn-primary flex items-center gap-2">
          <User class="w-4 h-4" />
          <span>编辑资料</span>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-apple-gray-100">
        <div>
          <p class="text-caption mb-1">用户名</p>
          <p class="text-body font-medium">{{ authStore.currentUser?.username }}</p>
        </div>
        <div>
          <p class="text-caption mb-1">用户ID</p>
          <p class="text-body font-medium">#{{ authStore.currentUser?.id }}</p>
        </div>
      </div>
    </div>

    <!-- 账号安全 -->
    <div class="card">
      <h4 class="text-title-2 mb-6">账号安全</h4>
      <div class="space-y-4">
        <!-- 修改用户名 -->
        <div class="flex items-center justify-between p-4 bg-apple-bg rounded-apple-sm">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-white rounded-apple-sm">
              <User class="w-5 h-5 text-apple-blue" />
            </div>
            <div>
              <p class="text-body font-medium">修改用户名</p>
              <p class="text-caption">当前用户名：{{ authStore.currentUser?.username }}</p>
            </div>
          </div>
          <button @click="openUsernameModal" class="px-4 py-2 border border-apple-gray-100 rounded-apple-sm text-body hover:bg-apple-bg transition-colors">
            修改
          </button>
        </div>

        <!-- 修改密码 -->
        <div class="flex items-center justify-between p-4 bg-apple-bg rounded-apple-sm">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-white rounded-apple-sm">
              <Lock class="w-5 h-5 text-apple-blue" />
            </div>
            <div>
              <p class="text-body font-medium">修改密码</p>
              <p class="text-caption">定期更换密码可以提高账号安全性</p>
            </div>
          </div>
          <button @click="openPasswordModal" class="px-4 py-2 border border-apple-gray-100 rounded-apple-sm text-body hover:bg-apple-bg transition-colors">
            修改
          </button>
        </div>
      </div>
    </div>

    <!-- 安全提示 -->
    <div class="card bg-apple-blue-light/30">
      <div class="flex items-start gap-3">
        <Key class="w-5 h-5 text-apple-blue mt-0.5" />
        <div>
          <h4 class="text-body font-medium mb-1">安全提示</h4>
          <ul class="text-caption space-y-1">
            <li>• 密码需包含：大写字母、小写字母、数字，至少6位</li>
            <li>• 建议定期更换密码，避免使用简单密码</li>
            <li>• 用户名修改后需要使用新用户名登录</li>
            <li>• 密码修改后需要重新登录</li>
            <li>• 请勿将账号密码告知他人</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 修改用户名弹窗 -->
    <div v-if="showUsernameModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showUsernameModal = false">
      <div class="bg-white rounded-apple p-8 w-[400px] max-w-[90vw]">
        <h4 class="text-title-1 mb-6">修改用户名</h4>
        
        <div class="space-y-4">
          <div>
            <label class="text-caption block mb-2">当前用户名</label>
            <input :value="authStore.currentUser?.username" disabled class="w-full px-4 py-2 bg-apple-bg rounded-apple-sm text-apple-gray-400" />
          </div>
          <div>
            <label class="text-caption block mb-2">新用户名 <span class="text-apple-red">*</span></label>
            <input v-model="newUsername" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入新用户名" />
          </div>
          
          <div v-if="usernameError" class="flex items-center gap-2 p-3 bg-red-50 text-apple-red rounded-apple-sm text-sm">
            <AlertCircle class="w-4 h-4" />
            <span>{{ usernameError }}</span>
          </div>
          
          <div v-if="usernameSuccess" class="flex items-center gap-2 p-3 bg-green-50 text-apple-green rounded-apple-sm text-sm">
            <CheckCircle class="w-4 h-4" />
            <span>{{ usernameSuccess }}</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-8">
          <button @click="showUsernameModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="saveUsername" class="btn-primary" :disabled="!newUsername.trim() || !!usernameSuccess">保存</button>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showPasswordModal = false">
      <div class="bg-white rounded-apple p-8 w-[400px] max-w-[90vw]">
        <h4 class="text-title-1 mb-6">修改密码</h4>
        
        <div class="space-y-4">
          <div>
            <label class="text-caption block mb-2">旧密码 <span class="text-apple-red">*</span></label>
            <input v-model="passwordForm.oldPassword" type="password" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入旧密码" />
          </div>
          <div>
            <label class="text-caption block mb-2">新密码 <span class="text-apple-red">*</span></label>
            <input v-model="passwordForm.newPassword" type="password" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入新密码（至少6位，含大小写字母和数字）" />
            <p class="text-caption mt-1 text-apple-gray-400">密码需包含：大写字母、小写字母、数字，至少6位</p>
          </div>
          <div>
            <label class="text-caption block mb-2">确认新密码 <span class="text-apple-red">*</span></label>
            <input v-model="passwordForm.confirmPassword" type="password" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="再次输入新密码" />
          </div>
          
          <div v-if="passwordError" class="flex items-center gap-2 p-3 bg-red-50 text-apple-red rounded-apple-sm text-sm">
            <AlertCircle class="w-4 h-4" />
            <span>{{ passwordError }}</span>
          </div>
          
          <div v-if="passwordSuccess" class="flex items-center gap-2 p-3 bg-green-50 text-apple-green rounded-apple-sm text-sm">
            <CheckCircle class="w-4 h-4" />
            <span>{{ passwordSuccess }}</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-8">
          <button @click="showPasswordModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="savePassword" class="btn-primary" :disabled="!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || !!passwordSuccess">保存</button>
        </div>
      </div>
    </div>

    <!-- 编辑资料弹窗 -->
    <div v-if="showProfileModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showProfileModal = false">
      <div class="bg-white rounded-apple p-8 w-[400px] max-w-[90vw]">
        <h4 class="text-title-1 mb-6">编辑个人资料</h4>
        
        <div class="space-y-4">
          <div>
            <label class="text-caption block mb-2">姓名 <span class="text-apple-red">*</span></label>
            <input v-model="profileForm.name" type="text" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue" placeholder="输入姓名" />
          </div>
          <div>
            <label class="text-caption block mb-2">部门</label>
            <select v-model="profileForm.department" class="w-full px-4 py-2 border border-apple-gray-100 rounded-apple-sm focus:outline-none focus:border-apple-blue">
              <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
            </select>
          </div>
          
          <div v-if="profileSuccess" class="flex items-center gap-2 p-3 bg-green-50 text-apple-green rounded-apple-sm text-sm">
            <CheckCircle class="w-4 h-4" />
            <span>{{ profileSuccess }}</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-8">
          <button @click="showProfileModal = false" class="px-6 py-2 text-body hover:bg-apple-bg rounded-apple-sm transition-colors">取消</button>
          <button @click="saveProfile" class="btn-primary" :disabled="!profileForm.name.trim() || !!profileSuccess">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
