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

    <!-- Skeleton -->
    <v-row
      v-else
      class="mt-1"
    >
      <v-col
        v-for="n in 12"
        :key="n"
        cols="6"
        sm="4"
        md="3"
        xl="2"
      >
        <!-- Content Skeleton -->
        <skeleton v-if="loading" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Food from '@/components/food/Food'
import Skeleton from '@/components/food/Skeleton.vue'
import SeeMoreButton from '@/components/food/SeeMoreButton.vue'

export default {
  components: {
    Food,
    Skeleton,
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