import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ClientsView from '../views/ClientsView.vue'
import ReportsView from '../views/ReportsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: '工作台' },
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
      meta: { title: '项目管理' },
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientsView,
      meta: { title: '客户管理' },
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { title: '周报中心' },
    },
  ],
})

export default router
