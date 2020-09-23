<template>
  <div>
    <!-- The Main Card -->
    <card>
      <v-card-title class="d-flex justify-space-between">
        <div>
          <v-icon>mdi mdi-tag-multiple</v-icon>
          <span class="ml-1">Categories</span>
        </div>

        <create-btn
          v-if="$auth.can('category.create')"
          text="Category"
          @click.native="formDialog = true"
        />
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
          <!-- Actions -->
          <template v-slot:[`item.actions`]="{item}">
            <!-- No actions -->
            <span
              v-if="!$auth.can('category.update') && !$auth.can('category.delete')"
              class="grey--text"
            >  
              No actions available.
            </span> 

            <template v-else>
              <!-- Edit Button -->
              <edit-btn
                v-if="$auth.can('category.update')"
                @click="editItem(item)"
              />

              <!-- Delete Button -->
              <delete-btn
                v-if="$auth.can('category.delete')"
                @click="deleteItem(item)"
              />
            </template>
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
      :category="focusItem"
      @close="formDialog = false"
      @updated="refreshItems"
    />

    <delete-dialog
      v-if="deleteDialog && focusItem"
      :category="focusItem"
      @close="deleteDialog = false, focusItem = null"
      @deleted="itemDeleted"
    />
  </div>
</template>

<script>
import categoryApi from '@/api/categoryApi'
import DataTableMixin from '@/mixins/DataTableMixin'
import Card from '@/components/admins/Card.vue'
import CreateBtn from '@/components/admins/buttons/Create.vue'
import EditBtn from '@/components/admins/buttons/Edit.vue'
import DeleteBtn from '@/components/admins/buttons/Delete.vue'
import FormDialog from '@/components/category/admin/FormDialog.vue'
import DeleteDialog from '@/components/category/admin/DeleteDialog.vue'
import Search from '@/components/admins/Search.vue'

export default {
  components: {
    Card,
    CreateBtn,
    EditBtn,
    DeleteBtn,
    FormDialog,
    DeleteDialog,
    Search,
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
          text: 'Name',
          value: 'name',
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
    }
  },

  watch: {
    formDialog(val) {
      if (!val) this.focusItem = false
    },
  },

  mounted () {
    this.dataTableAction = categoryApi.collection
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