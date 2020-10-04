<template>
  <v-dialog
    v-model="dialog"
    scrollable  
    persistent 
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>Create Table</span>

        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- The Form -->
        <v-form @submit.prevent="create($event)">
          <!-- Number -->
          <v-text-field
            v-model="form.number"
            label="Number"
            type="number"
            :error-messages="errors.number"
          />

          <div class="float-right">
            <v-btn
              text
              color="grey"
              @click="closeDialog"
            >
              Close
            </v-btn>
            <v-btn
              text
              type="submit"
              color="createButton"
              :loading="loading"
            >
              Create
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogMixin from '@/mixins/DialogMixin'
import tableApi from '@/api/tableApi'
import { clearValidationErrors, showValidationErrors } from '@/helpers/form'

export default {
  mixins: [DialogMixin],

  data() {
    return {
      form: {
        number: null,
      },
      errors: {
        number: null,
      },
      loading: false,
    }
  },

  methods: {
    async create() {
      this.loading = true
      clearValidationErrors(this.errors)

      try {
        const res = await tableApi.create(this.form)
        const {ok, data} = res.data

        if (!ok) throw new Error

        this.$emit('created', data.table)

        this.$alert.show({
          message: 'Table created.',
        })

        this.closeDialog()
      } catch (err) {
        const errorCode = err?.response?.status

        switch (errorCode) {
        case 422:
          showValidationErrors(this.errors, err.response.data)
          break
        
        default:
          this.$alert.show({
            type: 'error',
            message: 'Failed to create table data.',
          })
          break
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>