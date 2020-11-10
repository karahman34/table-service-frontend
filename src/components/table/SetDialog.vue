<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
    :persistent="persistent"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        Set Table

        <v-btn
          icon
          :disabled="!form.number"
          @click="closeDialog"
        >
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Error Alert -->
        <v-alert
          v-if="alertMessage.text"
          :type="alertMessage.type"
        >
          {{ alertMessage.text }}
        </v-alert>

        <!-- Warning Alert -->
        <v-alert type="warning">
          Please contact the waiter to perform this action.
        </v-alert>

        <!-- The Form -->
        <v-form @submit.prevent="save">
          <!-- Username -->
          <v-text-field
            v-model="form.username"
            label="Admin / Waiter Username"
            prepend-inner-icon="mdi mdi-account"
            :error-messages="errors.username"
          />

          <!-- Password -->
          <v-text-field
            v-model="form.password"
            label="Password"
            type="password"
            prepend-inner-icon="mdi mdi-lock"
            :error-messages="errors.password"
          />

          <!-- Table Number -->
          <v-text-field
            v-model="form.number"
            label="Table Number"
            type="number"
            prepend-inner-icon="mdi mdi-format-list-numbered"
            :error-messages="errors.number"
          />

          <!-- Actions -->
          <div
            class="d-flex justify-space-between"
            :class="{'mt-1': errors.number !== null}"
          >
            <!-- Reset -->
            <v-btn
              type="button"
              color="error"
              :loading="loading"
              @click="reset()"
            >
              Reset
            </v-btn>
            
            <!-- Save -->
            <v-btn
              type="submit"
              color="primary lighten-1 white--text"
              :loading="loading"
            >
              Save
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { clearValidationErrors, showValidationErrors } from '@/helpers/form'
import DialogMixin from '@/mixins/DialogMixin'

export default {
  mixins: [DialogMixin],

  data() {
    return {
      form: {
        number: null,
        username: null,
        password: null,
      },
      errors: {
        number: null,
        username: null,
        password: null,
      },
      loading: false,
      alertMessage: {
        text: null,
        type: null,
      },
      persistent: false,
      oldTableNumber: null,
    }
  },

  computed: {
    ...mapState('table', {
      currentNumber: state => state.number,
    }),
  },

  watch: {
    currentNumber: {
      immediate: true,
      handler(val) {
        val !== null
          ? this.persistent = false
          : this.persistent = true
      },
    },
  },

  mounted () {
    if (this.currentNumber) {
      this.form.number = this.currentNumber
      this.oldTableNumber = this.currentNumber
    }
  },

  methods: {
    ...mapActions('table', {
      setTable: 'setTable',
    }),
    reset() {
      this.form.number = null
      this.save()
    },
    async save() {
      this.loading = true
      this.alertMessage = {
        text: null,
        type: null,
      }
      clearValidationErrors(this.errors)

      try {
        // Dispatch vuex action
        await this.setTable({
          ...this.form,
          old_number: this.oldTableNumber,
        })

        this.oldTableNumber = this.form.number

        // Show message
        this.alertMessage = {
          type: 'success',
          text: `Table number ${this.form.number} ready!`,
        }
      } catch (err) {
        const statusCode = err?.response?.status
        this.alertMessage.type = 'error'

        if (statusCode === 403) {
          this.alertMessage.text = 'User does not have the right permissions.'
        } else if (statusCode === 401) {
          this.alertMessage.text = 'Username or password is invalid.'
        } else if (statusCode === 422) {
          showValidationErrors(this.errors, err.response.data)
        } else {
          this.alertMessage.text = err?.response?.data?.message || 'Failed to set table, please try again later.'
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>