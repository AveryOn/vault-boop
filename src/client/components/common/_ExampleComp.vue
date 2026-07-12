<script setup lang="ts">
import { UseI18n } from '~/client/composables/useI18n'

const { $t, plural } = UseI18n()

const count = 101
</script>

<template>
  <div class="example-314231">
    MAIN
    <div>
      <p>{{ $t('Hello World!') }}</p>
      <p>{{ $t('Example 123') }}</p>
      <p>{{ plural('Project', count) }}</p>
      <p>{{ plural('You have {count} project', count) }}</p>
    </div>
    lorem1000
  </div>
</template>

<style scoped></style>
