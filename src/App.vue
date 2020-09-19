<template>
  <v-app>
    <!-- Layout -->
    <component :is="layout">
      <!-- Router View -->
      <router-view />
    </component>
  </v-app>
</template>

<script>
import AdminLayout from '@/layouts/admin/Layout.vue'
import AuthLayout from '@/layouts/auth/Layout.vue'
import DefaultLayout from '@/layouts/default/Layout.vue'
import { expiredName, removeToken, setToken, tokenName } from './plugins/http'

export default {
  name: 'App',

  components: {
    AdminLayout,
    AuthLayout,
    DefaultLayout,
  },

  data: () => ({
    //
  }),

  computed: {
    layout() {
      const layout = this.$route.meta?.layout

      if (!layout) return 'default-layout'

      return layout + '-layout'
    },
  },

  created () {
    this.checkTokenAndUser()
  },

  methods: {
    async checkTokenAndUser() {
      const token = window.localStorage.getItem(tokenName)
      const expiredDate = window.localStorage.getItem(expiredName)

      if (token && expiredDate) {
        const now = new Date
        const expiredAt = new Date(expiredDate)
        
        if (expiredAt > now) {
          setToken(token)
          this.$auth.setToken(token)

          // Get user
          const res = await this.$auth.getUser()

          if (!res) {
            removeToken()

            this.$auth.setUser(null)
            this.$auth.setToken(null)
            this.$auth.setLoggedIn(false)
          }
        } else {
          removeToken()
        }
      }
    },
  },
}
</script>
