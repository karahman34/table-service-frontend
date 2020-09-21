export default {
  data() {
    return {
      dialog: true,
    }
  },

  watch: {
    dialog(dialog) {
      if (!dialog) this.closeDialog()
    },
  },

  methods: {
    closeDialog() {
      this.$emit('close')
    },
  },
}