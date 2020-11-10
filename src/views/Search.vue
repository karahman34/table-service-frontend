<template>
  <div>
    <!-- Results meta -->
    <h1>
      <span>{{ serverItemsLength }} results</span>
      <span v-if="search !== null && search.length">for "{{ search }}"</span>
    </h1>

    <!-- Filter Container -->
    <div class="filter-container mt-3 mb-4 d-flex justify-space-between">
      <!-- Filter -->
      <v-select
        v-model="form.filter"
        :items="filterOptions"
        filled
        hide-details
        label="Filter"
        class="d-inline-block"
        prepend-inner-icon="mdi mdi-filter"
      />

      <!-- Category -->
      <v-select
        filled
        hide-details
        :label="selectedCategories.length ? selectedCategoriesNames : 'Select Categories'"
        class="d-inline-block ml-4"
        prepend-inner-icon="mdi mdi-tag-multiple"
        @click.prevent="selectCategories = true"
      />
    </div>

    <!-- No Content -->
    <div
      v-if="!loading && !foods.length"
      class="text-center grey--text"
    >
      <h1>Can't find the items, how about try with another keywords ?</h1>
    </div>

    <!-- Content -->
    <v-row v-if="!loading">
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
          @click-cart="focusItem = $event, cartDialog = true"
        />
      </v-col>
    </v-row>

    <!-- Skeleton -->
    <v-row v-else>
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

    <!-- Pagination -->
    <v-pagination
      v-if="!loading && foods.length && paginationTotal > 1"
      v-model="page"
      color="grey darken-3"
      class="mt-5 mb-10 float-right"
      :length="paginationTotal"
    />

    <!-- Cart Dialog -->
    <cart-dialog
      v-if="focusItem && cartDialog"
      :food="focusItem"
      @close="focusItem = null, cartDialog = false"
    />

    <!-- Select Categories -->
    <select-categories
      v-if="selectCategories"
      :options="categories"
      :loading="categoryLoading"
      :selected-categories="selectedCategories"
      @close="selectCategories = false"
      @save="selectedCategories = $event"
    />
  </div>
</template>

<script>
import foodApi from '@/api/foodApi'
import Food from '@/components/food/Food'
import Skeleton from '@/components/food/Skeleton'
import CartDialog from '@/components/food/CartDialog'
import SelectCategories from '@/components/SelectCategories'
import categoryApi from '@/api/categoryApi'

export default {
  components: {
    Food,
    Skeleton,
    CartDialog,
    SelectCategories,
  },

  data() {
    return {
      foods: [],
      loading: true,
      filterOptions: ['new', 'name', 'price', 'popular', 'random'],
      selectedCategories: [],
      form: {
        filter: 'name',
        category: null,
      },
      categories: [],
      categoryLoading: false,
      // Pagination
      page: 1,
      limit: 12,
      serverItemsLength: null,
      // Commponents
      focusItem: null,
      cartDialog: false,
      selectCategories: false,
    }
  },

  computed: {
    filter() {
      return this.$route.query?.filter || null
    },
    search() {
      return this.$route.query?.search || null
    },
    query() {
      return {
        page: this.page,
        limit: this.limit,
        search: this.search,
        filter: this.form.filter,
        categories: !this.selectedCategories.length ? null : this.selectedCategories.map(_c => _c.id).join(','),
      }
    },
    selectedCategoriesNames() {
      return this.selectedCategories.map(category => category.name).join(',')
    },
    paginationTotal() {
      return Math.ceil(this.serverItemsLength / this.limit)
    },
  },

  watch: {
    query() {
      this.goSearch()
    },
    filter: {
      immediate: true,
      handler: function(val) {
        this.form.filter = val
      },
    },
  },

  mounted () {
    this.getCategories()
  },

  methods: {
    async getCategories() {
      this.categoryLoading = true

      try {
        const res = await categoryApi.collection({
          limit: -1,
        })
        const {ok,data} = res.data

        if (!ok) throw new Error

        this.categories = data
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get categories.',
        })
      } finally {
        this.categoryLoading = false
      }
    },
    async goSearch() {
      // Set loading
      this.loading = true
      
      try {
        const res = await foodApi.collection(this.query)
        const { ok, data, meta } = res.data

        if (!ok) throw new Error

        this.foods = data
        this.serverItemsLength = meta.total
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Something went wrong. Failed to get food items.',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-container {
  width: 100%;
}

@media screen and (min-width: 960px) {
  .filter-container {
    width: 50%;
  }
}
</style>