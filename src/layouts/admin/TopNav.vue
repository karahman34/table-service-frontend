<template>
  <v-app-bar
    app
    clipped-left
    dark
    color="grey darken-4"
    elevation="6"
  >
    <v-app-bar-nav-icon @click="$emit('toggle-sidebar')" />
    <v-toolbar-title>{{ appTitle }}</v-toolbar-title>

    <v-spacer />

    <div v-if="$auth.user !== null">
      @{{ $auth.user.username }}
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'TopNavigation',

  computed: {
    appTitle() {
      return process.env.VUE_APP_TITLE
    },
  },
}
</script>

<style scoped>
.menu-activator {
  cursor: pointer;
}
</style>