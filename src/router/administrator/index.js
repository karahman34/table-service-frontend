import { formatRoutes } from '@/helpers/router'

const pathPrefix = '/administrator'
const namePrefix = 'administrator.'
const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: 'Dashboard',
      layout: 'admin',
    },
    component: () => import('@/views/administrator/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login',
      layout: 'auth',
    },
    component: () => import('@/views/administrator/Login.vue'),
  },
]

export default formatRoutes(pathPrefix, namePrefix, routes)