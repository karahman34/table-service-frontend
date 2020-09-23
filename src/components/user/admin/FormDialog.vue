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
        <span>{{ user !== null ? 'Edit User' : 'Create User' }}</span>

        <v-icon @click="closeDialog">
          mdi mdi-close
        </v-icon>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="formSubmit">
          <!-- Username -->
          <v-text-field
            v-model="form.username"
            label="Username"
            prepend-inner-icon="mdi mdi-account"
            :error-messages="errors.username"
          />

          <!-- Password -->
          <v-text-field
            v-model="form.password"
            :label="!user ? 'Password' : 'Password  **not required**'"
            type="password"
            prepend-inner-icon="mdi mdi-lock"
            :error-messages="errors.password"
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
              :color="!user ? 'createButton' : 'editButton'"
            >
              {{ !user ? 'Create' : 'Update' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import userApi from '@/api/userApi'
import DialogMixin from '@/mixins/DialogMixin'
import { clearValidationErrors, showValidationErrors } from '@/helpers/form'


export default {
  mixins: [DialogMixin],

  props: {
    user: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      form: {
        username: null,
        password: null,
      },
      errors: {
        username: null,
        password: null,
      },
      loading: false,
    }
  },

  mounted () {
    this.setDefaultValue()
  },

  methods: {
    setDefaultValue() {
      if (this.user !== null) {
        const userKeys = Object.keys(this.user)
        for (const key in this.form) {
          if (userKeys.includes(key)) this.form[key] = this.user[key]
        }
      }
    },
    formSubmit() {
      this.loading = true

      const payload = this.form
      if (this.user) payload._method = 'PATCH'
      if (payload.password === null || payload.password == '') delete payload.password

      return !this.user
        ? this.create(payload)
        : this.update(payload)
    },
    async create(payload) {
      clearValidationErrors(this.errors)
      
      try {
        const res = await userApi.create(payload)
        const {ok, data} = res.data

        if (ok) {
          this.$alert.show({
            message: 'User created.',
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
        const res = await userApi.update(this.user.id, payload)
        const {ok, data} = res.data

        if (ok) {
          this.$alert.show({
            message: 'User updated.',
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