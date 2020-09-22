import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import administrator from './administrator'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
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
