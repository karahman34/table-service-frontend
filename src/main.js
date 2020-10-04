import Vue from 'vue'
import App from './App.vue'
import { setTitle } from './helpers/router'
import alertPlugin from './plugins/alert'
import authPlugin from './plugins/auth'
import httpPlugin, { expiredName, removeToken, setToken, tokenName } from './plugins/http'
import overlayPlugin from './plugins/overlay'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'


Vue.config.productionTip = false

// Use plugins
Vue.use(httpPlugin)
Vue.use(authPlugin, {
  store,
})
Vue.use(overlayPlugin, {
  store,
})
Vue.use(alertPlugin, {
  store,
})

async function initial() {
  async function checkTokenAndUser() {
    const token = window.localStorage.getItem(tokenName)
    const expiredDate = window.localStorage.getItem(expiredName)

    if (token && expiredDate) {
      const now = new Date
      const expiredAt = new Date(expiredDate)
      
      if (now > expiredAt) {
        // Expired
        removeToken()
      } else {
        setToken(token)

        // Get user
        try {
          await store.dispatch('auth/getUser')
        } catch (err) {
          removeToken()
        }
      }
    }
  }
  
  await checkTokenAndUser()
}

initial()
  .then(() => {
    // Router Nav Guard
    router.beforeEach((to, from, next) => {
      const {guest, auth, permissions, roles, customer} = to.meta

      // Guest
      if (guest && store.state.auth.loggedIn) {
        return next({
          name: customer ? 'Home' : 'administrator.home',
        })
      }
  
      // Auth
      if (auth && !store.state.auth.loggedIn) {
        const namePath = customer ? 'login' : 'administrator.login'

        return next({
          name: namePath,
          query: {
            redirect: to.fullPath,
          },
        })
      }

      // Permissions
      if (permissions) {
        const redirectPath = { name: 'forbidden' }
        const userPermissions = store.state.auth.user?.permissions
        if (!userPermissions) return next(redirectPath)

        for (const permission of permissions) {
          if (!userPermissions.includes(permission)) return next(redirectPath)
        }
      }

      // Roles
      if (roles) {
        const redirectPath = { name: 'forbidden' }
        const userRoles = store.state.auth.user?.roles
        if (!userRoles) return next(redirectPath)

        for (const role of roles) {
          if (!userRoles.includes(role)) return next(redirectPath)
        }
      }
  
      // Set doc title
      setTitle(to.meta)
      
      // Next
      next()
    })

    // Initiate Vue App
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App),
    }).$mount('#app')
  })

