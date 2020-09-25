<template>
  <div>
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
          :get-api="banner.getApi"
          :icon="banner.icon"
          :to="banner.to"
          :params="banner.params"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Banner from '@/components/admins/Banner.vue'
import foodApi from '@/api/foodApi'
import userApi from '@/api/userApi'
import tableApi from '@/api/tableApi'
import orderApi from '@/api/orderApi'

export default {
  components: {
    Banner,
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
        },
      ],
    }
  },
}
</script>