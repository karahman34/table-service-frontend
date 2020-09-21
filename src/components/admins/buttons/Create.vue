<template>
  <v-btn
    dark
    color="createButton"
  >
    <v-icon>{{ icon }}</v-icon>

    <span>{{ text }}</span>
  </v-btn>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'mdi mdi-plus',
    },
  },
}
</script>