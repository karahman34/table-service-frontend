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
import DefaultLayout from '@/layouts/default/Layout.vue'

export default {
  name: 'App',

  components: {
    AdminLayout,
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
