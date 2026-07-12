<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

type AppInputSize = 'xsmall' | 'small' | 'medium' | 'large'

const model = defineModel<string>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    placeholder?: string
    type?: string
    disabled?: boolean
    error?: string
    throttleMs?: number
    size?: AppInputSize
  }>(),
  {
    id: undefined,
    label: undefined,
    placeholder: undefined,
    type: 'text',
    disabled: false,
    error: undefined,
    throttleMs: 0,
    size: 'medium',
  },
)

const emit = defineEmits<{
  input: [value: string]
  throttledInput: [value: string]
}>()

const innerValue = ref(model.value)

let timer: ReturnType<typeof setTimeout> | null = null
let lastValue = innerValue.value

watch(model, (value) => {
  if (value !== innerValue.value) {
    innerValue.value = value
  }
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value

  innerValue.value = value
  lastValue = value

  emit('input', value)

  if (props.throttleMs <= 0) {
    model.value = value
    emit('throttledInput', value)
    return
  }

  if (timer) {
    return
  }

  timer = setTimeout(() => {
    model.value = lastValue
    emit('throttledInput', lastValue)
    timer = null
  }, props.throttleMs)
}

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<template>
  <div class="app-input">
    <label v-if="props.label" :for="props.id" class="app-input__label">
      {{ props.label }}
    </label>

    <input :id="props.id" :type="props.type" :value="innerValue" class="app-input__field"
      :class="`app-input__field--${props.size}`" :placeholder="props.placeholder" :disabled="props.disabled"
      @input="handleInput" />

    <p v-if="props.error" class="app-input__error">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.app-input__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color-1);
}

.app-input__field {
  width: 100%;
  height: 100%;

  border: 1px solid var(--border-color-1);
  border-radius: 10px;

  background: var(--primary-color-2);
  color: white;

  line-height: 1;
  font-family: inherit;

  outline: none;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.app-input__field--xsmall {
  min-height: 28px;
  padding: 0 10px;
  font-size: 13px;
}

.app-input__field--small {
  min-height: 38px;
  padding: 0 12px;
  font-size: 14px;
}

.app-input__field--medium {
  min-height: 44px;
  padding: 0 14px;
  font-size: 16px;
}

.app-input__field--large {
  min-height: 52px;
  padding: 0 16px;
  font-size: 18px;
}

.app-input__field::placeholder {
  color: color-mix(in srgb, var(--primary-color-1) 55%, transparent);
}

.app-input__field:focus {
  border-color: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

.app-input__field:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.app-input__error {
  margin: 0;
  font-size: 13px;
  color: #d66a6a;
}
</style>
