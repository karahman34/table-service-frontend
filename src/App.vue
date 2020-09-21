<template>
  <div>
    <!-- Layout -->
    <component :is="layout">
      <!-- Router View -->
      <router-view />
    </component>
  </div>
</template>

<script>
import AdminLayout from '@/layouts/admin/Layout.vue'
import AuthLayout from '@/layouts/auth/Layout.vue'
import DefaultLayout from '@/layouts/default/Layout.vue'

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
}
</script>
