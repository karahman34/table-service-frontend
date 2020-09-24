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
            Are you sure want to delete detail order with id 
          </h3>
          <h3 class="d-inline font-italic orange--text darken-2">
            "{{ detail.id }}"
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
            @click.native="$emit('delete')"
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

export default {
  mixins: [DialogMixin],

  props: {
    detail: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.delete-button:hover {
  background-color: #FF5252 !important;
}
</style>