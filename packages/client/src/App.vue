<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- TODO: Add app layout -->
  <nav>
    <ul>
      <li><RouterLink :to="{ name: 'checkout' }">Checkout</RouterLink></li>
      <li><RouterLink :to="{ name: 'sync' }">Sync Checkouts</RouterLink></li>
    </ul>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  height: var(--sp-4);
  padding-inline: var(--sp-3);
}

nav a {
  color: var(--pico-secondary);
}

nav a.router-link-active {
  color: var(--pico-color);
}
</style>
