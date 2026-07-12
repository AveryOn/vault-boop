<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type EmailPayload = {
  value: string
  normalized: string
  isValid: boolean
  reason: string | null
}

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
    hint?: string
    required?: boolean
    throttleMs?: number
    showSuggestions?: boolean
    domains?: string[]
  }>(),
  {
    id: undefined,
    label: undefined,
    placeholder: 'email@example.com',
    disabled: false,
    error: undefined,
    hint: undefined,
    required: false,
    throttleMs: 0,
    showSuggestions: true,
    domains: () => [
      'gmail.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
      'yahoo.com',
      'proton.me',
      'protonmail.com',
    ],
  },
)

const emit = defineEmits<{
  input: [value: string]
  throttledInput: [value: string]
  emailChange: [payload: EmailPayload]
}>()

const innerValue = ref(model.value)
const isFocused = ref(false)
const activeSuggestionIndex = ref(0)

let timer: ReturnType<typeof setTimeout> | null = null
let lastValue = innerValue.value

const normalizedValue = computed(() => {
  return normalizeEmail(innerValue.value)
})

const emailValidation = computed(() => {
  return validateEmail(normalizedValue.value)
})

const isValid = computed(() => {
  return emailValidation.value.isValid
})

const localPart = computed(() => {
  return normalizedValue.value.split('@')[0] ?? ''
})

const domainPart = computed(() => {
  return normalizedValue.value.split('@')[1] ?? ''
})

const hasAtSymbol = computed(() => {
  return normalizedValue.value.includes('@')
})

const suggestedTypoDomain = computed(() => {
  const typoMap: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'hotmai.com': 'hotmail.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com',
    'iclod.com': 'icloud.com',
    'icloud.co': 'icloud.com',
    'yaho.com': 'yahoo.com',
    'yahoo.co': 'yahoo.com',
  }

  return typoMap[domainPart.value] ?? null
})

const domainSuggestions = computed(() => {
  if (!props.showSuggestions) {
    return []
  }

  if (!isFocused.value) {
    return []
  }

  if (!hasAtSymbol.value) {
    return []
  }

  if (!localPart.value) {
    return []
  }

  const domain = domainPart.value

  if (!domain) {
    return props.domains.slice(0, 6)
  }

  return props.domains
    .filter((item) => item.startsWith(domain))
    .filter((item) => item !== domain)
    .slice(0, 6)
})

const shouldShowSuggestions = computed(() => {
  return domainSuggestions.value.length > 0
})

const statusText = computed(() => {
  if (!innerValue.value && props.hint) {
    return props.hint
  }

  if (!innerValue.value) {
    return null
  }

  if (props.error) {
    return null
  }

  if (isValid.value) {
    return 'Email looks valid'
  }

  return emailValidation.value.reason
})

watch(model, (value) => {
  if (value !== innerValue.value) {
    innerValue.value = value
  }
})

function normalizeEmail(value: string) {
  return value.trim().replace(/\s+/g, '').toLowerCase()
}

function validateEmail(value: string): {
  isValid: boolean
  reason: string | null
} {
  if (!value) {
    return {
      isValid: !props.required,
      reason: props.required ? 'Email is required' : null,
    }
  }

  if (!value.includes('@')) {
    return {
      isValid: false,
      reason: 'Email must contain @',
    }
  }

  const parts = value.split('@')

  if (parts.length !== 2) {
    return {
      isValid: false,
      reason: 'Email must contain only one @',
    }
  }

  const [local, domain] = parts

  if (!local) {
    return {
      isValid: false,
      reason: 'Email name is required',
    }
  }

  if (!domain) {
    return {
      isValid: false,
      reason: 'Email domain is required',
    }
  }

  if (!domain.includes('.')) {
    return {
      isValid: false,
      reason: 'Email domain must contain a dot',
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  if (!emailRegex.test(value)) {
    return {
      isValid: false,
      reason: 'Email format is invalid',
    }
  }

  return {
    isValid: true,
    reason: null,
  }
}

function buildPayload(value: string): EmailPayload {
  const normalized = normalizeEmail(value)
  const validation = validateEmail(normalized)

  return {
    value,
    normalized,
    isValid: validation.isValid,
    reason: validation.reason,
  }
}

function commitValue(value: string) {
  const normalized = normalizeEmail(value)

  innerValue.value = normalized
  lastValue = normalized

  emit('input', normalized)
  emit('emailChange', buildPayload(normalized))

  if (props.throttleMs <= 0) {
    model.value = normalized
    emit('throttledInput', normalized)
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

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement

  activeSuggestionIndex.value = 0
  commitValue(target.value)
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  window.setTimeout(() => {
    isFocused.value = false
  }, 120)
}

function applyDomain(domain: string) {
  if (!localPart.value) {
    return
  }

  commitValue(`${localPart.value}@${domain}`)
  isFocused.value = false
}

function applyTypoSuggestion() {
  if (!suggestedTypoDomain.value) {
    return
  }

  applyDomain(suggestedTypoDomain.value)
}

function clearValue() {
  commitValue('')
}

function handleKeydown(event: KeyboardEvent) {
  if (!shouldShowSuggestions.value) {
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()

    activeSuggestionIndex.value =
      activeSuggestionIndex.value >= domainSuggestions.value.length - 1
        ? 0
        : activeSuggestionIndex.value + 1
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()

    activeSuggestionIndex.value =
      activeSuggestionIndex.value <= 0
        ? domainSuggestions.value.length - 1
        : activeSuggestionIndex.value - 1
  }

  if (event.key === 'Enter') {
    event.preventDefault()

    const domain = domainSuggestions.value[activeSuggestionIndex.value]

    if (domain) {
      applyDomain(domain)
    }
  }

  if (event.key === 'Escape') {
    isFocused.value = false
  }
}

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<template>
  <div class="app-email-input">
    <label
      v-if="props.label"
      :for="props.id"
      class="app-email-input__label"
    >
      {{ props.label }}

      <span v-if="props.required" class="app-email-input__required">
        *
      </span>
    </label>

    <div
      class="app-email-input__control"
      :class="{
        'app-email-input__control--focused': isFocused,
        'app-email-input__control--error':
          props.error || (!isValid && innerValue),
        'app-email-input__control--valid': isValid && innerValue,
        'app-email-input__control--disabled': props.disabled,
      }"
    >
      <span class="app-email-input__icon"> @ </span>

      <input
        :id="props.id"
        type="email"
        inputmode="email"
        autocomplete="email"
        class="app-email-input__field"
        :value="innerValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <button
        v-if="innerValue && !props.disabled"
        type="button"
        class="app-email-input__clear"
        @click="clearValue"
      >
        ×
      </button>

      <span
        v-if="innerValue"
        class="app-email-input__status"
        :class="{
          'app-email-input__status--valid': isValid,
          'app-email-input__status--invalid': !isValid,
        }"
      >
        {{ isValid ? '✓' : '!' }}
      </span>

      <div
        v-if="shouldShowSuggestions"
        class="app-email-input__dropdown"
      >
        <button
          v-for="(domain, index) in domainSuggestions"
          :key="domain"
          type="button"
          class="app-email-input__option"
          :class="{
            'app-email-input__option--active':
              index === activeSuggestionIndex,
          }"
          @mousedown.prevent="applyDomain(domain)"
        >
          <span class="app-email-input__option-local">
            {{ localPart }}@
          </span>

          <span class="app-email-input__option-domain">
            {{ domain }}
          </span>
        </button>
      </div>
    </div>

    <button
      v-if="suggestedTypoDomain && innerValue"
      type="button"
      class="app-email-input__typo"
      @click="applyTypoSuggestion"
    >
      Did you mean {{ localPart }}@{{ suggestedTypoDomain }}?
    </button>

    <p
      v-if="props.error"
      class="app-email-input__message app-email-input__message--error"
    >
      {{ props.error }}
    </p>

    <p
      v-else-if="statusText"
      class="app-email-input__message"
      :class="{
        'app-email-input__message--valid': isValid && innerValue,
        'app-email-input__message--error': !isValid && innerValue,
      }"
    >
      {{ statusText }}
    </p>
  </div>
