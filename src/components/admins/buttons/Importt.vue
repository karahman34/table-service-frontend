<template>
  <div class="d-inline">
    <!-- The Import Button -->
    <v-btn
      color="blue white--text"
      @click="dialog = true"
    >
      <v-icon>mdi mdi-upload</v-icon>
      <span class="ml-1">Import</span>
    </v-btn>

    <!-- The Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <span class="ml-1">Import</span>

          <v-btn
            icon
            @click="dialog = false"
          >
            <v-icon>mdi mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form>
            <!-- Import Field -->
            <v-file-input
              v-model="file"
              show-size
              hide-details
              label="File"
              :loading="loading"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            block
            color="blue lighten-1 white--text"
            :disabled="!file || loading"
            @click="goImport"
          >
            <v-icon>mdi mdi-upload</v-icon>
            <span class="ml-1">Import</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    action: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      loading: false,
      file: null,
    }
  },

  methods: {
    async goImport() {
      // Set loading
      this.loading = true

      // Set up form data
      const formData = new FormData
      formData.append('file', this.file)

      try {
        // Make request
        const res = await this.action(formData)
        const {ok} = res.data

        if (!ok) throw new Error

        this.$alert.show({
          message: 'Success to import file data.',
        })

        this.$emit('imported')

        this.dialog = false
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to import file data.',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>