<template>
  <div>
    <!-- The Main Card -->
    <card>
      <v-card-title class="d-flex justify-space-between">
        <div>
          <v-icon>mdi mdi-account-details</v-icon>
          <span class="ml-1">Roles</span>
        </div>

        <create-btn
          v-if="$auth.can('role.create')"
          text="Role"
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
                    @click="openSyncPermissionsDialog(item)"
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
      :role="focusItem"
      @close="formDialog = false"
      @updated="refreshItems"
    />

    <!-- Delete Dialog -->
    <delete-dialog
      v-if="deleteDialog && focusItem"
      :role="focusItem"
      @close="deleteDialog = false, focusItem = null"
      @deleted="itemDeleted"
    />

    <!-- Sync Permissions -->
    <sync-permissions-dialog
      v-if="syncPermissionsDialog && focusItem && selectedPermissions !== null"
      :items.sync="selectedPermissions"
      :options.sync="permissions"
      :loading="syncPermissionsLoading"
      @close="syncPermissionsDialog = false"
      @save="saveSyncPermissions"
      @search="getPermissions"
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
import FormDialog from '@/components/role/admin/FormDialog.vue'
import DeleteDialog from '@/components/role/admin/DeleteDialog.vue'
import SyncPermissionsDialog from '@/components/admins/SyncDialog.vue'
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
    SyncPermissionsDialog,
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
      syncPermissionsDialog: false,
      syncPermissionsLoading: false,
      permissions: [],
      selectedPermissions: null,
    }
  },

  watch: {
    formDialog(val) {
      if (!val) this.focusItem = false
    },
    syncPermissionsDialog(val) {
      if (val) return

      this.roles = []
      this.selectedPermissions = []
      this.focusItem = null
    },
  },

  mounted () {
    this.dataTableAction = roleApi.collection
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
    async openSyncPermissionsDialog(role) {
      this.syncPermissionsDialog = true
      this.focusItem = role

      this.getPermissions()
    },
    async getPermissions(search) {
      const payload = {
        limit: -1,
      }
      if (search) payload.search = search
      this.$overlay.show()

      try {
        const res = await permissionApi.collection(payload)
        const {ok, data} = res.data

        if (ok) {
          const rolePermissions = this.focusItem.permissions.map(permission => permission.name)

          this.permissions = data
          this.selectedPermissions = this.permissions.filter(permission => rolePermissions.includes(permission.name))
        }
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get permissions collection.',
        })
      } finally {
        this.$overlay.close()
      }
    },
    async saveSyncPermissions() {
      this.syncPermissionsLoading = true

      try {
        const res = await roleApi.syncPermissions(this.focusItem.id, {
          permissions_ids: this.selectedPermissions.map(permission => permission.id),
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
        this.syncPermissionsLoading = false
      }
    },
  },
}
</script>