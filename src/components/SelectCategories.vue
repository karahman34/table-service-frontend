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

      <v-card-text>
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
          <!-- Search -->
          <v-text-field
            v-model="search"
            dense
            filled
            rounded
            hide-details
            single-line
            class="mb-2"
            label="Search tags.."
            prepend-inner-icon="mdi mdi-magnify"
          />

          <!-- Tags -->
          <v-chip-group
            v-model="selected"
            column
            multiple
          >
            <v-chip
              v-for="category in options"
              :key="category.name"
              active-class="success white--text"
              :value="category"
            >
              {{ category.name }}
            </v-chip>
          </v-chip-group>

          <!-- Save -->
          <v-btn
            block
            class="mt-2"
            color="success"
            @click="save"
          >
            Select
          </v-btn>
        </template>
      </v-card-text>
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
      search: null,
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