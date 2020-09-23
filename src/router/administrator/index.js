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
      auth: true,
    },
    component: () => import('@/views/administrator/Home.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login',
      layout: 'auth',
      guest: true,
    },
    component: () => import('@/views/administrator/Login.vue'),
  },
  {
    path: '/foods',
    name: 'foods',
    meta: {
      title: 'Foods',
      layout: 'admin',
      auth: true,
      permissions: ['food.index'],
    },
    component: () => import('@/views/administrator/Foods.vue'),
  },
  {
    path: '/users',
    name: 'users',
    meta: {
      title: 'Users',
      layout: 'admin',
      auth: true,
      permissions: ['user.index'],
    },
    component: () => import('@/views/administrator/Users.vue'),
  },
]

export default formatRoutes(pathPrefix, namePrefix, routes)