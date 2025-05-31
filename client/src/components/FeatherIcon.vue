<script setup lang="ts">
import { icons, replace } from 'feather-icons'
import { onMounted } from 'vue'

const props = defineProps<{
  icon: keyof typeof icons
}>()

onMounted(() => {
  replace()
})
</script>
<template>
  <i v-bind:data-feather="props.icon"></i>
</template>
