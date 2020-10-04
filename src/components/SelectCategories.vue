<template>
  <v-dialog
    v-model="dialog"
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        Select Categories
  
        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pb-0">
        <!-- Loading -->
        <div
          v-if="loading"
          class="text-center grey--text"
        >
          <v-progress-circular indeterminate />
          <p class="mt-3">
            Loading..
          </p>
        </div>

        <template v-else>
          <!-- Header -->
          <v-row
            style="border-bottom: 1px solid rgba(0,0,0,0.2);padding-bottom: 7px !important;"
          >
            <v-col
              cols="6"
              class="text-center black--text pb-0"
            >
              <span style="font-size:18px;">Name</span>
            </v-col>
            <v-col
              cols="6"
              class="text-center black--text pb-0"
            >
              <span style="font-size:18px;">Check</span>
            </v-col>
          </v-row>

          <!-- Content -->
          <div class="content">
            <v-row
              v-for="option in options"
              :key="option.id"
            >
              <!-- Name -->
              <v-col cols="6">
                <div class="option text-center grey--text text--darken-4 mt-1">
                  {{ option.name }}
                </div>
              </v-col>

              <!-- Check -->
              <v-col cols="6">
                <div class="check d-flex justify-center">
                  <v-checkbox
                    v-model="selected"
                    multiple
                    hide-details
                    class="ma-0"
                    :value="option.id"
                  />
                </div>
              </v-col>
            </v-row>
          </div>
        </template>
      </v-card-text>

      <v-card-actions v-if="!loading">
        <!-- Save -->
        <v-btn
          block
          class="mt-2"
          color="success"
          @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogMixin from '@/mixins/DialogMixin'

export default {
  mixins: [DialogMixin],

  props: {
    options: {
      type: Array,
      required: true,
    },
    selectedCategories: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      selected: [],
    }
  },

  watch: {
    selectedCategories: {
      immediate: true,
      handler: function(val) {
        this.selected = val
      },
    },
  },

  methods: {
    save() {
      this.$emit('save', this.selected)

      this.closeDialog()
    },
  },
}
</script>