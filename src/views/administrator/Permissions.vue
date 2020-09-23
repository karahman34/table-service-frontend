<template>
  <div>
    <!-- The Main Card -->
    <card>
      <v-card-title class="d-flex justify-space-between">
        <div>
          <v-icon>mdi mdi-sort-variant-lock</v-icon>
          <span class="ml-1">Permissions</span>
        </div>

        <create-btn
          v-if="$auth.can('role.create')"
          text="Permission"
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
            <!-- No Actions -->
            <span
              v-if="!$auth.can('role.update') && !$auth.can('role.delete')"
              class="grey--text"
            >No actions available.</span>

            <template v-else>
              <!-- Sync Permissions -->
              <v-tooltip
                v-if="$auth.can('role.update')"
                top
              >
                <template v-slot:activator="{on}">
                  <v-btn
                    icon
                    color="info"
                    v-on="on"
                    @click="openSyncRolesDialog(item)"
                  >
                    <v-icon>mdi mdi-sort-variant-lock</v-icon>
                  </v-btn>
                </template>

                <span>Sync Permissions</span>
              </v-tooltip>

              <!-- Edit Button -->
              <edit-btn
                v-if="$auth.can('role.update')"
                @click="editItem(item)"
              />

              <!-- Delete Button -->
              <delete-btn
                v-if="$auth.can('role.delete')"
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
      :permission="focusItem"
      @close="formDialog = false"
      @updated="refreshItems"
    />

    <!-- Delete Dialog -->
    <delete-dialog
      v-if="deleteDialog && focusItem"
      :permission="focusItem"
      @close="deleteDialog = false, focusItem = null"
      @deleted="itemDeleted"
    />

    <!-- Sync Roles -->
    <sync-roles-dialog
      v-if="syncRolesDialog && focusItem && selectedRoles !== null"
      :items.sync="selectedRoles"
      :options.sync="roles"
      :loading="syncRolesLoading"
      @close="syncRolesDialog = false"
      @save="saveSyncRoles"
      @search="getRoles"
    />
  </div>
</template>

<script>
import permissionApi from '@/api/permissionApi'
import DataTableMixin from '@/mixins/DataTableMixin'
import Card from '@/components/admins/Card.vue'
import CreateBtn from '@/components/admins/buttons/Create.vue'
import EditBtn from '@/components/admins/buttons/Edit.vue'
import DeleteBtn from '@/components/admins/buttons/Delete.vue'
import FormDialog from '@/components/permission/admin/FormDialog.vue'
import DeleteDialog from '@/components/permission/admin/DeleteDialog.vue'
import SyncRolesDialog from '@/components/admins/SyncDialog.vue'
import Search from '@/components/admins/Search.vue'
import roleApi from '@/api/roleApi'

export default {
  components: {
    Card,
    CreateBtn,
    EditBtn,
    DeleteBtn,
    FormDialog,
    DeleteDialog,
    SyncRolesDialog,
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
      formDialog: false,
      deleteDialog: false,
      syncRolesDialog: false,
      syncRolesLoading: false,
      roles: [],
      selectedRoles: null,
    }
  },

  watch: {
    formDialog(val) {
      if (!val) this.focusItem = false
    },
    syncRolesDialog(val) {
      if (val) return

      this.roles = []
      this.selectedRoles = []
      this.focusItem = null
    },
  },

  mounted () {
    this.dataTableAction = permissionApi.collection
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
    async openSyncRolesDialog(permission) {
      this.syncRolesDialog = true
      this.focusItem = permission

      this.getRoles()
    },
    async getRoles(search) {
      const payload = {
        limit: -1,
      }
      if (search) payload.search = search
      this.$overlay.show()

      try {
        const res = await roleApi.collection(payload)
        const {ok, data} = res.data

        if (ok) {
          const permissionRoles = this.focusItem.roles.map(role => role.name)

          this.roles = data
          this.selectedRoles = this.roles.filter(role => permissionRoles.includes(role.name))
        }
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get roles collection.',
        })
      } finally {
        this.$overlay.close()
      }
    },
    async saveSyncRoles() {
      this.syncRolesLoading = true

      try {
        const res = await permissionApi.syncRoles(this.focusItem.id, {
          roles_ids: this.selectedRoles.map(role => role.id),
        })
        const {ok} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Changes saved',
          })

          this.refreshItems()
        }
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to sync role permissions.',
        })
      } finally {
        this.syncRolesLoading = false
      }
    },
  },
}
</script>