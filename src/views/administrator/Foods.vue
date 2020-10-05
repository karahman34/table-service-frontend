<template>
  <div>
    <!-- The Main Card -->
    <card>
      <v-card-title class="d-flex justify-space-between">
        <div>
          <v-icon>mdi mdi-food-fork-drink</v-icon>
          <span class="ml-1">Foods</span>
        </div>

        <div>
          <!-- Export -->
          <export
            v-if="$auth.can('food.export')"
            title="foods"
            :action="exportAction"
          />

          <!-- Import -->
          <import
            v-if="$auth.can('food.import')"
            class="mx-2"
            :action="importAction"
            @imported="refreshItems()"
          />

          <!-- Create -->
          <create-btn
            v-if="$auth.can('user.create')"
            text="food"
            @click.native="formDialog = true"
          />
        </div>
      </v-card-title>

      <v-card-text>
        <search
          :loading="tableLoading"
          @search="searchQuery = $event"
        />

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
          <!-- Image -->
          <template v-slot:[`item.image`]="{item}">
            <v-img
              :src="item.image"
              max-width="150"
            />
          </template>

          <!-- Price -->
          <template v-slot:[`item.price`]="{item}">
            {{ `Rp.${item.price}` }}
          </template>

          <!-- Discount -->
          <template v-slot:[`item.discount`]="{item}">
            {{ item.discount }}%
          </template>

          <!-- Actions -->
          <template v-slot:[`item.actions`]="{item}">
            <span
              v-if="!$auth.can('food.update') && !$auth.can('food.delete')"
              class="grey--text"
            >No actions available.</span>

            <!-- Edit Button -->
            <edit-btn
              v-if="$auth.can('food.update')"
              @click="editItem(item)"
            />

            <!-- Delete Button -->
            <delete-btn
              v-if="$auth.can('food.delete')"
              @click="deleteItem(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </card>

    <!-- Create Dialog -->
    <form-dialog
      v-if="formDialog && !focusItem"
      @close="formDialog = false"
      @created="itemCreated"
    />

    <!-- Edit Dialog -->
    <form-dialog
      v-if="formDialog && focusItem"
      :food="focusItem"
      @close="formDialog = false"
      @updated="refreshItems"
    />

    <delete-dialog
      v-if="deleteDialog && focusItem"
      :food="focusItem"
      @close="deleteDialog = false, focusItem = null"
      @deleted="itemDeleted"
    />
  </div>
</template>

<script>
import foodApi from '@/api/foodApi'
import DataTableMixin from '@/mixins/DataTableMixin'
import Card from '@/components/admins/Card.vue'
import CreateBtn from '@/components/admins/buttons/Create.vue'
import EditBtn from '@/components/admins/buttons/Edit.vue'
import DeleteBtn from '@/components/admins/buttons/Delete.vue'
import FormDialog from '@/components/food/admin/FormDialog.vue'
import DeleteDialog from '@/components/food/admin/DeleteDialog.vue'
import Search from '@/components/admins/Search.vue'
import Export from '@/components/admins/buttons/Export'
import Import from '@/components/admins/buttons/Importt'

export default {
  components: {
    Card,
    CreateBtn,
    EditBtn,
    DeleteBtn,
    FormDialog,
    DeleteDialog,
    Search,
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
          text: 'Image',
          value: 'image',
          sortable: false,
          searchable: false,
        },
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Category',
          value: 'category',
        },
        {
          text: 'Description',
          value: 'description',
        },
        {
          text: 'Price',
          value: 'price',
        },
        {
          text: 'Discount',
          value: 'discount',
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          searchable: false,
        },
      ],
      focusItem: null,
      formDialog: false,
      deleteDialog: false,
      exportAction: foodApi.export,
      importAction: foodApi.import,
    }
  },

  watch: {
    formDialog(val) {
      if (!val) this.focusItem = false
    },
  },

  mounted () {
    this.dataTableAction = foodApi.collection
  },

  methods: {
    editItem(item) {
      this.focusItem = item
      this.formDialog = true
    },
    deleteItem(item) {
      this.focusItem = item
      this.deleteDialog = true
    },
    itemCreated() {
      this.formDialog = false
      this.showNewItem()
    },
    itemDeleted() {
      this.focusItem = null
      this.deleteDialog = false

      this.refreshItems()
    },
  },
}
</script>