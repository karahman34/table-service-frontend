<template>
  <div>
    <!-- The Card -->
    <card>
      <v-card-title class="d-flex justify-space-between">
        <span>Tables</span>

        <create-button
          text="table"
          @click.native="formDialog = true"
        />      
      </v-card-title>

      <v-card-text>
        <!-- Info -->
        <div class="table-info-container mb-6">
          <div class="table-info">
            <span class="table-info-box green" />
            <span class="table-info-text green--text font-weight-medium">Available</span>
          </div>

          <div class="table-info ml-4">
            <span class="table-info-box red" />
            <span class="table-info-text red--text font-weight-medium">Busy</span>
          </div>
        </div>

        <!-- The Loading -->
        <div
          v-if="loading"
          class="text-center grey--text"
        >
          <v-progress-circular indeterminate />
          <p class="mb-0 mt-3 font-weight-medium">
            Loading...
          </p>
        </div>

        <!-- The Tables -->
        <div
          v-else
          class="d-flex flex-wrap"
          style="gap: 10px;"
        >
          <div
            v-for="table in tables"
            :key="table.id"
            class="table px-3 py-2 white--text font-weight-medium"
            :class="{'green': table.available === 'Y', 'red': table.available === 'N'}"
            @click="detailsDialog = true, focusItem = table"
          >
            {{ table.number }}
          </div>
        </div>
      </v-card-text>
    </card>

    <!-- The Create Dialog -->
    <form-dialog
      v-if="formDialog"
      @close="formDialog = false"
      @created="tableCreated($event)"
    />

    <!-- The Details Dialog -->
    <details-dialog
      v-if="detailsDialog && focusItem"
      :table="focusItem"
      @close="detailsDialog = false, focusItem = null"
      @updated="tableUpdated"
      @deleted="focusItem = null, getTables()"
      @checked-out="focusItem = null, getTables()"
    />
  </div>
</template>

<script>
import tableApi from '@/api/tableApi'
import Card from '@/components/admins/Card.vue'
import CreateButton from '@/components/admins/buttons/Create.vue'
import FormDialog from './FormDialog.vue'
import DetailsDialog from './DetailsDialog.vue'

export default {
  components: {
    Card,
    CreateButton,
    DetailsDialog,
    FormDialog,
  },

  data() {
    return {
      tables: [],
      loading: false,
      focusItem: null,
      formDialog: false,
      detailsDialog: false,
    }
  },

  mounted () {
    this.getTables()
  },

  methods: {
    async getTables() {
      this.loading = true

      try {
        const res = await tableApi.collection({
          limit: -1,
        })
        const {ok, data} = res.data

        if (!ok) throw new Error

        this.tables = data
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get tables collection.',
        })
      } finally {
        this.loading = false
      }
    },
    tableCreated() {
      this.tables = null
      this.getTables()
    },
    tableUpdated(newTable) {
      this.focusItem = newTable

      this.tables = null
      this.getTables()
    },
  },
}
</script>

<style lang="scss" scoped>
.table {
  cursor: pointer;
  border-radius: 4px;
}

.table-info-container {
  .table-info {
    display: inline-block;
  }

  .table-info-box {
    padding: 4px 12px;
    border-radius: 4px;
  }

  .table-info-text {
    margin-left: 6px;
  }
}
</style>