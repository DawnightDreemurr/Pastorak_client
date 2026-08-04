import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/LandingPage.vue') },
    { path: '/auth', name: 'auth', component: () => import('../views/UserAuth.vue') },
    {
      path: '/test',
      component: () => import('@/page/Test.vue'),
    },
    {
      path: '/admin',
      name: 'AdminPanel',
      component: () => import('@/views/app/AdminPanel.vue'),
      meta: {
        title: '管理后台',
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    // ✅ 登录后的主区域
    {
      path: '/app',
      component: () => import('../layout/AppLayout.vue'),
      meta: { requiresAuth: true },
      redirect: '/app/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('../views/Dashboard.vue'),
          meta: { title: '工作台' },
        },

        { path: 'shop', component: () => import('../views/Shop.vue'), meta: { title: '农资商城' } },
        { path: 'cart', component: () => import('../views/Cart.vue'), meta: { title: '购物车' } },
        {
          path: 'orders',
          component: () => import('../views/Orders.vue'),
          meta: { title: '我的订单' },
        },
        {
          path: 'fields',
          component: () => import('../views/Fields.vue'),
          meta: { title: '农田管理' },
        },
        {
          path: 'market',
          component: () => import('../views/Market.vue'),
          meta: { title: '玉米行情' },
        },
        {
          path: 'weather',
          component: () => import('../views/Weather.vue'),
          meta: { title: '天气' },
        },
        {
          path: 'news',
          name: 'news-list',
          component: () => import('../views/News.vue'),
          meta: { title: '农业资讯' },
        },
        {
          path: 'news/:id',
          name: 'news-detail',
          component: () => import('@/views/ArticleDetail.vue'),
          meta: { title: '文章详情' },
        },
        { path: 'ai', component: () => import('../views/Ai.vue'), meta: { title: 'AI 识别' } },
        {
          path: 'notifications',
          component: () => import('../views/Notifications.vue'),
          meta: { title: '通知中心' },
        },
        {
          path: 'profile',
          component: () => import('../views/Profile.vue'),
          meta: { title: '个人资料' },
        },
      ],
    },

    // 兜底
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// ✅ 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  // 1) 访问需要登录的页面但没 token
  if (to.meta.requiresAuth && !token) return next('/auth')

  // // 2) 已登录还访问 auth，踢回 dashboard
  // if (to.path === '/auth' && token) return next('/app/dashboard')

  if (to.meta?.requiresAdmin && user?.role !== 'admin') {
    return next('/app/dashboard')
  }

  next()
})

export default router
