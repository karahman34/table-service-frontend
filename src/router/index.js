import { setTitle } from '@/helpers/router'
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
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  // Set doc title
  setTitle(to.meta)

  // Go next
  next()
})

export default router
