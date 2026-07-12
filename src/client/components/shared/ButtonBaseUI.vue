<script setup lang="ts">
type BaseButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type BaseButtonSize = 'xsmall' | 'small' | 'medium' | 'large'

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    variant?: BaseButtonVariant
    size?: BaseButtonSize
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>

<template>
  <button :type="type" class="base-button" :class="[
    `base-button--${variant}`,
    `base-button--${size}`,
    {
      'base-button--disabled': disabled,
      'base-button--loading': loading,
      'base-button--full-width': fullWidth,
    },
  ]" :disabled="disabled || loading" @click="handleClick">
    <span v-if="loading" class="base-button__loader" aria-hidden="true" />

    <span class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  border: 1px solid transparent;
  border-radius: 10px;

  font-family: inherit;
  font-weight: 600;
  line-height: 1;

  cursor: pointer;
  user-select: none;

  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease,
    transform 0.15s ease;
}

.base-button:active:not(:disabled) {
  transform: translateY(1px);
}

.base-button:disabled {
  cursor: not-allowed;
}

.base-button--xsmall {
  min-height: 28px;
  padding: 0 10px;
  font-size: 12px;
}

.base-button--small {
  min-height: 34px;
  padding: 0 12px;
  font-size: 13px;
}

.base-button--medium {
  min-height: 40px;
  padding: 0 16px;
  font-size: 14px;
}

.base-button--large {
  min-height: 46px;
  padding: 0 20px;
  font-size: 15px;
}

.base-button--full-width {
  width: 100%;
}

.base-button--primary {
  background: var(--primary-color-1);
  border-color: #111827;
  color: #ffffff;
}

.base-button--primary:hover:not(:disabled) {
  background: var(--primary-color-4);
  border-color: var(--border-color-2);
}

.base-button--secondary {
  background: var(--primary-color-5);
  border-color: var(--border-color-1);
  color: var(--primary-color-1);
}

.base-button--secondary:hover:not(:disabled) {
  background: var(--primary-color-3);
  border-color: var(--primary-color-1);
}

.base-button--ghost {
  background: transparent;
  border-color: transparent;
  color: #374151;
}

.base-button--ghost:hover:not(:disabled) {
  background: #f3f4f6;
}

.base-button--danger {
  background: #dc2626;
  border-color: #dc2626;
  color: #ffffff;
}

.base-button--danger:hover:not(:disabled) {
  background: #b91c1c;
  border-color: #b91c1c;
}

.base-button--disabled,
.base-button--loading {
  opacity: 0.6;
}

.base-button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.base-button__loader {
  width: 14px;
  height: 14px;

  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 999px;

  animation: base-button-spin 0.7s linear infinite;
}

.base-button--xsmall .base-button__loader {
  width: 12px;
  height: 12px;
}

.base-button--small .base-button__loader {
  width: 13px;
  height: 13px;
}

.base-button--medium .base-button__loader {
  width: 14px;
  height: 14px;
}

.base-button--large .base-button__loader {
  width: 16px;
  height: 16px;
}

@keyframes base-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
