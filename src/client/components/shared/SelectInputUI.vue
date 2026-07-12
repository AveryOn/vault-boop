<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export type SelectOption = {
  label: string
  value: string
  disabled?: boolean
}

type AppInputSize = 'xsmall' | 'small' | 'medium' | 'large'

const model = defineModel<string>({
  default: '',
})

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    placeholder?: string
    disabled?: boolean
    error?: string
    options: SelectOption[]
    size?: AppInputSize
  }>(),
  {
    id: undefined,
    label: undefined,
    placeholder: 'Select option',
    disabled: false,
    error: undefined,
    size: 'medium',
  },
)

const emit = defineEmits<{
  input: [value: string]
}>()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => {
  return props.options.find((option) => option.value === model.value)
})

function toggleDropdown() {
  if (props.disabled) {
    return
  }

  isOpen.value = !isOpen.value
}

function selectOption(option: SelectOption) {
  if (option.disabled) {
    return
  }

  model.value = option.value
  emit('input', option.value)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (!rootRef.value) {
    return
  }

  if (!rootRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      isOpen.value = false
    }
  },
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="rootRef" class="app-select">
    <label v-if="props.label" :for="props.id" class="app-select__label">
      {{ props.label }}
    </label>

    <button :id="props.id" type="button" class="app-select__field" :class="[
      `app-select__field--${props.size}`,
      {
        'app-select__field--open': isOpen,
        'app-select__field--empty': !selectedOption,
      },
    ]" :disabled="props.disabled" @click="toggleDropdown">
      <span class="app-select__value">
        {{ selectedOption?.label ?? props.placeholder }}
      </span>

      <span class="app-select__arrow">⌄</span>
    </button>

    <div v-if="isOpen" class="app-select__dropdown">
      <button v-for="option in props.options" :key="option.value" type="button" class="app-select__option" :class="{
        'app-select__option--selected': option.value === model,
        'app-select__option--disabled': option.disabled,
      }" :disabled="option.disabled" @click="selectOption(option)">
        {{ option.label }}
      </button>
    </div>

    <p v-if="props.error" class="app-select__error">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped>
.app-select {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.app-select__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color-1);
}

.app-select__field {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  border: 1px solid var(--border-color-1);
  border-radius: 10px;

  background: var(--primary-color-2);
  color: white;

  line-height: 1;
  font-family: inherit;
  text-align: left;

  outline: none;
  cursor: pointer;

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.app-select__field--xsmall {
  min-height: 28px;
  padding: 0 10px;
  font-size: 13px;
}

.app-select__field--small {
  min-height: 38px;
  padding: 0 12px;
  font-size: 14px;
}

.app-select__field--medium {
  min-height: 44px;
  padding: 0 14px;
  font-size: 16px;
}

.app-select__field--large {
  min-height: 52px;
  padding: 0 16px;
  font-size: 18px;
}

.app-select__field:hover:not(:disabled) {
  border-color: var(--primary-color-1);
}

.app-select__field:focus {
  border-color: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

.app-select__field--open {
  border-color: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

.app-select__field--empty {
  color: color-mix(in srgb,
      var(--primary-color-1) 55%,
      transparent);
}

.app-select__field:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.app-select__value {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.app-select__arrow {
  flex-shrink: 0;

  color: var(--primary-color-1);
  font-size: 18px;
  line-height: 1;

  transition: transform 0.15s ease;
}

.app-select__field--open .app-select__arrow {
  transform: rotate(180deg);
}

.app-select__dropdown {
  position: absolute;
  z-index: 20;
  top: calc(100% + 6px);
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  gap: 4px;

  max-height: 220px;
  overflow-y: auto;

  padding: 6px;

  border: 1px solid var(--border-color-1);
  border-radius: 10px;

  background: var(--primary-color-3-100);
  box-shadow: 0 14px 35px rgb(0 0 0 / 35%);
}

.app-select__option {
  width: 100%;
  min-height: 38px;

  padding: 0 10px;

  border: none;
  border-radius: 7px;

  background: transparent;
  color: white;

  font-size: 15px;
  font-family: inherit;
  text-align: left;

  cursor: pointer;

  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.app-select__option:hover:not(:disabled) {
  background: var(--primary-color-4);
  color: var(--text-color-5);
}

.app-select__option--selected {
  background: var(--primary-color-4);
  color: var(--text-color-6);
}

.app-select__option--disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.app-select__error {
  margin: 0;
  font-size: 13px;
  color: #d66a6a;
}
</style>
