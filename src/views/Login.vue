<template>
  <div
    class="d-flex justify-center pt-16"
  >
    <div style="width: 100%;">
      <!-- The Card -->
      <v-card
        id="login-card"
        elevation="3"
      >
        <v-card-title class="pb-0">
          <span class="mdi mdi-food-fork-drink headline grey--text text--darken-3 font-weight-medium" />
          <span class="ml-2 headline grey--text text--darken-3 font-weight-medium">{{ appName }}</span>
        </v-card-title>

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

            <div class="d-flex justify-end">
              <v-btn
                dark
                type="submit"
                color="grey darken-3"
                :loading="loading"
                :class="{'mt-2': errors.password}"
              >
                <span>Login</span>
                <i class="mdi mdi-send ml-1" />
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
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
    appName() {
      return process.env.VUE_APP_TITLE 
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

        // Redirect user
        const redirect = this.$route.query?.redirect
        redirect
          ? window.location.href = redirect
          : window.location.href = '/'
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
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
  }

  @media screen and (min-width: 1024px) {
    #login-card {
      max-width: 45%;
    }
  }

  @media screen and (min-width: 1564px) {
    #login-card {
      max-width: 30%;
    }
  }
</style>