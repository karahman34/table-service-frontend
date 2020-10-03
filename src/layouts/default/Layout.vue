<template>
  <v-app>
    <!-- Navigation -->
    <top-nav />

    <!-- Main -->
    <v-main>
      <!-- The Overlay -->
      <overlay />

      <!-- Container -->
      <v-container>
        <!-- Alert -->
        <alert />

        <!-- View -->
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TopNav from '@/layouts/default/TopNav'
import Alert from '@/components/Alert.vue'
import Overlay from '@/components/Overlay.vue'

export default {
  components: {
    Alert,
    Overlay,
    TopNav,
  },
}
</script>