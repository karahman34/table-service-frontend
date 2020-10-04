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
      permissions: ['table.index', 'food.index', 'user.index'],
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
  {
    path: '/roles',
    name: 'roles',
    meta: {
      title: 'Roles',
      layout: 'admin',
      auth: true,
      permissions: ['role.index'],
    },
    component: () => import('@/views/administrator/Roles.vue'),
  },
  {
    path: '/permissions',
    name: 'permissions',
    meta: {
      title: 'Permissions',
      layout: 'admin',
      auth: true,
      permissions: ['permission.index'],
    },
    component: () => import('@/views/administrator/Permissions.vue'),
  },
  {
    path: '/categories',
    name: 'categories',
    meta: {
      title: 'Categories',
      layout: 'admin',
      auth: true,
      permissions: ['category.index'],
    },
    component: () => import('@/views/administrator/Categories.vue'),
  },
  {
    path: '/transactions',
    name: 'transactions',
    meta: {
      title: 'Transactions',
      layout: 'admin',
      auth: true,
      permissions: ['transaction.index'],
    },
    component: () => import('@/views/administrator/Transactions.vue'),
  },
  {
    path: '/transactions/:id/print',
    name: 'transactions.print',
    meta: {
      title: 'Transactions',
      layout: 'auth',
      auth: true,
      permissions: ['transaction.index', 'transaction.export'],
    },
    component: () => import('@/views/administrator/Print.vue'),
  },
  {
    path: '/orders',
    name: 'orders',
    meta: {
      title: 'Orders',
      layout: 'admin',
      auth: true,
      permissions: ['order.index'],
    },
    component: () => import('@/views/administrator/Orders.vue'),
  },
]

export default formatRoutes(pathPrefix, namePrefix, routes)