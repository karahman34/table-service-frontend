<template>
  <div>
    <!-- Main -->
    <v-main id="main">
      <v-container>
        <!-- Slot -->
        <slot />
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
    
}
</script>

<style lang="scss">
  @import '../../assets/scss/auth/app.scss';
</style>