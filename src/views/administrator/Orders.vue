<template>
  <div>
    <!-- The Main Card -->
    <card>
      <v-card-title class="d-flex justify-space-between">
        <div>
          <v-icon>mdi mdi-cart</v-icon>
          <span class="ml-1">Orders</span>
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
          <!-- Status -->
          <template v-slot:[`item.status`]="{item}">
            <v-icon
              v-if="item.status.toLowerCase() === 'y'"
              color="success"
            >
              mdi mdi-check
            </v-icon>

            <v-icon
              v-else
              color="error"
            >
              mdi mdi-close
            </v-icon>
          </template>

          <!-- Details Complete -->
          <template v-slot:[`item.details_complete`]="{item}">
            <v-icon
              v-if="item.details_complete.toLowerCase() === 'y'"
              color="success"
            >
              mdi mdi-check
            </v-icon>

            <v-icon
              v-else
              color="error"
            >
              mdi mdi-close
            </v-icon>
          </template>

          <!-- Actions -->
          <template v-slot:[`item.actions`]="{item}">
            <!-- No actions -->
            <span
              v-if="!$auth.can('order.delete')"
              class="grey--text"
            >  
              No actions available.
            </span> 

            <template v-else>
              <!-- Detail -->
              <v-tooltip top>
                <template v-slot:activator="{on}">
                  <v-btn
                    icon
                    color="info"
                    v-on="on"
                    @click="openOrderDetails(item)"
                  >
                    <v-icon>mdi mdi-eye</v-icon>
                  </v-btn>
                </template>

                <span>Details</span>
              </v-tooltip>

              <!-- Delete Button -->
              <delete-btn
                v-if="$auth.can('order.delete')"
                @click="deleteItem(item)"
              />
            </template>
          </template>
        </v-data-table>
      </v-card-text>
    </card>

    <!-- Details Dialog -->
    <details-dialog
      v-if="detailsDialog"
      :order="focusItem"
      @close="focusItem = null, detailsDialog = false"
      @deleted="detailDeleted($event)"
      @transaction-created="transactionCreated"
      @food-served="foodServed"
    />

    <!-- Delete Dialog -->
    <delete-dialog
      v-if="deleteDialog && focusItem"
      :order="focusItem"
      @close="deleteDialog = false, focusItem = null"
      @deleted="itemDeleted"
    />
  </div>
</template>

<script>
import orderApi from '@/api/orderApi'
import DataTableMixin from '@/mixins/DataTableMixin'
import Card from '@/components/admins/Card.vue'
import DeleteBtn from '@/components/admins/buttons/Delete.vue'
import DetailsDialog from '@/components/order/admin/DetailsDialog.vue'
import DeleteDialog from '@/components/order/admin/DeleteDialog.vue'

export default {
  components: {
    Card,
    DeleteBtn,
    DetailsDialog,
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
          text: 'Customer',
          value: 'customer.username',
          sortable: false,
          searchable: false,
        },
        {
          text: 'Table Number',
          value: 'table.number',
          sortable: false,
          searchable: false,
        },
        {
          text: 'Status',
          value: 'status',
        },
        {
          text: 'Details Complete',
          value: 'details_complete',
        },
        {
          text: 'Created At',
          value: 'created_at',
        },
        {
          text: 'Updated At',
          value: 'updated_at',
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
      detailsDialog: false,
    }
  },

  mounted () {
    this.dataTableAction = orderApi.collection
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
    openOrderDetails(item) {
      this.focusItem = item
      this.detailsDialog = true
    },
    detailDeleted(detail) {
      this.focusItem.details.splice(
        this.focusItem.details.indexOf(detail),
        1,
      )
    },
    transactionCreated() {
      this.focusItem.status = 'Y'

      this.refreshItems()
    },
    foodServed(newOrder) {
      this.focusItem = newOrder

      this.refreshItems()
    },
  },
}
</script>