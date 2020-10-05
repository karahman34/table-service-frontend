<template>
  <div>
    <!-- The Main Card -->
    <card>
      <v-card-title class="d-flex justify-space-between">
        <div>
          <v-icon>mdi mdi-cash</v-icon>
          <span class="ml-1">Transactions</span>
        </div>

        <div>
          <!-- Export -->
          <export
            v-if="$auth.can('transaction.export')"
            title="transactions"
            :action="exportAction"
          />

          <!-- Import -->
          <import
            v-if="$auth.can('transaction.import')"
            class="mx-2"
            :action="importAction"
            @imported="refreshItems()"
          />
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
            {{ formatMoney(item.total_price) }}
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
              <!-- Print Button -->
              <v-tooltip top>
                <template v-slot:activator="{on}">
                  <v-btn
                    icon
                    color="primary"
                    v-on="on"
                    @click="printTransaction(item)"
                  >
                    <v-icon>mdi mdi-printer</v-icon>
                  </v-btn>
                </template>

                Print
              </v-tooltip>

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
import { rupiah } from '@/helpers/money'
import Export from '@/components/admins/buttons/Export'
import Import from '@/components/admins/buttons/Importt'

export default {
  components: {
    Card,
    DeleteBtn,
    DeleteDialog,
    Export,
    Import,
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
      exportAction: transactionApi.export,
      importAction: transactionApi.import,
    }
  },

  mounted () {
    this.dataTableAction = transactionApi.collection
  },

  methods: {
    formatMoney(price) {
      return rupiah(price)
    },
    printTransaction(transaction) {
      const routerData = this.$router.resolve({
        name: 'administrator.transactions.print',
        params: {
          id: transaction.id,
        },
      })
      window.open(routerData.href, '_blank')
    },
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