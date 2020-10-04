<template>
  <div class="food-feed-container">
    <!-- Header -->
    <div class="food-feed-header">
      <!-- Title -->
      <p class="food-feed-title">
        {{ title }}
      </p>

      <!-- See More Button -->
      <see-more-button :to="to" />
    </div>

    <!-- Content -->
    <v-row
      v-if="!loading"
      class="mt-1"
    >
      <v-col
        v-for="food in foods"
        :key="food.id"
        cols="6"
        sm="4"
        md="3"
        xl="2"
      >
        <!-- The Food -->
        <food
          :food="food"
          @click-cart="$emit('click-cart', $event)"
        />
      </v-col>
    </v-row>

    <!-- Loading -->
    <div
      v-else
      class="text-center grey--text text--darken-1"
    >
      <v-progress-circular indeterminate />
      <p class="pa-0 mt-2">
        Loading {{ title.toLowerCase() }} foods..
      </p>
    </div>
  </div>
</template>

<script>
import Food from '@/components/food/Food'
import SeeMoreButton from '@/components/food/SeeMoreButton.vue'

export default {
  components: {
    Food,
    SeeMoreButton,
  },

  props: {
    foods: {
      type: Array,
      default: null,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    to: {
      type: [String, Object],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.food-feed-container {
  .food-feed-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .food-feed-title {
      padding: 0;
      margin: 0;
      font-size: 24px;
      font-size: bold;
    }
  }
}
</style>