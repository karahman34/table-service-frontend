<template>
  <div>
    <v-overlay :value="overlay === true">
      <div class="text-center">
        <v-progress-circular indeterminate />

        <p class="ma-0 mt-3">
          {{ message }}
        </p>
      </div>
    </v-overlay>
  </div>
</template>

<script>
export default {
  computed: {
    overlay() {
      return this.$overlay.value
    },

    message() {
      return this.$overlay.message || 'Loading ...'
    },
  },
}
</script>