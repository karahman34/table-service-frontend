<template>
  <v-card elevation="3">
    <v-skeleton-loader
      height="220"
      type="image"
    />

    <v-card-text>
      <v-skeleton-loader type="text" />

      <v-skeleton-loader
        type="text"
        style="width:50%;"
        class="mt-3"
      />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    
}
</script>