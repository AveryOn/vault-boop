<script setup lang="ts">
import MarkdownBody from '~/client/components/shared/MarkdownBody.vue'

const props = defineProps<{
  uuid: string
  html: string
}>()
</script>

<template>
  <div>
    <h1>Article View {{ props.uuid }}</h1>
    <MarkdownBody v-bind="props" />
  </div>
</template>

<style scoped></style>
