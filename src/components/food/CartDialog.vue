<template>
  <v-dialog
    v-model="dialog"
    max-width="750px"
    transition="dialog-transition"
  >
    <!-- Card -->
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between">
        <span>New Item</span>

        <v-btn
          icon
          @click="closeDialog($event)"
        >
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Content -->
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <v-img :src="food.image" />
          </v-col>

          <v-col
            cols="12"
            sm="6"
          >
            <!-- Alert Message -->
            <v-alert
              v-if="!itemAvailable && !isEdit"
              dense
              type="error"
            >
              Item is already exist in your cart.
            </v-alert>

            <p class="food-name">
              {{ food.name }}
            </p>

            <p class="food-price">
              <span>{{ formatMoney(foodPrice) }}</span>
              <span
                v-if="parseInt(food.discount) > 0"
                class="orange px-1 ml-2 white--text font-weight-medium"
              >
                {{ food.discount }}% OFF
              </span>
            </p>

            <p class="food-description">
              {{ food.description }}
            </p>

            <!-- The Form -->
            <v-form @submit.prevent="formSubmit($event)">
              <!-- Tips -->
              <v-textarea
                v-model="form.tips"
                filled
                auto-grow
                hide-details
                rows="1"
                label="Tips *optional*"
              />

              <!-- Qty -->
              <div class="qty-container mt-3 mb-2">
                <label
                  for="qty"
                  class="d-block font-weight-medium grey--text text--darken-2"
                >Qty</label>

                <input
                  id="qty"
                  v-model="form.qty"
                  type="number"
                  placeholder="Qty"
                  value="0"
                >

                <!-- Minus -->
                <v-btn
                  icon
                  class="increment-btn minus"
                  @click="() => form.qty > 0 ? form.qty -= 1 : null"
                >
                  <v-icon>mdi mdi-minus</v-icon>
                </v-btn>

                <!-- Plus -->
                <v-btn
                  icon
                  class="increment-btn plus"
                  @click="form.qty += 1"
                >
                  <v-icon>mdi mdi-plus</v-icon>
                </v-btn>
              </div>

              <!-- Total -->
              <div class="total float-right mb-1">
                <span class="font-weight-medium">Total: </span>
                <span class="font-weight-bold">{{ formatMoney(total) }}</span>
              </div>

              <!-- Submit -->
              <v-btn
                v-if="!isEdit"
                block
                type="submit"
                color="green lighten-1 white--text"
                :disabled="!itemAvailable || form.qty < 1"
              >
                <v-icon>mdi mdi-cart</v-icon>
                <span class="ml-2">Add to cart</span>
              </v-btn>

              <!-- Update Button -->
              <v-btn
                v-else
                block
                type="submit"
                color="green lighten-1 white--text"
              >
                <v-icon>mdi mdi-pencil</v-icon>
                <span class="ml-1">Update</span>
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { rupiah } from '@/helpers/money'
import DialogMixin from '@/mixins/DialogMixin'

export default {
  mixins: [DialogMixin],

  props: {
    food: {
      type: Object,
      required: true,
    },
    cart: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      form: {
        qty: 0,
        tips: null,
      },
    }
  },

  computed: {
    ...mapState('cart', {
      carts: state => state.items,
    }),
    isEdit() {
      return this.cart !== null
    },
    itemAvailable() {
      const cartsFoodIds = this.carts.map(cart => cart.food.id)

      return !cartsFoodIds.includes(this.food.id)
    },
    total() {
      return this.foodPrice * this.form.qty
    },
    foodPrice() {
      const price = parseInt(this.food.price)
      const discount = parseInt(this.food.discount)
      if (discount === 0) return price

      const discountPrice = (discount / 100) * price
      const totalDiscount = price - discountPrice

      return totalDiscount
    },
  },

  mounted () {
    if(this.isEdit) {
      const {qty, tips} = this.cart

      this.form = {
        qty,
        tips,
      }
    }
  },

  methods: {
    ...mapMutations('cart', {
      pushItems: 'SET_ITEMS',
      updateItem: 'UPDATE_ITEM',
    }),
    formatMoney(price) {
      return rupiah(price)
    },
    formSubmit() {
      return !this.isEdit ? this.save() : this.update()
    },
    async save() {
      if (this.form.qty < 1) return

      try {
        await this.pushItems({
          food: this.food,
          ...this.form,
        })

        this.$alert.show({
          message: 'Item successfully added to the cart.',
        })

        this.form = {
          qty: 0,
          tips: null,
        }

        this.closeDialog()
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Something went wrong.',
        })
      }
    },
    async update() {
      try {
        await this.updateItem({
          food: this.food,
          ...this.form,
        })

        this.$alert.show({
          message: 'Item updated.',
        })
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Something went wrong.',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.food-name {
  font-size: 24px;
  font-weight: bold;
}

.food-price {
  font-size: 18px;
  font-weight: 500;
}

.food-description {
  font-weight: 500;
}

.qty-container {
  position: relative;

  input[type=number] {
    height: 35px;
    text-align: center;
    margin-top: 4px;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    padding: 5px 10px;
  }

  input[type=number]:focus {
    outline: none;
  }

  .increment-btn {
    height: 35px;
    position: absolute;
    border-radius: 4px;
    color: white;
    background-color: #66BB6A;
  }

  .increment-btn.minus {
    left: 0;
    margin-top: 4px;
  }

  .increment-btn.plus {
    right: 0;
    margin-top: 4px;
  }
}
</style>