<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    icon: string
    size?: number
  }>(),
  {
    size: 24,
  },
)

const iconSize = computed(() => props.size)
</script>

<template>
  <svg-icon type="mdi" :path="props.icon" :size="iconSize"></svg-icon>
</template>
