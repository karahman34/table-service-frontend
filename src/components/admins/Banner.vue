<template>
  <v-card :color="color">
    <v-row
      justify="space-between"
      class="px-4"
    >
      <v-col cols="6">
        <!-- Text -->
        <span class="item-text">
          {{ text }}
        </span>

        <!-- count -->
        <span
          v-if="count >= 0"
          class="item-count"
        >{{ count }}</span>

        <!-- Loading -->
        <v-progress-circular
          v-if="count == null"
          indeterminate
          size="26"
          class="white--text mt-1"
        />
      </v-col>

      <v-col cols="6">
        <div class="float-right">
          <!-- Icon -->
          <v-icon class="item-icon">
            {{ icon }}
          </v-icon>
        </div>
      </v-col>
    </v-row>

    <!-- Footer -->
    <div class="text-center item-footer">
      <!-- Router -->
      <router-link
        class="item-href"
        :to="to"
      >
        <span>Travel</span>
        <v-icon class="white--text ml-2">
          mdi mdi-arrow-right-bold-circle-outline
        </v-icon>
      </router-link>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    to: {
      type: [String, Object],
      required:true,
    },
    color: {
      type: String,
      required: true,
    },
    getApi: {
      type: Function,
      required: true,
    },
    params: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      count: null,
      loading: false,
    }
  },

  mounted () {
    this.getItemCount()
  },

  methods: {
    async getItemCount() {
      try {
        const res = await this.getApi(this.params)
        const {ok, data} = res.data

        if (!ok) throw new Error

        this.count = data.length
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get items.',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .item-text {
    display: block;
    color: white;
    font-size:25px;
  }

  .item-count {
    display: inline-block;
    color: white;
    font-size: 20px;
    margin-top: 5px;
  }

  .item-icon {
    color: white;
    font-size: 50px;
  }

  .item-footer {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .item-href {
    color: white;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
  }
</style>