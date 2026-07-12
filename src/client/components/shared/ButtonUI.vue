<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { computed } from 'vue'
import { mdiLoading } from '@mdi/js'
import Icon from '../common/Icon.vue'

type AppButtonSize = 'xsmall' | 'small' | 'medium' | 'large'

const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    loading?: boolean
    size?: AppButtonSize
  }>(),
  {
    label: undefined,
    disabled: false,
    loading: false,
    size: 'medium',
  },
)

const spinnerSize = computed(() => {
  switch (props.size) {
    case 'xsmall':
      return 18
    case 'small':
      return 24
    case 'medium':
      return 30
    case 'large':
      return 36
    default:
      return 30
  }
})
</script>

<template>
  <button class="button" :class="`button--${props.size}`" :disabled="props.disabled">
    <Icon v-if="props.loading" class="loading-ui__spinner" :icon="mdiLoading" :size="spinnerSize"></Icon>
    <slot name="default">{{ props.label ?? $slots }}</slot>
  </button>
</template>

<style scoped>
.button {
  align-self: start;

  height: 100%;
  background-color: var(--button-color-1);
  border-radius: 10px;
  margin: 0 6px;
  transition: all 0.4s ease;
}

.button--xsmall {
  padding: 4px 6px;
  font-size: 12px;
  height: 24px;
}

.button--small {
  padding: 6px 8px;
  font-size: 14px;
}

.button--medium {
  padding: 8px;
  font-size: 16px;
}

.button--large {
  padding: 10px 14px;
  font-size: 18px;
}

.button:hover {
  background-color: var(--button-color-1-hover);
  margin: 0;
}

.button:disabled {
  background-color: gray;
  margin: 0;
}

.loading-ui__spinner {
  display: inline-block;

  border: 3px solid var(--primary-color-3);
  border-top-color: var(--primary-color-1);
  border-radius: 50%;

  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
