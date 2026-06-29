<script setup lang="ts">
import { ref } from 'vue'

const viewMode = ref<'list' | 'board'>('board')

// 项目阶段
const stages = [
  { id: 'pitch', name: '打标', color: '#FF9500' },
  { id: 'idea', name: '创意策展', color: '#007AFF' },
  { id: 'production', name: '供应商制作', color: '#5856D6' },
  { id: 'onsite', name: '现场搭建', color: '#34C759' },
  { id: 'close', name: '撤场结案', color: '#8E8E93' },
]

// 示例项目数据
const projects = [
  { id: 1, name: '某品牌新品发布会', client: 'ABC科技', type: 'direct', stage: 'production', progress: 65, budget: 500000 },
  { id: 2, name: '年度经销商大会', client: 'XYZ汽车', type: 'direct', stage: 'onsite', progress: 80, budget: 800000 },
  { id: 3, name: '展厅设计提案', client: 'DEF地产', type: 'pitch', stage: 'pitch', progress: 30, budget: 0, pitchStatus: 'pending' },
  { id: 4, name: '快闪店搭建', client: 'GHI时尚', type: 'direct', stage: 'idea', progress: 20, budget: 300000 },
]

const getProjectsByStage = (stageId: string) => {
  return projects.filter(p => p.stage === stageId)
}
</script>

<template>
  <div class="space-y-6">
    <!-- 视图切换 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 bg-white rounded-apple-sm p-1 shadow-apple">
        <button
          @click="viewMode = 'list'"
          class="px-4 py-2 rounded-apple-sm text-body transition-all"
          :class="viewMode === 'list' ? 'bg-apple-blue text-white' : 'text-apple-gray-400 hover:text-apple-gray-900'"
        >
          列表
        </button>
        <button
          @click="viewMode = 'board'"
          class="px-4 py-2 rounded-apple-sm text-body transition-all"
          :class="viewMode === 'board' ? 'bg-apple-blue text-white' : 'text-apple-gray-400 hover:text-apple-gray-900'"
        >
          看板
        </button>
      </div>
      
      <div class="flex items-center gap-4">
        <select class="px-4 py-2 bg-white rounded-apple-sm border border-apple-gray-100 text-body focus:outline-none focus:border-apple-blue">
          <option>全部类型</option>
          <option>打标项目</option>
          <option>直接落地</option>
        </select>
        <select class="px-4 py-2 bg-white rounded-apple-sm border border-apple-gray-100 text-body focus:outline-none focus:border-apple-blue">
          <option>全部客户</option>
        </select>
      </div>
    </div>

    <!-- 看板视图 -->
    <div v-if="viewMode === 'board'" class="flex gap-6 overflow-x-auto pb-4">
      <div v-for="stage in stages" :key="stage.id" class="flex-shrink-0 w-80">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: stage.color }"></div>
          <h4 class="text-title-2">{{ stage.name }}</h4>
          <span class="text-caption bg-white px-2 py-1 rounded-full">{{ getProjectsByStage(stage.id).length }}</span>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="project in getProjectsByStage(stage.id)"
            :key="project.id"
            class="card cursor-pointer hover:shadow-apple-hover"
          >
            <div class="flex items-start justify-between mb-3">
              <span v-if="project.type === 'pitch'" class="tag tag-orange">打标</span>
              <span v-else class="tag tag-blue">直接落地</span>
            </div>
            
            <h5 class="text-title-2 mb-2">{{ project.name }}</h5>
            <p class="text-caption mb-4">{{ project.client }}</p>
            
            <div class="mb-3">
              <div class="flex items-center justify-between text-caption mb-1">
                <span>进度</span>
                <span>{{ project.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="fill" :style="{ width: project.progress + '%', backgroundColor: stage.color }"></div>
              </div>
            </div>
            
            <div v-if="project.budget > 0" class="flex items-center justify-between text-caption">
              <span>预算</span>
              <span class="font-mono">¥{{ project.budget.toLocaleString() }}</span>
            </div>
            
            <div v-if="project.type === 'pitch'" class="mt-3 pt-3 border-t border-apple-gray-100">
              <span class="text-caption">中标状态：</span>
              <span class="tag" :class="{
                'tag-gray': project.pitchStatus === 'pending',
                'tag-green': project.pitchStatus === 'won',
                'tag-red': project.pitchStatus === 'lost',
              }">
                {{ project.pitchStatus === 'pending' ? '待定' : project.pitchStatus === 'won' ? '已中标' : '未中标' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-else class="card overflow-hidden">
      <table class="w-full">
        <thead class="bg-apple-bg">
          <tr>
            <th class="text-left p-4 text-caption font-medium">项目名称</th>
            <th class="text-left p-4 text-caption font-medium">客户</th>
            <th class="text-left p-4 text-caption font-medium">类型</th>
            <th class="text-left p-4 text-caption font-medium">阶段</th>
            <th class="text-left p-4 text-caption font-medium">进度</th>
            <th class="text-right p-4 text-caption font-medium">预算</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id" class="border-t border-apple-gray-100 hover:bg-apple-bg/50 cursor-pointer transition-colors">
            <td class="p-4">
              <p class="text-body font-medium">{{ project.name }}</p>
            </td>
            <td class="p-4 text-body">{{ project.client }}</td>
            <td class="p-4">
              <span class="tag" :class="project.type === 'pitch' ? 'tag-orange' : 'tag-blue'">
                {{ project.type === 'pitch' ? '打标' : '直接落地' }}
              </span>
            </td>
            <td class="p-4">
              <span class="tag" :style="{ backgroundColor: stages.find(s => s.id === project.stage)?.color + '20', color: stages.find(s => s.id === project.stage)?.color }">
                {{ stages.find(s => s.id === project.stage)?.name }}
              </span>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <div class="w-24 progress-bar">
                  <div class="fill" :style="{ width: project.progress + '%' }"></div>
                </div>
                <span class="text-caption">{{ project.progress }}%</span>
              </div>
            </td>
            <td class="p-4 text-right font-mono text-body">
              {{ project.budget > 0 ? '¥' + project.budget.toLocaleString() : '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
