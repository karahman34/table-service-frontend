<template>
  <v-app>
    <!-- Main -->
    <v-main id="main">
      <v-container>
        <!-- Slot -->
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
    
}
</script>

<style lang="scss">
  @import '../../assets/scss/auth/app.scss';
</style>