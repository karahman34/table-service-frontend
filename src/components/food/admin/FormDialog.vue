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
        <span>{{ food !== null ? 'Edit Food' : 'Create Food' }}</span>
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

          <!-- Description -->
          <v-textarea
            v-model="form.description"
            auto-grow
            rows="1"
            label="Description"
            prepend-inner-icon="mdi mdi-clipboard-text"
            :error-messages="errors.description"
          />

          <!-- Price -->
          <v-text-field
            v-model="form.price"
            type="number"
            label="Price"
            :error-messages="errors.price"
          >
            <template v-slot:prepend>
              <div class="mt-1 grey--text text--darken-1 font-weight-medium">
                Rp
              </div>
            </template>
          </v-text-field>

          <!-- Discount -->
          <v-text-field
            v-model="form.discount"
            type="number"
            label="Discount"
            prepend-inner-icon="mdi mdi-sale"
            :error-messages="errors.discount"
          />

          <!-- Category -->
          <v-select
            v-model="form.category_id"
            label="Category"
            prepend-inner-icon="mdi mdi-tag"
            :items="categories"
            :loading="categoryLoading"
            :error-messages="errors.category_id"
          />

          <!-- Preview Image -->
          <div
            v-if="previewImage"
            class="mb-3 mt-1"
          >
            <v-img :src="previewImage" />
          </div>

          <!-- Image -->
          <v-file-input
            v-model="form.image"
            label="Image"
            :loading="loadingImage"
            :error-messages="errors.image"
            @change="setPreviewImage"
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
              :color="!food ? 'createButton' : 'editButton'"
            >
              {{ !food ? 'Create' : 'Update' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import foodApi from '@/api/foodApi'
import categoryApi from '@/api/categoryApi'
import DialogMixin from '@/mixins/DialogMixin'
import { clearValidationErrors, showValidationErrors } from '@/helpers/form'


export default {
  mixins: [DialogMixin],

  props: {
    food: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      form: {
        name: null,
        description: null,
        image: null,
        price: null,
        discount: 0,
        category_id: null,
      },
      errors: {
        name: null,
        description: null,
        image: null,
        price: null,
        discount: null,
        category_id: null,
      },
      previewImage: null,
      loading: false,
      loadingImage: false,
      categories: [],
      categoryLoading: false,
    }
  },

  mounted () {
    this.setDefaultValue()

    this.getCategories().then(() => {
      if (this.food) {
        // Set category
        this.form.category_id = this.categories.find(category => category.text === this.food.category).value
      }
    })
  },

  methods: {
    async updateImage() {
      this.previewImage = null
      this.loadingImage = true

      const formData = new FormData
      formData.append('_method', 'PATCH')
      formData.append('image', this.form.image)

      try {
        const res = await foodApi.updateImage(this.food.id, formData)
        const { ok, data } = res.data

        if (ok) {
          const food = data.food
          this.previewImage = food.image

          this.$alert.show({
            message: 'Image updated.',
          })

          this.$emit('updated', food)
        }
      } catch (err) {
        this.$alart.show({
          message: 'Failed to update image.',
        })
      } finally {
        this.loadingImage = false
      }
    },
    setPreviewImage(file) {
      if (!file) {
        this.previewImage = null
        return
      }

      if (!this.food) {
        this.previewImage = URL.createObjectURL(file)
      } else {
        this.updateImage()
      }
    },
    setDefaultValue() {
      if (this.food !== null) {
        const foodKeys = Object.keys(this.food)
        for (const key in this.form) {
          if (foodKeys.includes(key) && key !== 'image') this.form[key] = this.food[key]
        }

        this.previewImage = this.food.image
      }
    },
    async getCategories() {
      this.categoryLoading = true

      try {
        const res = await categoryApi.collection()
        const {ok, data} = res.data

        if (ok) {
          this.categories = data.map(category => ({
            text: category.name,
            value: category.id,
          }))
        }
      } catch (err) {
        this.$alert.show({
          type: 'error',
          message: 'Failed to get categories collection',
        })
      } finally {
        this.categoryLoading = false
      }
    },
    formSubmit() {
      this.loading = true

      const formData = new FormData
      for (const key in this.form) {
        const field = this.form[key]
        if (field !== null && field !== '') formData.append(key, field)
      }

      if (this.food) formData.append('_method', 'PATCH')

      return !this.food
        ? this.create(formData)
        : this.update(formData)
    },
    async create(payload) {
      clearValidationErrors(this.errors)
      
      try {
        const res = await foodApi.create(payload)
        const {ok, data} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Food created.',
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
        const res = await foodApi.update(this.food.id, payload)
        const {ok, data} = res.data

        if (ok) {
          this.$alert.show({
            message: 'Food updated.',
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