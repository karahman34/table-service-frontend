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
        <span>{{ permission !== null ? 'Edit Permission' : 'Create Permission' }}</span>

        <v-icon @click="closeDialog">
          mdi mdi-close
        </v-icon>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="formSubmit">
          <!-- Name -->
          <v-text-field
            v-model="form.name"
            label="Name"
            prepend-inner-icon="mdi mdi-account"
            :error-messages="errors.name"
          />

          <div class="float-right">
            <v-btn
              text
              color="grey"
              @click.native="closeDialog"
            >
              Close
            </v-btn>

            <v-btn
              text
              dark
              type="submit"
              :loading="loading"
              :color="!permission ? 'createButton' : 'editButton'"
            >
              {{ !permission ? 'Create' : 'Update' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import permissionApi from '@/api/permissionApi'
import DialogMixin from '@/mixins/DialogMixin'
import { clearValidationErrors, showValidationErrors } from '@/helpers/form'


export default {
  mixins: [DialogMixin],

  props: {
    permission: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      form: {
        name: null,
      },
      errors: {
        name: null,
      },
      loading: false,
    }
  },

  mounted () {
    this.setDefaultValue()
  },

  methods: {
    setDefaultValue() {
      if (this.permission !== null) {
        const permissionKeys = Object.keys(this.permission)
        for (const key in this.form) {
          if (permissionKeys.includes(key)) this.form[key] = this.permission[key]
        }
      }
    },
    formSubmit() {
      this.loading = true

      const payload = this.form
      if (this.permission) payload._method = 'PATCH'
      if (payload.password === null || payload.password == '') delete payload.password

      return !this.permission
        ? this.create(payload)
        : this.update(payload)
    },
    async create(payload) {
      clearValidationErrors(this.errors)
      
      try {
        const res = await permissionApi.create(payload)
        const {ok, data} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Permission created.',
          })

          this.$emit('created', data)
        }
      } catch (err) {
        const status = err?.response?.status

        switch (status) {
        case 422:
          showValidationErrors(this.errors, err.response?.data)
          break
        
        default:
          this.$alert.show({
            type: 'error',
            message: 'Something went wrong.',
          })
          break
        }
      } finally {
        this.loading = false
      }
    },
    async update(payload) {
      clearValidationErrors(this.errors)
      
      try {
        const res = await permissionApi.update(this.permission.id, payload)
        const {ok, data} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Permission updated.',
          })

          this.$emit('updated', data)
        }
      } catch (err) {
        const status = err?.response?.status

        switch (status) {
        case 422:
          showValidationErrors(this.errors, err.response?.data)
          break
        
        default:
          this.$alert.show({
            type: 'error',
            message: 'Something went wrong.',
          })
          break
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>