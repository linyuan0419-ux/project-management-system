<script setup lang="ts">
import { ref } from 'vue'

// 示例客户数据
const clients = [
  { 
    id: 1, 
    name: 'ABC科技', 
    industry: '科技/互联网',
    contact: '张经理',
    phone: '13800138000',
    projectCount: 2,
    color: '#007AFF'
  },
  { 
    id: 2, 
    name: 'XYZ汽车', 
    industry: '汽车',
    contact: '李总监',
    phone: '13900139000',
    projectCount: 1,
    color: '#34C759'
  },
  { 
    id: 3, 
    name: 'DEF地产', 
    industry: '房地产',
    contact: '王总',
    phone: '13700137000',
    projectCount: 1,
    color: '#FF9500'
  },
  { 
    id: 4, 
    name: 'GHI时尚', 
    industry: '时尚/零售',
    contact: '陈经理',
    phone: '13600136000',
    projectCount: 1,
    color: '#FF3B30'
  },
]

const selectedClient = ref<typeof clients[0] | null>(null)

// 该客户的项目
const clientProjects = [
  { id: 1, name: '某品牌新品发布会', stage: '供应商制作', progress: 65, status: '进行中' },
  { id: 2, name: '春季产品路演', stage: '撤场结案', progress: 100, status: '已完成' },
]
</script>

<template>
  <div class="space-y-6">
    <!-- 客户列表 -->
    <div v-if="!selectedClient" class="grid grid-cols-2 gap-6">
      <div
        v-for="client in clients"
        :key="client.id"
        class="card cursor-pointer hover:shadow-apple-hover"
        @click="selectedClient = client"
      >
        <div class="flex items-start gap-4">
          <div 
            class="w-12 h-12 rounded-apple flex items-center justify-center text-white text-xl font-bold"
            :style="{ backgroundColor: client.color }"
          >
            {{ client.name.charAt(0) }}
          </div>
          <div class="flex-1">
            <h4 class="text-title-2 mb-1">{{ client.name }}</h4>
            <p class="text-caption mb-3">{{ client.industry }}</p>
            <div class="flex items-center gap-4 text-caption">
              <span>联系人：{{ client.contact }}</span>
              <span>{{ client.phone }}</span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-display text-2xl">{{ client.projectCount }}</p>
            <p class="text-caption">个项目</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 客户详情页 -->
    <div v-else class="space-y-6">
      <!-- 返回按钮 -->
      <button 
        @click="selectedClient = null"
        class="flex items-center gap-2 text-apple-blue hover:text-apple-blue-hover transition-colors"
      >
        <span>←</span>
        <span>返回客户列表</span>
      </button>

      <!-- 客户信息卡片 -->
      <div class="card">
        <div class="flex items-start gap-6">
          <div 
            class="w-20 h-20 rounded-apple flex items-center justify-center text-white text-3xl font-bold"
            :style="{ backgroundColor: selectedClient.color }"
          >
            {{ selectedClient.name.charAt(0) }}
          </div>
          <div class="flex-1">
            <h2 class="text-title-1 mb-2">{{ selectedClient.name }}</h2>
            <p class="text-body text-apple-gray-400 mb-4">{{ selectedClient.industry }}</p>
            <div class="flex items-center gap-8">
              <div>
                <p class="text-caption mb-1">联系人</p>
                <p class="text-body font-medium">{{ selectedClient.contact }}</p>
              </div>
              <div>
                <p class="text-caption mb-1">电话</p>
                <p class="text-body font-medium">{{ selectedClient.phone }}</p>
              </div>
              <div>
                <p class="text-caption mb-1">合作项目</p>
                <p class="text-body font-medium">{{ selectedClient.projectCount }} 个</p>
              </div>
            </div>
          </div>
          <button class="btn-primary">编辑信息</button>
        </div>
      </div>

      <!-- 关联项目列表 -->
      <div class="card">
        <h3 class="text-title-1 mb-6">关联项目</h3>
        <div class="space-y-4">
          <div 
            v-for="project in clientProjects" 
            :key="project.id"
            class="flex items-center justify-between p-4 bg-apple-bg rounded-apple-sm cursor-pointer hover:bg-apple-gray-100 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div class="w-2 h-12 rounded-full" :style="{ backgroundColor: selectedClient.color }"></div>
              <div>
                <p class="text-title-2">{{ project.name }}</p>
                <p class="text-caption">{{ project.stage }}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="w-32">
                <div class="flex items-center justify-between text-caption mb-1">
                  <span>进度</span>
                  <span>{{ project.progress }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="fill" :style="{ width: project.progress + '%', backgroundColor: selectedClient.color }"></div>
                </div>
              </div>
              <span class="tag" :class="{
                'tag-green': project.status === '已完成',
                'tag-blue': project.status === '进行中'
              }">{{ project.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 合作动态时间线 -->
      <div class="card">
        <h3 class="text-title-1 mb-6">合作动态</h3>
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <div class="w-2 h-2 rounded-full bg-apple-blue mt-2"></div>
            <div>
              <p class="text-body">创建了项目 "某品牌新品发布会"</p>
              <p class="text-caption">2024年3月15日</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-2 h-2 rounded-full bg-apple-green mt-2"></div>
            <div>
              <p class="text-body">项目 "春季产品路演" 已完成交付</p>
              <p class="text-caption">2024年2月28日</p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div class="w-2 h-2 rounded-full bg-apple-gray-400 mt-2"></div>
            <div>
              <p class="text-body">首次建立合作关系</p>
              <p class="text-caption">2023年12月1日</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
