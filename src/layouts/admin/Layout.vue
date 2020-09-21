<template>
  <v-app>
    <!-- Side Bar -->
    <left-nav
      :menus="menus"
      :value.sync="sideBar"
    />

    <!-- Top Navigation -->
    <top-nav @toggle-sidebar="sideBar = !sideBar" />

    <!-- Main Content -->
    <v-main>
      <!-- Overlay -->
      <overlay />

      <v-container class="px-5">
        <!-- Bread Crumbs -->
        <v-breadcrumbs
          :items="segments"
          class="px-0"
        >
          <template v-slot:item="{item}">
            <v-breadcrumbs-item
              :href="item.href"
              :disabled="item.disabled"
            >
              <router-link
                v-if="!item.disabled"
                class="text-decoration-none"
                :to="item.href"
              >
                {{ item.text }}
              </router-link>

              <span v-else>{{ item.text }}</span>
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>

        <!-- Router View -->
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import TopNav from './TopNav.vue'
import LeftNav from './LeftNav.vue'
import Overlay from '@/components/Overlay.vue'

export default {
  components: {
    TopNav,
    LeftNav,
    Overlay,
  },

  data: () => ({
    menus: [
      {
        text: 'Dashboard',
        name: 'administrator.home',
        icon: 'mdi mdi-home',
      },
      {
        text: 'Foods',
        name: 'administrator.foods',
        icon: 'mdi mdi-food-fork-drink',
      },
    ],
    sideBar: null,
  }),

  computed: {
    segments() {
      const segments = this.$route.fullPath.split('/')
      segments.splice(0, 1)

      return segments.map(segment => ({
        text: segment,
        disabled: segment === segments[segments.length - 1] ? true : false,
        href: `/${segment}`,
      }))
    },
  },
}
</script>

<style lang="scss">
  @import '../../assets/scss/admin/app.scss';
</style>