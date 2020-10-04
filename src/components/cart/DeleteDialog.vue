<template>
  <v-dialog
    v-model="dialog"
    scrollable  
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>Delete Item</span>
        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <p class="mb-0">
          Are you sure wan't to delete <span class="orange--text text--lighten-1">{{ cart.food.name }}</span> ?
        </p>

        <div class="float-right mt-4">
          <v-btn
            class="mr-3"
            color="grey lighten-3"
            @click="closeDialog"
          >
            Close
          </v-btn>
          
          <v-btn
            color="error"
            :loading="loading"
            @click="remove"
          >
            Delete
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogMixin from '@/mixins/DialogMixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [DialogMixin],

  props: {
    cart: {
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
    ...mapMutations('cart', {
      deleteItem: 'REMOVE_ITEM',
    }),
    async remove() {
      this.loading = true

      try {
        await this.deleteItem(this.cart.food)

        this.$alert.show({
          message: 'Item deleted.',
        })

        this.$emit('deleted')
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to delete item.',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>