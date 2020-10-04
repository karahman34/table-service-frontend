<template>
  <div class="print-container">
    <!-- Loading -->
    <div
      v-if="loading"
      class="text-center grey--text text--darken-2 mt-14"
    >
      <v-progress-circular
        indeterminate
        size="40"
      />

      <p class="mb-0 mt-4">
        Getting transaction data...
      </p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- The Print Button -->
      <div class="d-flex justify-end mb-4 print-button-container">
        <v-btn
          color="primary"
          @click="print"
        >
          <v-icon>mdi mdi-printer</v-icon>
          <span class="ml-2">Print</span>
        </v-btn>
      </div>

      <!-- The Card -->
      <v-card elevation="0">
        <!-- App Title -->
        <v-card-title class="pb-0 d-flex justify-center">
          {{ appTitle }}
        </v-card-title>

        <!-- Meta -->
        <div class="meta px-4 pt-3">
          <v-row
            no-gutters
            class="grey--text font-weight-bold"
          >
            <v-col
              cols="6"
              class="mb-1"
            >
              Id: {{ transaction.id }}
            </v-col>

            <v-col cols="6">
              <div class="d-flex justify-end">
                Table Number: {{ transaction.order.table.number }}
              </div>
            </v-col>

            <v-col cols="6">
              Cashier: {{ transaction.cashier.username }}
            </v-col>

            <v-col cols="6">
              <div class="d-flex justify-end">
                Date: {{ transaction.created_at }}
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Table -->
        <v-simple-table>
          <template v-slot:default>
            <!-- Headers -->
            <thead>
              <tr>
                <th class="text-left">
                  Name
                </th>
                <th>Price</th>
                <th>Qty</th>
                <th class="text-right">
                  Total
                </th>
              </tr>
            </thead>

            <!-- Body -->
            <tbody>
              <tr
                v-for="item in transaction.order.details"
                :key="item.id"
              >
                <td class="text-left">
                  {{ item.food.name }}
                </td>
                <td>
                  {{ formatMoney(calculateDiscount(item.food)) }}
                </td>
                <td>{{ item.qty }}</td>
                <td class="text-right">
                  {{ formatMoney(calculateDiscount(item.food) * item.qty) }}
                </td>
              </tr>

              <tr>
                <td
                  colspan="4"
                  class="text-right"
                >
                  <span>Subtotal: </span>
                  <span
                    class="font-weight-medium ml-2"
                    style="font-size:17px;"
                  > {{ formatMoney(total) }}</span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </template>
  </div>
</template>

<script>
import transactionApi from '@/api/transactionApi'
import { calculateFoodPrice, rupiah } from '@/helpers/money'

export default {
  data() {
    return {
      transaction: null,
      loading: true,
    }
  },
  
  computed: {
    appTitle() {
      return process.env.VUE_APP_TITLE
    },
    transactionId() {
      return this.$route.params.id 
    },
    total() {
      if (this.transaction === null) return 0

      return this.transaction.order.details.reduce(
        (carry, detail) => carry + this.calculateDiscount(detail.food) * detail.qty, 
        0,
      )
    },
  },

  mounted () {
    this.getTransaction()
  },

  methods: {
    formatMoney(price) {
      return rupiah(price)
    },
    calculateDiscount(food) {
      return calculateFoodPrice(food)
    },
    async getTransaction() {
      try {
        const res = await transactionApi.show(this.transactionId)
        const {ok, data} = res.data

        if (!ok) throw new Error

        this.transaction = data

        setTimeout(() => this.print(), 1000)
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get transaction details.',
        })
      } finally {
        this.loading = false
      }
    },
    print() {
      window.print()
    },
  },
}
</script>

<style lang="scss" scoped>
@media print {
  .print-button-container {
    display: none !important;
  }
}
</style>