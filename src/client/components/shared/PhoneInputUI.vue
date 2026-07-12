<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js'

type CountryOption = {
  code: CountryCode
  name: string
  callingCode: string
  flag: string
}

type PhonePayload = {
  country: CountryCode
  formatted: string
  e164: string | null
  national: string
  isValid: boolean
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
    defaultCountry?: CountryCode
    countryLocale?: string
    countries?: CountryCode[]
  }>(),
  {
    id: undefined,
    label: undefined,
    placeholder: 'Phone number',
    disabled: false,
    error: undefined,
    defaultCountry: 'GE' as CountryCode,
    countryLocale: 'en',
    countries: undefined,
  },
)

const emit = defineEmits<{
  input: [value: string]
  phoneChange: [value: PhonePayload]
}>()

const rootRef = ref<HTMLElement | null>(null)

const isOpen = ref(false)
const search = ref('')
const inputValue = ref(model.value)
const selectedCountry = ref<CountryCode>(props.defaultCountry)

const displayNames = computed(() => {
  return new Intl.DisplayNames([props.countryLocale], {
    type: 'region',
  })
})

const countryOptions = computed<CountryOption[]>(() => {
  const countries = props.countries?.length
    ? props.countries
    : getCountries()

  return countries
    .map((code) => ({
      code,
      name: getCountryName(code),
      callingCode: getCountryCallingCode(code),
      flag: getFlagEmoji(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const filteredCountryOptions = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) {
    return countryOptions.value
  }

  return countryOptions.value.filter((country) => {
    return (
      country.name.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query) ||
      country.callingCode.includes(query)
    )
  })
})

const selectedCountryOption = computed(() => {
  return countryOptions.value.find((country) => {
    return country.code === selectedCountry.value
  })
})

watch(
  model,
  (value) => {
    if (value === inputValue.value) {
      return
    }

    commitPhoneValue(value)
  },
  {
    immediate: true,
  },
)

function getCountryName(country: CountryCode) {
  return displayNames.value.of(country) ?? country
}

function getFlagEmoji(country: CountryCode) {
  return country
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    )
}

function normalizePhoneInput(value: string) {
  const trimmed = value.trim()
  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D/g, '')

  return hasPlus ? `+${digits}` : digits
}

function getNationalDigits(value: string, country: CountryCode) {
  const normalized = normalizePhoneInput(value)

  if (!normalized) {
    return ''
  }

  if (!normalized.startsWith('+')) {
    return normalized
  }

  const parsed = parsePhoneNumberFromString(normalized)

  if (parsed?.nationalNumber) {
    return parsed.nationalNumber
  }

  const callingCode = getCountryCallingCode(country)
  const prefix = `+${callingCode}`

  if (normalized.startsWith(prefix)) {
    return normalized.slice(prefix.length)
  }

  return normalized.replace(/^\+/, '')
}

function formatPhone(value: string, country: CountryCode) {
  const normalized = normalizePhoneInput(value)

  if (!normalized) {
    return {
      formatted: '',
      country,
    }
  }

  const source = normalized.startsWith('+')
    ? normalized
    : `+${getCountryCallingCode(country)}${normalized}`

  const formatter = new AsYouType(country)
  const formatted = formatter.input(source)

  const parsed = parsePhoneNumberFromString(source)

  return {
    formatted,
    country: parsed?.country ?? country,
  }
}

function buildPayload(formatted: string): PhonePayload {
  const normalized = normalizePhoneInput(formatted)
  const parsed = normalized
    ? parsePhoneNumberFromString(normalized)
    : undefined

  return {
    country: selectedCountry.value,
    formatted,
    e164: parsed?.isValid() ? parsed.number : null,
    national: parsed?.nationalNumber ?? '',
    isValid: parsed?.isValid() ?? false,
  }
}

function commitPhoneValue(
  value: string,
  country = selectedCountry.value,
) {
  const result = formatPhone(value, country)

  selectedCountry.value = result.country
  inputValue.value = result.formatted
  model.value = result.formatted

  emit('input', result.formatted)
  emit('phoneChange', buildPayload(result.formatted))
}

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement

  commitPhoneValue(target.value)
}

function toggleDropdown() {
  if (props.disabled) {
    return
  }

  isOpen.value = !isOpen.value
}

function selectCountry(country: CountryOption) {
  const nationalDigits = getNationalDigits(
    inputValue.value,
    selectedCountry.value,
  )

  selectedCountry.value = country.code
  isOpen.value = false
  search.value = ''

  commitPhoneValue(nationalDigits, country.code)
}

