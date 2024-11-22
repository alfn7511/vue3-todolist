<template>
  <v-app-bar app>
    <template v-slot:prepend v-if="!isGnbOpen">
      <v-app-bar-nav-icon @click="$emit('clickGnbOpen')"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>Application bar</v-app-bar-title>
  </v-app-bar>
</template>

<script>
export default {
  name: 'comp-header',
  props: {
    isGnbOpen: { type: Boolean, default: true },
  },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
