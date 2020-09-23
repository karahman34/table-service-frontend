<template>
  <v-dialog
    v-model="dialog"
    scrollable  
    persistent 
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-text class="d-flex flex-column align-center flex-grow-1">
        <v-icon
          class="d-block error--text mt-2"
          style="font-size: 60px"
        >
          mdi mdi-alert-octagram
        </v-icon>
        
        <div class="my-3">
          <h3 class="d-inline">
            Are you sure want to delete
          </h3>
          <h3 class="d-inline font-italic orange--text darken-2">
            {{ role.name }} 
          </h3> 
          <h3 class="d-inline-block ml-1">
            ?
          </h3>
        </div>

        <div>
          <v-btn
            color="grey lighten-2"
            @click="closeDialog"
          >
            <v-icon>mdi mdi-close-circle</v-icon>
            <span class="ml-1">Cancel</span>
          </v-btn>

          <v-btn
            dark
            class="ml-3 delete-button"
            :loading="loading"
            @click.native="deleteItem"
          >
            <v-icon>mdi mdi-trash-can</v-icon>
            <span class="ml-1">Delete</span>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogMixin from '@/mixins/DialogMixin'
import roleApi from '@/api/roleApi'

export default {
  mixins: [DialogMixin],

  props: {
    role: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
    }
  },

  methods: {
    async deleteItem() {
      this.loading = true

      try {
        const res = await roleApi.delete(this.role.id)
        const {ok} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Role deleted.',
          })

          this.$emit('deleted', this.role)
        }
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to delete role item.',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.delete-button:hover {
  background-color: #FF5252 !important;
}
</style>