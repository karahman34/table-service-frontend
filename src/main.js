import Vue from 'vue'
import App from './App.vue'
import authPlugin from './plugins/auth'
import httpPlugin, { http } from './plugins/http'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// Use plugins
Vue.use(httpPlugin)
Vue.use(authPlugin, {
  store,
  http,
  loginUrl: '/auth/login',
  logoutUrl: '/auth/logout',
  userUrl: '/auth/me',
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app')
