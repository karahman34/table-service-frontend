<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    dark
    color="grey darken-4"
  >
    <!-- Menus -->
    <v-list>
      <v-list-item
        v-for="menu in menus"
        :key="menu.name"
        link
        exact
        :to="{name: menu.name}"
      >
        <v-list-item-icon>
          <v-icon>{{ menu.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <span>{{ menu.text }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- Logout -->
    <template v-slot:append>
      <div class="px-3 py-4">
        <v-btn
          id="logout-btn"
          block
          @click="logout"
        >
          <v-icon>mdi mdi-exit-to-app</v-icon>
          <span class="ml-2">Logout</span>
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'Sidebar',

  props: {
    menus: {
      type: Array,
      required: true,
    },
    value: {
      type: Boolean,
      default: null,
    },
  },

  data() {
    return {
      drawer: null,
    }
  },

  watch: {
    drawer() {
      if (this.value !== this.drawer) {
        this.$emit('update:value', this.drawer)
      }
    },
    value() {
      if (this.drawer !== this.value) {
        this.drawer = this.value
      }
    },
  },

  methods: {
    async logout() {
      try {
        this.$overlay.show()

        await this.$auth.logout()

        this.$router.push({
          name: 'administrator.login',
        })
      } catch (err) {
        alert('Failed to loggout user.')
      } finally {
        this.$overlay.close()
      }
    },
  },
}
</script>

<style scoped>
#logout-btn:hover {
  background-color: #E53935;
}
</style>