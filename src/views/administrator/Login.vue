<template>
  <div>
    <v-row justify="center">
      <v-col
        md="6"
        lg="4"
      >
        <h1 class="mb-2 text-center">
          Login

          <template v-if="type !== 'customer'">
            Administrator
          </template>
        </h1>

        <!-- The Card -->
        <v-card
          id="login-card"
          elevation="3"
        >
          <v-card-text>
            <!-- The Alert -->
            <v-alert
              v-if="errorLoginMessage"
              type="error"
            >
              {{ errorLoginMessage }}
            </v-alert>
          
            <!-- The Form -->
            <v-form @submit.prevent="goLogin">
              <v-text-field
                v-model="form.username"
                label="Username"
                prepend-inner-icon="mdi mdi-account"
                :error-messages="errors.username"
              />

              <v-text-field
                v-model="form.password"
                type="password"
                label="Password"
                prepend-inner-icon="mdi mdi-lock"
                :error-messages="errors.password"
              />

              <v-btn
                block
                dark
                type="submit"
                color="grey darken-4"
                :loading="loading"
                :class="{'mt-2': errors.password}"
              >
                <span>Login</span>
                <i class="mdi mdi-send ml-1" />
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {clearValidationErrors, showValidationErrors} from '@/helpers/form'

export default {
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
      errorLoginMessage: null,
    }
  },

  computed: {
    type() {
      const type = this.$route.query?.type
      
      return type || null
    },
  },

  methods: {
    async goLogin() {
      // Clear errors
      this.errorLoginMessage = null
      clearValidationErrors(this.errors)

      // Set loading
      this.loading = true

      try {
        // Login
        await this.$auth.login(this.form)

        const defaultRedirect = this.type === 'customer'
          ? '/'
          : { name: 'administrator.home' }

        // Redirect user
        const redirect = this.$route.query?.redirect
        redirect
          ? this.$router.push(redirect)
          : this.$router.push(defaultRedirect)
      } catch (err) {
        const status = err?.response?.status

        switch (status) {
        case 422:
          showValidationErrors(this.errors, err.response.data)
          break

        case 401:
          this.errorLoginMessage = 'Invalid credentials.'
          break
        
        default:
          console.log(err)
          this.errorLoginMessage = 'Something went wrong.'
          break
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  #login-card {
    border-radius: 7px;
  }
</style>