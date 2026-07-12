<script setup lang="ts">
const props = defineProps<{
  uuid: string
}>()
</script>

<template>
  <div class="header">Projects View {{ props.uuid }}</div>
</template>

<style scoped></style>
