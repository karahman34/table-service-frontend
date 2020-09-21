<template>
  <v-tooltip top>
    <!-- Activator -->
    <template v-slot:activator="{on, attrs}">
      <v-btn
        icon
        :color="color"
        v-bind="attrs"
        v-on="on"
        @click="$emit('click', $event)"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>

    <!-- Content -->
    <span>Edit Item</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'editButton',
    },
    icon: {
      type: String,
      default: 'mdi mdi-pencil',
    },
  },
}
</script>