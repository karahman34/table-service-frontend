<template>
  <v-card
    elevation="3"
    class="food"
  >
    <v-img
      :src="food.image"
      height="220"
    />

    <v-card-text>
      <span class="food-name d-block">{{ food.name }}</span>
      <span class="food-price">{{ formatMoney(food.price) }}</span>
    </v-card-text>

    <v-btn
      dark
      block
      elevation="0"
      color="green lighten-1"
      class="add-to-cart-button"
      @click="$emit('click-cart', food)"
    >
      <v-icon>mdi mdi-cart</v-icon>
      <span class="ml-1">Add to cart</span>
    </v-btn>
  </v-card>
</template>

<script>
import { rupiah } from '@/helpers/money'

export default {
  props: {
    food: {
      type: Object,
      required: true,
    },
  },

  methods: {
    formatMoney(price) {
      return rupiah(price)
    },
  },
}
</script>

<style lang="scss" scoped>
.food-name {
  color: #757575;
  font-size: 17px;
  font-weight: 500;
}

.food-price {
  display: block;
  margin-top: 10px;
  color: #757575;
  font-weight: 500;
}

.add-to-cart-button {
  border-radius: 0px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>