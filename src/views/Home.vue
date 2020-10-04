<template>
  <div>
    <!-- New Foods -->
    <feed
      title="New"
      :foods="foods.new.items"
      :loading="foods.new.loading"
      :to="{name: 'search', query: { filter: 'new' }}"
      @click-cart="cartDialog = true, focusFood = $event"
    />

    <!-- Random Foods -->
    <feed
      class="my-12"
      title="Random"
      :foods="foods.random.items"
      :loading="foods.random.loading"
      :to="{name: 'search', query: { filter: 'random' }}"
      @click-cart="cartDialog = true, focusFood = $event"
    />

    <!-- Popular Foods -->
    <feed
      title="Popular"
      :foods="foods.popular.items"
      :loading="foods.popular.loading"
      :to="{name: 'search', query: { filter: 'popular' }}"
      @click-cart="cartDialog = true, focusFood = $event"
    />

    <!-- The Cart Dialog -->
    <cart-dialog
      v-if="cartDialog && focusFood"
      :food="focusFood"
      @close="focusFood = null, cartDialog = false"
    />
  </div>
</template>

<script>
import foodApi from '@/api/foodApi'
import Feed from '@/components/food/Feed'
import CartDialog from '@/components/food/CartDialog'

export default {
  name: 'Home',

  components: {
    Feed,
    CartDialog,
  },

  data() {
    return {
      foods: {
        new: {
          items: [],
          loading: true,
        },
        random: {
          items: [],
          loading: true,
        },
        popular: {
          items: [],
          loading: true,
        },
      },
      focusFood: null,
      cartDialog: false,
    }
  },

  mounted () {
    this.seedData()
  },

  methods: {
    async seedData() {
      await this.getFoods('new')
      await this.getFoods('random')
      await this.getFoods('popular')
    },
    async getFoods(ctx) {
      // Set loading
      this.$set(this.foods[ctx], 'loading', true)

      try {
        const res = await foodApi.collection({
          filter: ctx,
          limit: 12,
        })
        const { ok, data } = res.data

        if (!ok) throw new Error

        this.$set(this.foods[ctx], 'items', data)
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get foods.',
        })
      } finally {
        this.$set(this.foods[ctx], 'loading', false)
      }
    },
  },
}
</script>
