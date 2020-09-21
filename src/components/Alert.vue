<template>
  <div>
    <v-snackbar
      top
      bottom
      :value="value"
      :color="color"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          :color="color ? null : 'orange'"
          v-bind="attrs"
          @click.native="$alert.close()"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clearTimeout: null,
    }
  },

  computed: {
    value() {
      return this.$alert.value 
    },
    message() {
      return this.$alert.message 
    },
    color() {
      return this.$alert.color 
    },
    timeout() {
      return this.$alert.timeout 
    },
  },

  watch: {
    value(val) {
      this.clearTimeout = clearTimeout(this.clearTimeout)

      if (val) {
        this.clearTimeout = setTimeout(() => this.$alert.close(), this.timeout)
      }
    },
    message(val, old) {
      if (!val || val === old || !old) return
      if (this.clearTimeout !== null) clearTimeout(this.clearTimeout)

      const currentOptions = {
        message: this.message,
        timeout: this.timeout,
        color: this.color,
      }

      this.$alert.close()

      this.$nextTick(() => {
        setTimeout(() => this.$alert.show(currentOptions), 400)
      })
    },
  },
}
</script>