<template>
  <v-card
    :elevation="elevation"
    :style="{'border-radius': borderRadius}"
  >
    <slot />
  </v-card>
</template>

<script>
export default {
  props: {
    elevation: {
      type: [String, Number],
      default: 4, 
    },

    borderRadius: {
      type: String,
      default: '5px',
    },
  },
}
</script>