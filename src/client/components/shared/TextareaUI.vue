<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const model = defineModel<string>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    placeholder?: string
    rows?: number
    disabled?: boolean
    error?: string
    throttleMs?: number
    description?: string
  }>(),
  {
    id: undefined,
    label: undefined,
    placeholder: undefined,
    rows: 6,
    disabled: false,
    error: undefined,
    throttleMs: 0,
    description: undefined,
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
  const target = event.target as HTMLTextAreaElement
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
  <div class="app-textarea">
    <div
      v-if="props.label || props.description"
      class="app-textarea__header"
    >
      <label
        v-if="props.label"
        :for="props.id"
        class="app-textarea__label"
      >
        {{ props.label }}
      </label>

      <p v-if="props.description" class="app-textarea__description">
        {{ props.description }}
      </p>
    </div>

    <textarea
      :id="props.id"
      :value="innerValue"
      class="app-textarea__field"
      :placeholder="props.placeholder"
      :rows="props.rows"
      :disabled="props.disabled"
      @input="handleInput"
    />

    <p v-if="props.error" class="app-textarea__error">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped>
.app-textarea {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.app-textarea__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-textarea__description {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: color-mix(in srgb, var(--primary-color-1) 70%, transparent);
}

.app-textarea__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color-1);
}

.app-textarea__field {
  width: 100%;
  min-height: 140px;
  resize: vertical;

  padding: 12px 14px;

  border: 1px solid var(--border-color-1);
  border-radius: 10px;

  background: var(--primary-color-2);
  color: white;

  font-size: 16px;
  line-height: 1.5;
  font-family: inherit;

  outline: none;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.app-textarea__field::placeholder {
  color: color-mix(in srgb, var(--primary-color-1) 55%, transparent);
}

.app-textarea__field:focus {
  border-color: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

.app-textarea__field:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.app-textarea__error {
  margin: 0;
  font-size: 13px;
  color: #d66a6a;
}
</style>
