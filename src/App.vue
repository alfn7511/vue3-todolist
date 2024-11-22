<template>
  <v-app>
    <v-layout :class="{ 'gnb-open': isGnbOpen }">
      <Gnb v-model="isGnbOpen" />
      <Header :isGnbOpen="isGnbOpen" @clickGnbOpen="clickGnbOpen" />
      <v-main>
        <router-view />
      </v-main>
      <v-footer app> Footer </v-footer>
    </v-layout>
    <AlertConfrim />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isGnbOpen: true,
    }
  },
  methods: {
    clickGnbOpen() {
      this.isGnbOpen = !this.isGnbOpen
    },
  },
}
</script>
