<script setup lang="ts">
import type { Article } from '~/shared/types'

const props = defineProps<{
  articles: Article[]
}>()
</script>

<template>
  <div>
    <ul>
      <li v-for="article in props.articles" :key="article.id">
        {{ article.title }}
      </li>
    </ul>
    ARTICLES View
  </div>
</template>

<style scoped></style>
