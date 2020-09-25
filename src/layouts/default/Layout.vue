<template>
  <v-app>
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
import Alert from '@/components/Alert.vue'
import Overlay from '@/components/Overlay.vue'

export default {
  components: {
    Alert,
    Overlay,
  },
}
</script>