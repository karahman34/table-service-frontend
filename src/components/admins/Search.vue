<template>
  <v-text-field
    v-model="search"
    single-line
    hide-details
    placeholder="Search..."
    prepend-inner-icon="mdi mdi-magnify"
    class="mb-2"
    :loading="loading"
  />
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      search: null,
      timeout: null,
    }
  },

  watch: {
    search(val) {
      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => this.$emit('search', val), 600)
    },
  },
}
</script>