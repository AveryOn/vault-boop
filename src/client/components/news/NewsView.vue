<script setup lang="ts">
import type { Article } from '~/shared/types'

const props = defineProps<{
  articles: Article[]
}>()
</script>

<template>
  <div>
    <h1>NEWS</h1>
    <ul>
      <li
        v-for="article in props.articles"
        :key="article.id"
        class="article-item"
      >
        {{ article.title }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.article-item {
  width: 80%;
  min-height: 100px;
  height: max-content;
  border: 2px solid red;
}
</style>
