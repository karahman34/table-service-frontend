<template>
  <div>
    <v-dialog
      v-model="dialog"
      scrollable  
      persistent 
      max-width="1200px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <span>Order Details</span>

          <v-btn
            icon
            @click="closeDialog"
          >
            <v-icon>mdi mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <!-- The Table -->
          <v-data-table
            hide-default-footer
            :headers="headers"
            :items="order.details"
          >
            <!-- Price -->
            <template v-slot:[`item.food.price`]="{item}">
              {{ formatMoney(calculateTotalPrice(item.food)) }}
            </template>

            <!-- Tips -->
            <template v-slot:[`item.tips`]="{item}">
              <span
                v-if="item.tips"
                v-text="item.tips"
              />

              <span
                v-else
                class="grey--text"
              >No tips.</span>
            </template>

            <!-- Total -->
            <template v-slot:[`item.total`]="{item}">
              {{ formatMoney(calculateSubTotalPrice(item)) }}
            </template>

            <!-- Served At -->
            <template v-slot:[`item.served_at`]="{item}">
              <!-- Served -->
              <span
                v-if="item.served_at"
              >{{ item.served_at }}</span>

              <!-- Not Served -->
              <v-btn
                v-else
                icon
                color="error"
                :loading="serveDetailLoadingId === item.id"
                @click="serveFood(item)"
              >
                <v-icon>mdi mdi-close</v-icon>
              </v-btn>
            </template>

            <!-- Actions -->
            <template v-slot:[`item.actions`]="{item}">
              <!-- Delete Button -->
              <delete-btn @click="focusItem = item, deleteDialog = true" />
            </template>
          </v-data-table>

          <!-- Footer -->
          <div class="float-right mt-3">
            <!-- Total -->
            <div
              id="total"
            >
              <span class="d-inline font-weight-medium mr-1">
                Total:
              </span>
              <p
                class="d-inline grey--text text--darken-2 font-weight-bold"
                style="font-size: 16px;"
              >
                {{ formatMoney(totalPrice) }}
              </p>
            </div>

            <!-- Checkout Button -->
            <v-btn
              v-if="!checkedOut"
              block
              color="success"
              :loading="checkoutLoading"
              @click="checkout"
            >
              <v-icon>mdi mdi-cart</v-icon>
              <span class="ml-1">Checkout</span>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <delete-dialog
      v-if="deleteDialog"
      :detail="focusItem"
      :loading="deleteLoading"
      @close="deleteDialog = false, focusItem = null"
      @delete="deleteDetail"
    />
  </div>
</template>

<script>
import DialogMixin from '@/mixins/DialogMixin'
import DeleteDialog from './DeleteDetailDialog.vue'
import DeleteBtn from '@/components/admins/buttons/Delete.vue'
import orderApi from '@/api/orderApi'
import transactionApi from '@/api/transactionApi'
import { rupiah } from '@/helpers/money'

export default {
  components: {
    DeleteBtn,
    DeleteDialog,
  },

  mixins: [DialogMixin],

  props: {
    order: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      headers: [
        {
          text: 'Id',
          value: 'id',
        },
        {
          text: 'Food',
          value: 'food.name',
        },
        {
          text: 'Food Price',
          value: 'food.price',
        },
        {
          text: 'Qty',
          value: 'qty',
        },
        {
          text: 'Total',
          value: 'total',
        },
        {
          text: 'Tips',
          value: 'tips',
        },
        {
          text: 'Served At',
          value: 'served_at',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          searchable: false,
        },
      ],
      focusItem: null,
      deleteDialog: false,
      deleteLoading: false,
      checkoutLoading: false,
      serveDetailLoadingId: null,
    }
  },

  computed: {
    totalPrice() {
      return this.order.details.reduce((carry, detail) => {
        
        carry += this.calculateSubTotalPrice(detail)
         
        return carry
      }, 0)
    },
    checkedOut() {
      return this.order.status.toLowerCase() === 'y'
    },
  },

  methods: {
    formatMoney(price) {
      return rupiah(price)
    },
    calculateTotalPrice(food) {
      const foodPrice = parseFloat(food.price)
      const foodDiscount = parseFloat(food.discount)

      let totalPrice = foodPrice

      if (foodDiscount > 0) {
        totalPrice = foodPrice - (foodDiscount / 100 * foodPrice)
      }

      return totalPrice
    },
    calculateSubTotalPrice(detail) {
      const qty = parseInt(detail.qty)

      return this.calculateTotalPrice(detail.food) * qty
    },
    async serveFood(detail) {
      this.serveDetailLoadingId = detail.id

      try {
        const res = await orderApi.serveFood(this.order.id, detail.id)
        const {ok, data} = res.data

        if (!ok) {
          throw new Error
        }

        this.$alert.show({
          message: 'Data updated.',
        })

        this.$emit('food-served', data.order)
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to update data.',
        })
      } finally {
        this.serveDetailLoadingId = null
      }
    },
    async deleteDetail() {
      this.deleteLoading = true

      try {
        const res = await orderApi.deleteDetail(this.order.id, this.focusItem.id)
        const {ok} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Detail order deleted.',
          })

          this.focusItem = null
          this.deleteDialog = false

          this.$emit('deleted', this.focusItem)
        }
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to delete detail order.',
        })
      } finally {
        this.deleteLoading = false
      }
    },
    async checkout() {
      this.checkoutLoading = true

      try {
        const res = await transactionApi.create({
          _order_id: this.order.id,
        })
        const {ok} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Success to create the transaction.',
          })

          this.$emit('transaction-created')
        }
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to create the transaction.',
        })
      } finally {
        this.checkoutLoading = false
      }
    },
  },
}
</script>