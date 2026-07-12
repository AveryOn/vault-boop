<!-- eslint-disable no-undef -->
<script setup lang="ts">
const model = defineModel<boolean>({
  default: false,
})

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    disabled?: boolean
    error?: string
  }>(),
  {
    id: undefined,
    label: undefined,
    disabled: false,
    error: undefined,
  },
)

const emit = defineEmits<{
  input: [value: boolean]
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.checked

  model.value = value
  emit('input', value)
}
</script>

<template>
  <div class="app-checkbox">
    <label
      class="app-checkbox__control"
      :class="{
        'app-checkbox__control--disabled': props.disabled,
      }"
      :for="props.id"
    >
      <input
        :id="props.id"
        class="app-checkbox__native"
        type="checkbox"
        :checked="model"
        :disabled="props.disabled"
        @change="handleChange"
      />

      <span class="app-checkbox__box">
        <span class="app-checkbox__check">✓</span>
      </span>

      <span v-if="props.label" class="app-checkbox__label">
        {{ props.label }}
      </span>
    </label>

    <p v-if="props.error" class="app-checkbox__error">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped>
.app-checkbox {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: fit-content;
}

.app-checkbox__control {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;
  user-select: none;
}

.app-checkbox__control--disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.app-checkbox__native {
  position: absolute;

  width: 1px;
  height: 1px;

  opacity: 0;
  pointer-events: none;
}

.app-checkbox__box {
  width: 20px;
  height: 20px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border: 1px solid var(--border-color-1);
  border-radius: 6px;

  background: var(--primary-color-2);
  color: white;

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.app-checkbox__check {
  font-size: 14px;
  line-height: 1;

  opacity: 0;
  transform: scale(0.7);

  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.app-checkbox__native:checked + .app-checkbox__box {
  border-color: var(--primary-color-1);
  background: var(--primary-color-3);
}

.app-checkbox__native:checked + .app-checkbox__box .app-checkbox__check {
  opacity: 1;
  transform: scale(1);
  color: var(--primary-color-1);
}

.app-checkbox__native:focus + .app-checkbox__box {
  border-color: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

.app-checkbox__control:hover .app-checkbox__box {
  border-color: var(--primary-color-1);
}

.app-checkbox__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color-1);
}

.app-checkbox__error {
  margin: 0;
  font-size: 13px;
  color: #d66a6a;
}
</style>
