<template>
  <div class="d-inline">
    <v-menu offset-y>
      <template v-slot:activator="{on}">
        <v-btn
          color="red lighten-1 white--text"
          :disabled="loading"
          v-on="on"
        >
          <v-icon>mdi mdi-download</v-icon>
          <span
            v-if="!loading"
            class="ml-1"
          >Export</span>
          <span
            v-else
            class="ml-1"
          >Exporting...</span>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          class="grey--text text--darken-2"
          @click="goExport('xlsx')"
        >
          <v-list-item-title>XLSX</v-list-item-title>
        </v-list-item>
        <v-list-item
          class="grey--text text--darken-2"
          @click="goExport('csv')"
        >
          <v-list-item-title>CSV</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    action: {
      type: Function,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
    }
  },

  methods: {
    async goExport(type) {
      if (this.loading) return
      this.loading = true
      
      try {
        // Make request
        const res = await this.action({
          type,
        })

        const fileUrl = URL.createObjectURL(new Blob([res.data]))
        const fileLink = document.createElement('a')

        let date = new Date
        date = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

        fileLink.href = fileUrl
        fileLink.setAttribute('download', `${this.title.toLowerCase()}_${date}.${type}`)
        document.body.appendChild(fileLink)

        fileLink.click()
        fileLink.remove()
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get export file.',
        }) 
      } finally {
        this.loading = false
      }
    },
  },
}
</script>