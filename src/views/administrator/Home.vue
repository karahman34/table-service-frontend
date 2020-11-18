<template>
  <div>
    <h2>Dashboard</h2>

    <!-- Banners -->
    <v-row>
      <v-col
        v-for="(banner, i) in banners"
        :key="i"
        cols="6"
        md="4"
        lg="3"
      >
        <banner
          :text="banner.text"
          :color="banner.color"
          :icon="banner.icon"
          :to="banner.to"
          :items="banner.items"
        />
      </v-col>
    </v-row>

    <!-- Second Row -->
    <v-row class="mt-6">
      <!-- Tables -->
      <v-col
        cols="12"
        md="6"
      >
        <tables />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import foodApi from '@/api/foodApi'
import userApi from '@/api/userApi'
import tableApi from '@/api/tableApi'
import orderApi from '@/api/orderApi'
import Banner from '@/components/admins/Banner.vue'
import Tables from '@/components/tables/admin/List.vue'

export default {
  components: {
    Banner,
    Tables,
  },

  data() {
    return {
      banners: [
        {
          text: 'New Orders',
          icon: 'mdi mdi-cart',
          to: {name: 'administrator.orders'},
          getApi: orderApi.new,
          color: 'orange lighten-1',
          params: null,
          items: null,
        },
        {
          text: 'Foods',
          icon: 'mdi mdi-food-fork-drink',
          to: {name: 'administrator.foods'},
          getApi: foodApi.collection,
          color: 'red lighten-1',
          params: {
            limit: -1,
          },
          items: null,
        },
        {
          text: 'Users',
          icon: 'mdi mdi-account-group',
          to: {name: 'administrator.users'},
          getApi: userApi.collection,
          color: 'blue lighten-1',
          params: {
            limit: -1,
          },
          items: null,
        },
        {
          text: 'Customers',
          icon: 'mdi mdi-account-supervisor-circle',
          to: {name: 'administrator.home'},
          getApi: tableApi.collection,
          color: 'green lighten-1',
          params: {
            limit: -1,
            available: 'N',
          },
          items: null,
        },
      ],
    }
  },

  mounted () {
    this.setBannersItems()
    this.listenNewOrders()
  },

  methods: {
    setBannersItems() {
      this.banners.map(banner => this.getBannerItems(banner))
    },
    async getBannerItems(banner) {
      try {
        const res = await banner.getApi(banner.params)
        const {ok, data} = res.data

        if (!ok) throw new Error

        banner.items = data.length
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: `Failed to get ${banner.text.toLowerCase()} banner items.`,
        })
      }
    },
    listenNewOrders() {
      window.Echo.private('orders')
        .listen('.new', () => {
          const banner = this.banners.find(_banner => _banner.text.toLowerCase() === 'new orders')
          banner.items = null

          this.getBannerItems(banner)
        })
    },
  },
}
</script>