</template>

<style scoped>
.app-email-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.app-email-input__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color-1);
}

.app-email-input__required {
  color: #d66a6a;
}

.app-email-input__control {
  position: relative;

  display: flex;
  align-items: center;
  width: 100%;
  min-height: 44px;

  border: 1px solid var(--border-color-1);
  border-radius: 10px;

  background: var(--primary-color-2);
  color: white;

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.app-email-input__control:hover:not(
    .app-email-input__control--disabled
  ) {
  border-color: var(--primary-color-1);
}

.app-email-input__control--focused {
  border-color: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

.app-email-input__control--error {
  border-color: #d66a6a;
}

.app-email-input__control--valid {
  border-color: var(--primary-color-1);
}

.app-email-input__control--disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.app-email-input__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 100%;

  color: var(--primary-color-1);
  font-size: 18px;
  line-height: 1;

  pointer-events: none;
}

.app-email-input__field {
  width: 100%;
  min-height: 42px;
  height: 100%;

  padding: 0 8px 0 0;

  border: none;
  background: transparent;
  color: white;

  font-size: 16px;
  line-height: 1;
  font-family: inherit;

  outline: none;
}

.app-email-input__field::placeholder {
  color: color-mix(in srgb, var(--primary-color-1) 55%, transparent);
}

.app-email-input__field:disabled {
  cursor: not-allowed;
}

.app-email-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  margin-right: 4px;

  border: none;
  border-radius: 7px;

  background: transparent;
  color: color-mix(in srgb, var(--primary-color-1) 75%, transparent);

  font-size: 22px;
  line-height: 1;
  font-family: inherit;

  cursor: pointer;

  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.app-email-input__clear:hover {
  background: var(--primary-color-3);
  color: var(--primary-color-1);
}

.app-email-input__status {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 22px;
  height: 22px;

  margin-right: 10px;

  border-radius: 50%;

  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}

.app-email-input__status--valid {
  background: var(--primary-color-3);
  color: var(--primary-color-1);
}

.app-email-input__status--invalid {
  background: rgb(214 106 106 / 15%);
  color: #d66a6a;
}

.app-email-input__dropdown {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 6px;

  border: 1px solid var(--border-color-1);
  border-radius: 10px;

  background: var(--primary-color-5);
  box-shadow: 0 14px 35px rgb(0 0 0 / 35%);
}

.app-email-input__option {
  display: flex;
  align-items: center;

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

.app-email-input__option:hover,
.app-email-input__option--active {
  background: var(--primary-color-3);
  color: var(--primary-color-1);
}

.app-email-input__option-local {
  color: color-mix(in srgb, white 75%, transparent);
}

.app-email-input__option-domain {
  color: var(--primary-color-1);
}

.app-email-input__typo {
  width: fit-content;

  padding: 0;

  border: none;
  background: transparent;
  color: var(--primary-color-1);

  font-size: 13px;
  font-family: inherit;
  text-align: left;

  cursor: pointer;
}

.app-email-input__typo:hover {
  text-decoration: underline;
}

.app-email-input__message {
  margin: 0;
  font-size: 13px;
  color: color-mix(in srgb, var(--primary-color-1) 75%, transparent);
}

.app-email-input__message--valid {
  color: var(--primary-color-1);
}

.app-email-input__message--error {
  color: #d66a6a;
}
</style>
