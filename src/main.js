import Vue from 'vue'
import App from './App.vue'
import { setTitle } from './helpers/router'
import authPlugin from './plugins/auth'
import httpPlugin, { expiredName, removeToken, setToken, tokenName } from './plugins/http'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'


Vue.config.productionTip = false

// Use plugins
Vue.use(httpPlugin)
Vue.use(authPlugin, {
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
        const res = await store.dispatch('auth/getUser')
        const {ok} = res.data

        if (!ok) removeToken()
      }
    }
  }
  
  await checkTokenAndUser()

  router.beforeEach((to, from, next) => {
    const guest = to.meta?.guest
    if (guest && store.state.auth.loggedIn) {
      return next({
        name: 'administrator.home',
      })
    }

    const auth = to.meta?.auth
    if (auth && !store.state.auth.loggedIn) {
      return next({
        name: 'administrator.login',
      })
    }

    // Set doc title
    setTitle(to.meta)
    
    // Next
    next()
  })
}

initial()
  .then(() => {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App),
    }).$mount('#app')
  })

