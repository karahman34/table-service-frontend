<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon>mdi mdi-cart</v-icon>
        <span class="ml-2">Carts</span>
      </v-card-title>

      <v-card-text>
        <!-- The Search -->
        <search
          :loading="false"
          @search="search = $event"
        />

        <!-- The DataTable -->
        <v-data-table
          class="mb-3"
          hide-default-footer
          :headers="headers"
          :items="carts"
          :search="search"
          :items-per-page="-1"
        >
          <!-- Image -->
          <template v-slot:[`item.food.image`]="{item}">
            <v-img
              :src="item.food.image"
              height="150"
              width="300"
            />
          </template>

          <!-- Price -->
          <template v-slot:[`item.food.price`]="{item}">
            {{ formatMoney(calculateDiscount(item.food)) }}
          </template>

          <!-- Tips -->
          <template v-slot:[`item.tips`]="{item}">
            <span
              v-if="!item.tips"
              class="grey--text"
            >No tips.</span>
            <span v-else>{{ item.tips }}</span>
          </template>

          <!-- Total -->
          <template v-slot:[`item.total`]="{item}">
            {{ formatMoney(calculateDiscount(item.food) * item.qty) }}
          </template>

          <!-- Actions -->
          <template v-slot:[`item.actions`]="{item}">
            <v-btn
              icon
              color="warning"
              @click="focusItem = item, editDialog = true"
            >
              <v-icon>mdi mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              icon
              color="error"
              @click="focusItem = item, deleteDialog = true"
            >
              <v-icon>mdi mdi-trash-can</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <!-- Checkout -->
        <div class="text-right">
          <div>
            <span
              style="font-size:15px;"
              class="mr-2"
            >Total: </span>
            <p
              class="mb-2 d-inline-block font-weight-medium grey--text text--darken-2"
              style="font-size:18px;"
            >
              {{ formatMoney(total) }}
            </p>
          </div>
          
          <v-btn
            color="green lighten-1 white--text"
            :disabled="!carts.length"
            @click="checkout"
          >
            <v-icon>mdi mdi-cart</v-icon>
            <span class="ml-1">Check out</span>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- The Edit Dialog -->
    <cart-dialog
      v-if="focusItem && editDialog"
      :food="focusItem.food"
      :cart="focusItem"
      @close="focusItem = null, editDialog = false"
    />

    <!-- The Delete Dialog -->
    <delete-dialog
      v-if="focusItem && deleteDialog"
      :cart="focusItem"
      @close="focusItem = null, deleteDialog = false"
      @deleted="focusItem = null, deleteDialog = false"
    />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { rupiah } from '@/helpers/money'
import orderApi from '@/api/orderApi'
import Search from '@/components/admins/Search'
import CartDialog from '@/components/food/CartDialog'
import DeleteDialog from '@/components/cart/DeleteDialog'

export default {
  components: {
    Search,
    CartDialog,
    DeleteDialog,
  },

  data() {
    return {
      headers: [
        {
          text: 'Image',
          value: 'food.image',
          sortable: false,
          filterable: false,
        },
        {
          text: 'Name',
          value: 'food.name',
        },
        {
          text: 'Tips',
          value: 'tips',
        },
        {
          text: 'Price',
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
          text: 'Actions',
          value: 'actions',
          sortable: false,
          filterable: false,
        },
      ],
      search: null,
      focusItem: null,
      editDialog: false,
      deleteDialog: false,
    }
  },

  computed: {
    ...mapState('table', {
      tableNumber: state => state.number,
    }),
    ...mapState('cart', {
      carts: state => state.items,
    }),
    total() {
      return this.carts.reduce((carry, cart) => {
        return carry + (this.calculateDiscount(cart.food) * cart.qty)
      }, 0)
    },
  },

  methods: {
    ...mapMutations('cart', {
      clearCarts: 'CLEAR',
    }),
    formatMoney(price) {
      return rupiah(price)
    },
    calculateDiscount(food) {
      let price = food.price
      const discount = food.discount

      if (parseInt(discount) > 0) {
        const discountPrice = discount / 100 * price
        price -= discountPrice
      }

      return price
    },
    async checkout() {
      // Set Loading
      this.$overlay.show()
    
      const payload = {
        table_number: this.tableNumber,
        details: this.carts.map(cart => ({
          food_id: cart.food.id,
          tips: cart.tips,
          qty: cart.qty,
        })),
      }

      try {
        const res = await orderApi.create(payload)
        const { ok } = res.data

        if (!ok) throw new Error

        this.$alert.show({
          message: 'success to make an order, now please wait..',
        })

        this.clearCarts()
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to make an order.',
        })
      } finally {
        this.$overlay.close()
      }
    },
  },
}
</script>