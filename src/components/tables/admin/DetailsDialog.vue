<template>
  <div>
    <v-dialog
      v-model="dialog"
      scrollable  
      max-width="900px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <span>Table No. {{ table.number }}</span>

          <v-btn
            icon
            @click="closeDialog()"
          >
            <v-icon>mdi mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <!-- The Form -->
          <v-form @submit.prevent="update($event)">
            <v-row>
              <v-col cols="6">
                <!-- Number -->
                <v-text-field
                  v-model="form.number"
                  label="Number"
                  type="number"
                  :error-messages="errors.number"
                />
              </v-col>

              <v-col cols="6">
                <!-- Available -->
                <v-select
                  v-model="form.available"
                  :items="selectOptions"
                  label="Available"
                />
              </v-col>
            </v-row>

            <!-- Footer -->
            <div class="d-flex flex-wrap justify-space-between">
              <!-- Details -->
              <v-btn
                color="info"
                :loading="getOrderLoading"
                :disabled="table.available === 'Y'"
                @click="getOrder"
              >
                <v-icon>mdi mdi-eye</v-icon>
                <span class="ml-1">Order Details</span>
              </v-btn>

              <!-- Right -->
              <div>
                <!-- Delete -->
                <v-btn
                  dark
                  type="button"
                  class="mr-4"
                  color="deleteButton"
                  @click="deleteDialog = true"
                >
                  <v-icon>mdi mdi-trash-can</v-icon>
                  <span class="ml-1">Delete</span>
                </v-btn>

                <!-- Update -->
                <v-btn
                  dark
                  type="submit"
                  color="indigo"
                  :loading="loadingForm"
                >
                  <v-icon>mdi mdi-pencil</v-icon>
                  <span class="ml-1">Update</span>
                </v-btn>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Order Details Dialog -->
    <order-details-dialog
      v-if="order !== null && orderDetailsDialog"
      :order="order"
      @close="orderDetailsDialog = false"
      @deleted="order = null, getOrder()"
      @food-served="order = null, getOrder()"
      @transaction-created="$emit('checked-out')"
    />

    <!-- Delete Dialog -->
    <delete-dialog
      v-if="deleteDialog"
      :table="table"
      @close="deleteDialog = false"
      @deleted="deleteDialog = false, $emit('deleted', $event)"
    />
  </div>
</template>

<script>
import { clearValidationErrors, showValidationErrors } from '@/helpers/form'
import tableApi from '@/api/tableApi'
import DialogMixin from '@/mixins/DialogMixin'
import OrderDetailsDialog from '@/components/order/admin/DetailsDialog.vue'
import DeleteDialog from './DeleteDialog.vue'

export default {
  components: {
    DeleteDialog,
    OrderDetailsDialog,
  },

  mixins: [DialogMixin],

  props: {
    table: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      form: {
        number: null,
        available: null,
      },
      errors: {
        number: null,
        available: null,
      },
      selectOptions: [
        {
          text: 'Yes',
          value: 'Y',
        },
        {
          text: 'Busy',
          value: 'N',
        },
      ],
      loadingForm: false,
      order: null,
      getOrderLoading: false,
      orderDetailsDialog: false,
      deleteDialog: false,
    }
  },

  mounted () {
    this.setDefaultValue()
  },

  methods: {
    setDefaultValue() {
      const tableKeys = Object.keys(this.form)

      for (const key in this.form) {
        if (tableKeys.includes(key)) {
          this.form[key] = this.table[key]
        }
      }
    },
    async getOrder() {
      this.getOrderLoading = true

      try {
        const res = await tableApi.getOrder(this.table.id)
        const {ok, data} = await res.data

        if (!ok) throw new Error

        this.order = data.order

        this.order !== null 
          ? this.orderDetailsDialog = true
          : this.$alert.show({
            message: 'The customer hasn\'t ordered anything at this time',
          })
        
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get order details.',
        })
      } finally {
        this.getOrderLoading = false
      }
    },
    async update() {
      this.loadingForm = true
      clearValidationErrors(this.errors)

      try {
        const res = await tableApi.update(this.table.id, {
          ...this.form,
          _method: 'PATCH',
        })
        const {ok, data} = res.data

        if (!ok) throw new Error

        this.$emit('updated', data.table)

        this.$alert.show({
          message: 'Table updated.',
        })
      } catch (err) {
        const errorCode = err?.response?.status

        switch (errorCode) {
        case 422:
          showValidationErrors(this.errors, err.response.data)
          break
        
        default:
          this.$alert.show({
            type: 'error',
            message: 'Failed to update table data.',
          })
          break
        }
      } finally {
        this.loadingForm = false
      }
    },
  },
}
</script>