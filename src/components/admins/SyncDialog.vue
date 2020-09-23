<template>
  <v-dialog
    v-model="dialog"
    scrollable  
    persistent 
    max-width="600px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>Sync Roles</span>

        <v-icon @click="closeDialog">
          mdi mdi-close
        </v-icon>
      </v-card-title>

      <v-card-text>
        <!-- The Search -->
        <search
          :loading="loading"
          class="mb-5"
          @search="search = $emit('search', $event)"
        />

        <!-- Selected -->
        <div class="selected mb-2">
          <p
            class="mb-1 font-weight-bold"
            style="font-size:15px;"
          >
            Selected
          </p>
          <p
            v-if="!items.length"
            class="mb-0 grey--text"
          >
            No selected items.
          </p>
          <template v-else>
            <div
              class="d-flex flex-wrap"
              style="gap:6px;"
            >
              <v-chip
                v-for="item in items"
                :key="item.id"
                close
                label
                dark
                color="grey darken-3"
                @click:close="deleteSelectedItem(item)"
              >
                {{ item.name }}
              </v-chip>
            </div>
          </template>
        </div>

        <!-- Options -->
        <div class="options mb-4">
          <p
            class="mb-1 font-weight-bold"
            style="font-size:15px;"
          >
            Options
          </p>
          <p
            v-if="!filteredOptions.length"
            class="mb-0 grey--text"
          >
            No result.
          </p>
          <template v-else>
            <div
              class="d-flex flex-wrap"
              style="gap:6px;"
            >
              <v-chip
                v-for="option in filteredOptions"
                :key="option.id"
                label
                dark
                color="grey darken-3"
                @click="addSelectedItem(option)"
              >
                {{ option.name }}
              </v-chip>
            </div>
          </template>
        </div>

        <!-- Save -->
        <v-btn
          block
          outlined
          color="grey darken-3"
          :loading="loading"
          @click="$emit('save')"
        >
          <v-icon>mdi mdi-content-save</v-icon>
          <span class="ml-1">Save</span>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import DialogMixin from '@/mixins/DialogMixin'
import Search from '@/components/admins/Search.vue'

export default {
  components: {
    Search,
  },

  mixins: [DialogMixin],

  props: {
    items: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: 'Sync Items',
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  
  data() {
    return {
      search: null,
    }
  },

  computed: {
    filteredOptions() {
      const selectedItemsName = this.items.map(item => item.name)
      return this.options.filter(option => !selectedItemsName.includes(option.name)) 
    },
  },

  watch: {
    search() {
      this.getOptions()
    },
  },

  methods: {
    addSelectedItem(item) {
      this.$emit('update:items', [...this.items, item])
    },
    deleteSelectedItem(item) {
      const itemsClone = this.items
      itemsClone.splice(
        this.items.indexOf(item),
        1,
      )

      this.$emit('update:items', itemsClone)
    },
  },
}
</script>