import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import administrator from './administrator'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      auth: true,
      customer: true,
      permissions: ['food.index'],
    },
    component: Home,
  },
  {
    path: '/search',
    name: 'search',
    meta: {
      auth: true,
      customer: true,
      permissions: ['food.index'],
    },
    component: () => import('@/views/Search.vue'),
  },
  ...administrator,
  {
    path: '/forbidden',
    name: 'forbidden',
    meta: {
      title: 'Forbidden',
      layout: 'error',
    },
    component: () => import('@/views/Forbidden.vue'),
  },
  {
    path: '*',
    meta: {
      title: 'Page not found',
      layout: 'error',
    },
    component: () => import('@/views/PageNotFound.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
