<template>
  <v-app-bar
    id="nav-top"
    app
  >
    <!-- Logo -->
    <router-link
      to="/"
      class="text-decoration-none black--text"
    >
      <v-toolbar-title>Logo</v-toolbar-title>
    </router-link>

    <v-spacer />

    <!-- Search -->
    <div
      id="nav-search-container"
      class="d-inline-block"
    >
      <v-form @submit.prevent="goSearch">
        <input
          id="nav-search"
          v-model="search"
          type="text"
          placeholder="Search..."
        >

        <v-icon
          id="nav-search-icon"
          @click="goSearch"
        >
          mdi mdi-magnify
        </v-icon>
      </v-form>
    </div>

    <div class="divider" />

    <!-- Cart -->
    <v-btn
      icon
      to="/carts"
    >
      <v-badge
        color="primary"
        :value="carts.length"
        :content="carts.length"
      >
        <v-icon>mdi mdi-cart</v-icon>
      </v-badge>
    </v-btn>
      
    <!-- Account -->
    <v-menu
      offset-y
      open-on-hover
    >
      <template v-slot:activator="{on}">
        <v-btn
          text
          v-on="on"
        >
          <v-icon>mdi mdi-account</v-icon>
          <span
            id="username"
            class="mx-1"
          >{{ username }}</span>
          <v-icon>mdi mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <!-- Set Table -->
        <v-list-item @click="setTableDialog = true">
          <v-list-item-title class="black--text">
            <v-icon>mdi mdi-format-list-numbered</v-icon>
            <span class="ml-2">Set Table</span>
          </v-list-item-title>
        </v-list-item>

        <!-- Logout -->
        <v-list-item @click="goLogout()">
          <v-list-item-title class="black--text">
            <v-icon>mdi mdi-logout</v-icon>
            <span class="ml-2">Logout</span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Set Table -->
    <set-table
      v-if="setTableDialog"
      @close="setTableDialog = false"
      @save="listenTableEvents"
    />
  </v-app-bar>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import SetTable from '@/components/table/SetDialog.vue'

export default {
  components: {
    SetTable,
  },

  data() {
    return {
      setTableDialog: false,
      search: null,
    }
  },

  computed: {
    ...mapState('cart', {
      carts: state => state.items,
    }),
    ...mapState('table', {
      tableNumber: state => state.number,
    }),
    username() {
      return this.$auth.user?.username || null 
    },
    tableChannelName() {
      return `table.${this.tableNumber}`
    },
  },

  watch: {
    '$route.query.search': function(val) {
      this.search = val
    },
  },

  mounted () {
    // Set table first
    if (!this.tableNumber) {
      this.setTableDialog = true
    } else {
      // listen to table events
      this.listenTableEvents()
    }
  },

  methods: {
    ...mapMutations('table', {
      setTableNumber: 'SET_NUMBER',
    }),
    ...mapMutations('cart', {
      clearCart: 'CLEAR',
    }),
    goSearch() {
      const currentPathQuery = this.$route.query
      if (this.$route.name === 'search' && currentPathQuery?.search === this.search) return

      this.$router.push({
        name: 'search',
        query: {
          search: this.search,
        },
      })
    },
    async goLogout() {
      this.$overlay.show()
      
      const payload = {}
      if (this.tableNumber) payload.number = this.tableNumber
      
      try {
        // Call vuex action.
        await this.$auth.logout(payload)

        this.clearCart()
        this.setTableNumber(null)

        this.$router.push({
          name: 'login',
        })
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Something went wrong.',
        })
      } finally {
        this.$overlay.close()
      }
    },
    orderFinish() {
      this.setTableNumber(null)
      this.$router.replace('/')
      this.leaveChannel()

      this.$nextTick(() => {
        this.setTableDialog = true
      })
    },
    leaveChannel() {
      window.Echo.leave(this.tableChannelName)
    },
    listenTableEvents() {
      window.Echo.private(this.tableChannelName)
        .listen('.complete', () => {
          this.orderFinish()
        })
    },
  },
}
</script>

<style lang="scss" scoped>
#nav-top {
  padding: 0 0px;
}

@media screen and (max-width: 600px) {
  #username {
    display: none;
  }
}

@media screen and (min-width: 1264px) {
  #nav-top {
    padding: 0 calc(15% - 16px);
  }
}

#nav-search-container {
  position: relative;
  margin-right: 12px;

  #nav-search {
    padding: 8px 0;
    padding-left: 45px;
    background-color: #E0E0E0;
    border-radius: 7px;
    width: 320px;
  }

  @media screen and (max-width: 800px) {
    #nav-search {
      width: 230px;
    }
  }

  @media screen and (max-width: 600px) {
    #nav-search {
      width: 210px;
    }
  }

  #nav-search:focus {
    outline: none;
  }

  #nav-search:focus + #nav-search-icon {
    color:#1E88E5;
  }

  #nav-search-icon {
    cursor: pointer;
    position: absolute;
    left: 15px;
    top: 8px;
  }
}

.divider {
  width: 1px;
  height: 20px;
  margin: 0 10px;
  background-color: #BDBDBD;
}
</style>