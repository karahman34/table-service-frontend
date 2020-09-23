<template>
  <div>
    <!-- The Main Card -->
    <card>
      <v-card-title class="d-flex justify-space-between">
        <div>
          <v-icon>mdi mdi-cash</v-icon>
          <span class="ml-1">Transactions</span>
        </div>
      </v-card-title>

      <v-card-text>
        <!-- The Data Table -->
        <v-data-table
          multi-sort
          :headers="headers"
          :items="items"
          :loading="tableLoading"
          :server-items-length="serverItemsLength"
          :page.sync="page"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :items-per-page.sync="itemsPerPage"
        >
          <!-- Total Price -->
          <template v-slot:[`item.total_price`]="{item}">
            Rp. {{ item.total_price }}
          </template>

          <!-- Actions -->
          <template v-slot:[`item.actions`]="{item}">
            <!-- No actions -->
            <span
              v-if="!$auth.can('transaction.delete')"
              class="grey--text"
            >  
              No actions available.
            </span> 

            <template v-else>
              <!-- Delete Button -->
              <delete-btn
                v-if="$auth.can('transaction.delete')"
                @click="deleteItem(item)"
              />
            </template>
          </template>
        </v-data-table>
      </v-card-text>
    </card>

    <!-- Delete Dialog -->
    <delete-dialog
      v-if="deleteDialog && focusItem"
      :transaction="focusItem"
      @close="deleteDialog = false, focusItem = null"
      @deleted="itemDeleted"
    />
  </div>
</template>

<script>
import transactionApi from '@/api/transactionApi'
import DataTableMixin from '@/mixins/DataTableMixin'
import Card from '@/components/admins/Card.vue'
import DeleteBtn from '@/components/admins/buttons/Delete.vue'
import DeleteDialog from '@/components/transaction/admin/DeleteDialog.vue'

export default {
  components: {
    Card,
    DeleteBtn,
    DeleteDialog,
  },

  mixins: [DataTableMixin],

  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id',
          primary: true,
        },
        {
          text: 'Order ID',
          value: 'order.id',
          sortable: false,
          searchable: false,
        },
        {
          text: 'Cashier',
          value: 'cashier.username',
          sortable: false,
          searchable: false,
        },
        {
          text: 'Total Price',
          value: 'total_price',
        },
        {
          text: 'Created At',
          value: 'created_at',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          searchable: false,
        },
      ],
      focusItem: null,
      deleteDialog: false,
    }
  },

  mounted () {
    this.dataTableAction = transactionApi.collection
  },

  methods: {
    deleteItem(item) {
      this.focusItem = item
      this.deleteDialog = true
    },
    itemDeleted() {
      this.focusItem = null
      this.deleteDialog = false

      this.refreshItems()
    },
  },
}
</script>