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
        <span>{{ category !== null ? 'Edit Category' : 'Create Category' }}</span>
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
            prepend-inner-icon="mdi mdi-card-text"
            :error-messages="errors.name"
          />

          <!-- Buttons -->
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
              :color="!category ? 'createButton' : 'editButton'"
            >
              {{ !category ? 'Create' : 'Update' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import categoryApi from '@/api/categoryApi'
import DialogMixin from '@/mixins/DialogMixin'
import { clearValidationErrors, showValidationErrors } from '@/helpers/form'


export default {
  mixins: [DialogMixin],

  props: {
    category: {
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
      if (this.category !== null) {
        const categoryKeys = Object.keys(this.category)
        for (const key in this.form) {
          if (categoryKeys.includes(key)) this.form[key] = this.category[key]
        }
      }
    },
    formSubmit() {
      this.loading = true

      const payload = this.form
      if (this.category) payload._method = 'PATCH'

      return !this.category
        ? this.create(payload)
        : this.update(payload)
    },
    async create(payload) {
      clearValidationErrors(this.errors)
      
      try {
        const res = await categoryApi.create(payload)
        const {ok, data} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Category created.',
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
        const res = await categoryApi.update(this.category.id, payload)
        const {ok, data} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Category updated.',
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