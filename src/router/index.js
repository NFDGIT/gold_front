import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/home/Home.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import(/* webpackChunkName: "category" */ '@/views/setting/Setting.vue'),
      meta: {
        index: 1
      }
    },
    {
      path: '/manager',
      name: 'manager',
      component: () => import(/* webpackChunkName: "category" */ '@/views/user/UserManager.vue'),
      meta: {
        index: 1
      }
    }
  ]
})

export default router