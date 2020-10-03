<template>
  <v-app>
    <!-- Navigation -->
    <top-nav />

    <!-- Main -->
    <v-main>
      <!-- The Overlay -->
      <overlay />

      <!-- Container -->
      <div
        class="local-container"
        style="margin: 30px 0;"
      >
        <!-- Alert -->
        <alert />

        <!-- View -->
        <router-view />
      </div>
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

<style lang="scss">
  @import '../../assets/scss/default/app.scss';
</style>