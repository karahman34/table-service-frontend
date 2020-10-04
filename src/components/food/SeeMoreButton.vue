<template>
  <v-btn
    dark
    color="green"
    :to="to"
  >
    See More
  </v-btn>
</template>

<script>
export default {
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
  },
}
</script>