<template>
  <v-navigation-drawer v-model="isOpen">
    <v-app-bar-title>
      <h1>Navigation</h1>
      <v-btn class="btn-gnb-close" icon="mdi-close" @click="isOpen = !isOpen" />
    </v-app-bar-title>
    <v-list>
      <v-list-item prepend-icon="mdi-home-outline" title="Home" to="/"></v-list-item>
      <v-list-group value="Users">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" prepend-icon="mdi-account-circle" title="Users"></v-list-item>
        </template>
        <v-list-item prepend-icon="mdi-circle-small" title="Users1" to="/user1"></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'gnb',
  props: {
    modelValue: { type: Boolean, default: true },
  },
  data() {
    return {
      isOpen: true,
    }
  },
  watch: {
    modelValue(flag) {
      this.isOpen = flag
    },
    isOpen(flag) {
      this.$emit('update:modelValue', flag)
    },
  },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
