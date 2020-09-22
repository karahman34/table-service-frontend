<template>
  <v-app>
    <v-main>
      <v-container
        id="main-container"
        class="d-flex flex-column align-center"
      >
        <!-- Router View / Message Error -->
        <slot />

        <!-- Router -->
        <router-link
          to="/"
          class="error-href d-block"
        >
          <v-icon>mdi mdi-campfire</v-icon>
          <span class="ml-1">Go back home</span>
        </router-link>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
    
}
</script>

<style lang="scss">
  .v-application {
    background-color: #f1f1f1;
  }

  #main-container {
    margin-top: 170px;
  }

  .error-href {
    color: grey !important;
    text-decoration: none;
    font-weight: 500;
  }

  .error-message {
    margin: 0;
    color: rgb(82, 82, 82);
    font-weight: 400;
    font-size: 50px;
  }
</style>