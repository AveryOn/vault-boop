<script setup lang="ts">
import { computed } from 'vue'
import {
  useToast,
  type ToastItem,
  type ToastPosition,
  type ToastVariant,
} from '~/client/composables/useToast'

const props = withDefaults(
  defineProps<{
    position?: ToastPosition
  }>(),
  {
    position: 'bottom-right',
  },
)

const { toasts, remove, pause, resume } = useToast()

const positionClass = computed(() => {
  return `toast-viewport--${props.position}`
})

const icons: Record<ToastVariant, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '!',
}

function handleAction(toast: ToastItem) {
  toast.action?.onClick()
  remove(toast.id)
}
</script>

<template>
  <Teleport to="body">
    <TransitionGroup
      tag="div"
      name="toast"
      class="toast-viewport"
      :class="positionClass"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      <article
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-card"
        :class="`toast-card--${toast.variant}`"
        :role="toast.variant === 'error' ? 'alert' : 'status'"
        @mouseenter="pause(toast.id)"
        @mouseleave="resume(toast.id)"
      >
        <div class="toast-card__icon" aria-hidden="true">
          {{ icons[toast.variant] }}
        </div>

        <div class="toast-card__content">
          <h3 v-if="toast.title" class="toast-card__title">
            {{ toast.title }}
          </h3>

          <p class="toast-card__message">
            {{ toast.message }}
          </p>

          <button
            v-if="toast.action"
            type="button"
            class="toast-card__action"
            @click="handleAction(toast)"
          >
            {{ toast.action.label }}
          </button>
        </div>

        <button
          v-if="toast.closable"
          type="button"
          class="toast-card__close"
          aria-label="Закрыть уведомление"
          @click="remove(toast.id)"
        >
          ×
        </button>
      </article>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped>
.toast-viewport {
  position: fixed;
  z-index: 9999;

  display: flex;
  flex-direction: column;
  gap: 12px;

  width: min(420px, calc(100vw - 32px));

  pointer-events: none;
}

.toast-viewport--top-left {
  top: 24px;
  left: 24px;
}

.toast-viewport--top-center {
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-viewport--top-right {
  top: 24px;
  right: 24px;
}

.toast-viewport--bottom-left {
  bottom: 24px;
  left: 24px;
}

.toast-viewport--bottom-center {
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-viewport--bottom-right {
  right: 24px;
  bottom: 24px;
}

.toast-card {
  position: relative;

  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;

  padding: 14px 14px 14px 12px;

  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-left-width: 4px;
  border-radius: 14px;

  box-shadow:
    0 12px 32px rgb(15 23 42 / 12%),
    0 2px 8px rgb(15 23 42 / 8%);

  pointer-events: auto;
}

.toast-card--info {
  border-left-color: #2563eb;
}

.toast-card--success {
  border-left-color: #16a34a;
}

.toast-card--warning {
  border-left-color: #d97706;
}

.toast-card--error {
  border-left-color: #dc2626;
}

.toast-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 22px;
  height: 22px;

  margin-top: 1px;

  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;
  line-height: 1;

  background: #f3f4f6;
  color: #111827;
}

.toast-card--info .toast-card__icon {
  background: #dbeafe;
  color: #1d4ed8;
}

.toast-card--success .toast-card__icon {
  background: #dcfce7;
  color: #15803d;
}

.toast-card--warning .toast-card__icon {
  background: #fef3c7;
  color: #b45309;
}

.toast-card--error .toast-card__icon {
  background: #fee2e2;
  color: #b91c1c;
}

.toast-card__content {
  min-width: 0;
}

.toast-card__title {
  margin: 0 0 4px;

  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;

  color: #111827;
}

.toast-card__message {
  margin: 0;

  font-size: 14px;
  line-height: 1.45;

  color: #4b5563;
}

.toast-card__action {
  margin-top: 10px;
  padding: 0;

  border: 0;
  background: transparent;

  font: inherit;
  font-size: 13px;
  font-weight: 700;

  color: #111827;

  cursor: pointer;
}

.toast-card__action:hover {
  text-decoration: underline;
}

.toast-card__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  padding: 0;

  border: 0;
  border-radius: 999px;

  background: transparent;
  color: #6b7280;

  font-size: 20px;
  line-height: 1;

  cursor: pointer;
}

.toast-card__close:hover {
  background: #f3f4f6;
  color: #111827;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.toast-move {
  transition: transform 0.18s ease;
}

@media (max-width: 640px) {
  .toast-viewport {
    right: 16px;
    left: 16px;

    width: auto;
  }

  .toast-viewport--top-left,
  .toast-viewport--top-center,
  .toast-viewport--top-right {
    top: 16px;
    transform: none;
  }

  .toast-viewport--bottom-left,
  .toast-viewport--bottom-center,
  .toast-viewport--bottom-right {
    bottom: 16px;
    transform: none;
  }
}
</style>