function handleClickOutside(event: MouseEvent) {
  if (!rootRef.value) {
    return
  }

  if (!rootRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="rootRef" class="app-phone-input">
    <label
      v-if="props.label"
      :for="props.id"
      class="app-phone-input__label"
    >
      {{ props.label }}
    </label>

    <div class="app-phone-input__control">
      <button
        type="button"
        class="app-phone-input__country"
        :disabled="props.disabled"
        @click="toggleDropdown"
      >
        <span class="app-phone-input__country-flag">
          {{ selectedCountryOption?.flag }}
        </span>

        <span class="app-phone-input__country-code">
          +{{ selectedCountryOption?.callingCode }}
        </span>

        <span class="app-phone-input__arrow"> ⌄ </span>
      </button>

      <input
        :id="props.id"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        class="app-phone-input__field"
        :class="{
          'app-phone-input__field--error': props.error,
        }"
        :value="inputValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        @input="handleInput"
      />

      <div v-if="isOpen" class="app-phone-input__dropdown">
        <input
          v-model="search"
          type="text"
          class="app-phone-input__search"
          placeholder="Search country"
        />

        <div class="app-phone-input__options">
          <button
            v-for="country in filteredCountryOptions"
            :key="country.code"
            type="button"
            class="app-phone-input__option"
            :class="{
              'app-phone-input__option--selected':
                country.code === selectedCountry,
            }"
            @click="selectCountry(country)"
          >
            <span class="app-phone-input__option-flag">
              {{ country.flag }}
            </span>

            <span class="app-phone-input__option-name">
              {{ country.name }}
            </span>

            <span class="app-phone-input__option-code">
              +{{ country.callingCode }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <p v-if="props.error" class="app-phone-input__error">
      {{ props.error }}
    </p>
  </div>
</template>

<style scoped>
.app-phone-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.app-phone-input__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-color-1);
}

.app-phone-input__control {
  position: relative;

  display: flex;
  width: 100%;
  min-height: 44px;
}

.app-phone-input__country {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  min-width: 118px;
  padding: 0 12px;

  border: 1px solid var(--border-color-1);
  border-right: none;
  border-radius: 10px 0 0 10px;

  background: var(--primary-color-2);
  color: white;

  font-size: 15px;
  font-family: inherit;

  cursor: pointer;
  outline: none;

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.app-phone-input__country:hover:not(:disabled) {
  border-color: var(--primary-color-1);
}

.app-phone-input__country:focus {
  border-color: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

.app-phone-input__country:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.app-phone-input__country-flag {
  font-size: 18px;
  line-height: 1;
}

.app-phone-input__country-code {
  color: var(--primary-color-1);
}

.app-phone-input__arrow {
  margin-left: auto;
  color: var(--primary-color-1);
  font-size: 16px;
  line-height: 1;
}

.app-phone-input__field {
  width: 100%;
  min-height: 44px;
  height: 100%;

  padding: 0 14px;

  border: 1px solid var(--border-color-1);
  border-radius: 0 10px 10px 0;

  background: var(--primary-color-2);
  color: white;

  font-size: 16px;
  line-height: 1;
  font-family: inherit;

  outline: none;

  transition:
    border-color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;
}

.app-phone-input__field::placeholder {
  color: color-mix(in srgb, var(--primary-color-1) 55%, transparent);
}

.app-phone-input__field:focus {
  border-color: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

.app-phone-input__field:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.app-phone-input__field--error {
  border-color: #d66a6a;
}

.app-phone-input__dropdown {
  position: absolute;
  z-index: 30;
  top: calc(100% + 6px);
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 8px;

  border: 1px solid var(--border-color-1);
  border-radius: 10px;

  background: var(--primary-color-3-100);
  box-shadow: 0 14px 35px rgb(0 0 0 / 35%);
}

.app-phone-input__search {
  width: 100%;
  min-height: 38px;

  padding: 0 12px;

  border: 1px solid var(--border-color-1);
  border-radius: 8px;

  background: var(--primary-color-2);
  color: white;

  font-size: 14px;
  font-family: inherit;

  outline: none;
}

.app-phone-input__search::placeholder {
  color: color-mix(in srgb, var(--primary-color-1) 55%, transparent);
}

.app-phone-input__search:focus {
  border-color: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

.app-phone-input__options {
  display: flex;
  flex-direction: column;
  gap: 4px;

  max-height: 240px;
  overflow-y: auto;
}

.app-phone-input__option {
  display: flex;
  align-items: center;
  gap: 10px;

  width: 100%;
  min-height: 38px;

  padding: 0 10px;

  border: none;
  border-radius: 7px;

  background: transparent;
  color: white;

  font-size: 14px;
  font-family: inherit;
  text-align: left;

  cursor: pointer;

  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.app-phone-input__option:hover {
  background: var(--primary-color-3);
  color: var(--primary-color-1);
}

.app-phone-input__option--selected {
  background: var(--primary-color-3);
  color: var(--primary-color-1);
}

.app-phone-input__option-flag {
  font-size: 17px;
  line-height: 1;
}

.app-phone-input__option-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.app-phone-input__option-code {
  margin-left: auto;
  color: var(--primary-color-1);
}

.app-phone-input__error {
  margin: 0;
  font-size: 13px;
  color: #d66a6a;
}
</style>
