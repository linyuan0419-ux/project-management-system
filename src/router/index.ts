import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import DashboardView from '../views/DashboardView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ClientsView from '../views/ClientsView.vue'
import ReportsView from '../views/ReportsView.vue'
import CreativeView from '../views/CreativeView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import LoginView from '../views/LoginView.vue'
import UsersView from '../views/UsersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: '登录', public: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: '工作台', requiresAuth: true },
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
      meta: { title: '项目管理', requiresAuth: true },
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetailView,
      meta: { title: '项目详情', requiresAuth: true },
    },
    {
      path: '/clients',
      name: 'clients',
      component: ClientsView,
      meta: { title: '客户管理', requiresAuth: true },
    },
    {
      path: '/creative',
      name: 'creative',
      component: CreativeView,
      meta: { title: '创意部工作', requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { title: '周报中心', requiresAuth: true },
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { title: '用户管理', requiresAuth: true, requiresAdmin: true },
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }
  
  // 需要管理员权限的页面
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
    return
  }
  
  // 已登录用户访问登录页，重定向到首页
  if (to.meta.public && authStore.isLoggedIn) {
    next('/')
    return
  }
  
  next()
})

export default router
