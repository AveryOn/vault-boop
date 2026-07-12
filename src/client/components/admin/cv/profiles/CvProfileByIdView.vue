<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  mdiArrowLeft,
  mdiClose,
  mdiContentSaveOutline,
  mdiPencilOutline,
  mdiPlus,
  mdiRadioactiveCircleOutline,
} from '@mdi/js'

import Icon from '~/client/components/common/Icon.vue'
import {
  updateCvProfileDto,
  type Profile,
} from '~/shared/dto/cv/profile.dto'
import { useToast } from '~/client/composables/useToast'
import z from 'zod'
import { CvProfileApi } from '~/client/api/admin/cv/profile.api'
import ProfileActiveBadge from '~/client/components/shared/ProfileActiveBadge.vue'

type EditableProfileField =
  | 'title'
  | 'summary'
  | 'language'
  | 'firstName'
  | 'lastName'
  | 'location'
  | 'email'
  | 'phone'
  | 'isActive'

type EditableProfileDraft = Pick<Profile, EditableProfileField>

type EditableFieldKind =
  | 'text'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'checkbox'

interface EditableFieldConfig {
  key: EditableProfileField
  label: string
  kind: EditableFieldKind
  placeholder?: string
  hint?: string
}

interface FieldGroup {
  title: string
  description: string
  fields: EditableFieldConfig[]
}

const props = withDefaults(
  defineProps<{
    uuid: string
    profile: Profile
    backHref?: string
    newHref?: string
    languageOptions?: Profile['language'][]
  }>(),
  {
    backHref: '/admin/cv/profile',
    newHref: '/admin/cv/profile/new',
    languageOptions: () => [],
  },
)

const toast = useToast()

const isSubmitLoading = ref(false)
const draft = reactive<EditableProfileDraft>(createDraft(props.profile))

const editing = reactive<Record<EditableProfileField, boolean>>({
  title: false,
  summary: false,
  language: false,
  firstName: false,
  lastName: false,
  location: false,
  email: false,
  phone: false,
  isActive: false,
})

const fieldGroups: FieldGroup[] = [
  {
    title: 'Identity',
    description: 'Main profile information used as the CV header.',
    fields: [
      {
        key: 'firstName',
        label: 'First name',
        kind: 'text',
        placeholder: 'Vladislav',
      },
      {
        key: 'lastName',
        label: 'Last name',
        kind: 'text',
        placeholder: 'Onion',
      },
      {
        key: 'title',
        label: 'Title',
        kind: 'text',
        placeholder: 'Backend Engineer',
      },
      {
        key: 'language',
        label: 'Language',
        kind: 'select',
      },
    ],
  },
  {
    title: 'Contacts',
    description: 'Public contact data displayed in the CV.',
    fields: [
      {
        key: 'location',
        label: 'Location',
        kind: 'text',
        placeholder: 'Tbilisi, Georgia',
      },
      {
        key: 'email',
        label: 'Email',
        kind: 'email',
        placeholder: 'name@example.com',
      },
      {
        key: 'phone',
        label: 'Phone',
        kind: 'tel',
        placeholder: '+33612345678',
      },
    ],
  },
  {
    title: 'Summary',
    description: 'Short professional summary for this profile.',
    fields: [
      {
        key: 'summary',
        label: 'Summary',
        kind: 'textarea',
        placeholder: 'Short professional summary...',
      },
    ],
  },
  {
    title: 'State',
    description: 'Controls whether this profile is active.',
    fields: [
      {
        key: 'isActive',
        label: 'Active profile',
        kind: 'checkbox',
        hint: 'Only one profile should normally be active.',
      },
    ],
  },
]

const fullName = computed(() => {
  const value = [draft.firstName, draft.lastName]
    .filter(Boolean)
    .join(' ')

  return value || 'Unnamed profile'
})

const initials = computed(() => {
  const first = draft.firstName?.[0] ?? ''
  const last = draft.lastName?.[0] ?? ''

  return `${first}${last}`.toUpperCase() || 'CV'
})

const languageOptions = computed(() => {
  return Array.from(new Set([draft.language, ...props.languageOptions]))
})

watch(
  () => props.profile,
  (profile) => {
    Object.assign(draft, createDraft(profile))
    closeAllEditors()
  },
  {
    deep: true,
  },
)

function createDraft(profile: Profile): EditableProfileDraft {
  return {
    title: profile.title,
    summary: profile.summary,
    language: profile.language,
    firstName: profile.firstName,
    lastName: profile.lastName,
    location: profile.location,
    email: profile.email,
    phone: profile.phone,
    isActive: profile.isActive,
  }
}

function getInputValue(field: EditableProfileField) {
  const value = draft[field]

  if (typeof value === 'boolean') {
    return String(value)
  }

  return value ?? ''
}

function setInputValue(field: EditableProfileField, value: string) {
  if (field === 'location' || field === 'email' || field === 'phone') {
    draft[field] = value || null
    return
  }

  if (field === 'language') {
    draft[field] = value as Profile['language']
    return
  }

  if (field === 'isActive') {
    draft[field] = value === 'true'
    return
  }

  draft[field] = value
}

function setCheckboxValue(event: Event) {
  const target = event.target as HTMLInputElement

  draft.isActive = target.checked
}

function getDisplayValue(field: EditableProfileField) {
  const value = draft[field]

  if (typeof value === 'boolean') {
    return value ? 'Active' : 'Inactive'
  }

  return value || '—'
}

function startEdit(field: EditableProfileField) {
  editing[field] = true
}

function cancelEdit(field: EditableProfileField) {
  const freshDraft = createDraft(props.profile)

  draft[field] = freshDraft[field] as never
  editing[field] = false
}

async function saveField(field: EditableProfileField) {
  try {
    isSubmitLoading.value = true
    const data = updateCvProfileDto.safeParse(draft)
    if (!data.success) {
      const details = z.treeifyError(data.error)
      console.debug(details)
      throw new Error('INVALID DATA')
    }
    const updatedProfile = await CvProfileApi.update(props.uuid, {
      [field]: draft[field],
    })
    toast.success('Профиль обновлен', {
      duration: 3000,
      title: 'Success!',
    })
    console.debug('UPDATE PROFILE', { updatedProfile })
    isSubmitLoading.value = false
    editing[field] = false

    // await sleep('2.5s')
  } catch (err) {
    toast.error('Произошла ошибка при редактировании профиля', {
      duration: 3000,
      title: 'Ошибка',
    })
    console.error(err)
  } finally {
    isSubmitLoading.value = false
  }
}

function saveProfile() {
  closeAllEditors()

  console.debug('СОХРАНЕНИЕ НА СЕРВЕРЕ. ВСЁ')
  // emit('saveProfile', {
  //   uuid: props.uuid,
  //   profile: { ...draft },
  // })
}

function closeAllEditors() {
  Object.keys(editing).forEach((key) => {
    editing[key as EditableProfileField] = false
  })
}

function formatDate(value: string | null) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>

<template>
  <section class="cv-profile-by-id">
    <Transition name="loading-overlay-fade">
      <div v-if="isSubmitLoading" class="loading-overlay">
        <Icon
          class="loading-overlay__icon text-[--primary-color-4]"
          :icon="mdiRadioactiveCircleOutline"
          :size="180"
        />
      </div>
    </Transition>

    <header class="cv-profile-by-id__header">
      <div class="cv-profile-by-id__header-main">
        <a :href="backHref" class="cv-profile-by-id__back-link">
          <Icon :icon="mdiArrowLeft" :size="18" />
          Back
        </a>

        <div>
          <p class="cv-profile-by-id__eyebrow">CV Profile</p>

          <h1 class="cv-profile-by-id__title">
            {{ fullName }}
          </h1>

          <p class="cv-profile-by-id__subtitle">
            {{ uuid }}
          </p>
        </div>
      </div>

      <div class="cv-profile-by-id__actions">
        <ProfileActiveBadge :is-active="profile.isActive" />

        <a :href="newHref" class="cv-profile-by-id__icon-button">
          <Icon :icon="mdiPlus" :size="22" />
        </a>

        <button
          type="button"
          class="cv-profile-by-id__save-button"
          @click="saveProfile"
        >
          <Icon :icon="mdiContentSaveOutline" :size="18" />
          Save all
        </button>
      </div>
    </header>

    <div class="cv-profile-by-id__hero">
      <div class="cv-profile-by-id__avatar">
        {{ initials }}
      </div>

      <div class="cv-profile-by-id__hero-content">
        <h2 class="cv-profile-by-id__hero-name">
          {{ fullName }}
        </h2>

        <p class="cv-profile-by-id__hero-title">
          {{ draft.title || 'No title' }}
        </p>

        <p class="cv-profile-by-id__hero-summary">
          {{ draft.summary || 'No summary provided.' }}
        </p>
      </div>
    </div>

    <div class="cv-profile-by-id__content">
      <section
        v-for="group in fieldGroups"
        :key="group.title"
        class="cv-profile-card"
      >
        <header class="cv-profile-card__header">
          <div>
            <h2 class="cv-profile-card__title">
              {{ group.title }}
            </h2>

            <p class="cv-profile-card__description">
              {{ group.description }}
            </p>
          </div>
        </header>

        <div class="cv-profile-fields">
          <article
            v-for="field in group.fields"
            :key="field.key"
            class="cv-profile-field"
            :class="{
              'cv-profile-field--wide': field.kind === 'textarea',
            }"
          >
            <div class="cv-profile-field__top">
              <div>
                <h3 class="cv-profile-field__label">
                  {{ field.label }}
                </h3>

                <p v-if="field.hint" class="cv-profile-field__hint">
                  {{ field.hint }}
                </p>
              </div>

              <div class="cv-profile-field__controls">
                <template v-if="editing[field.key]">
                  <button
                    type="button"
                    class="cv-profile-field__control cv-profile-field__control--save"
                    @click="saveField(field.key)"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    class="cv-profile-field__icon-control"
                    aria-label="Cancel editing"
                    @click="cancelEdit(field.key)"
                  >
                    <Icon :icon="mdiClose" :size="18" />
                  </button>
                </template>

                <button
                  v-else
                  type="button"
                  class="cv-profile-field__icon-control"
                  aria-label="Edit field"
                  @click="startEdit(field.key)"
                >
                  <Icon :icon="mdiPencilOutline" :size="18" />
                </button>
              </div>
            </div>

            <div
              v-if="editing[field.key]"
              class="cv-profile-field__editor"
            >
              <textarea
                v-if="field.kind === 'textarea'"
                class="cv-profile-field__textarea"
                rows="6"
                :placeholder="field.placeholder"
                :value="getInputValue(field.key)"
                @input="
                  setInputValue(
                    field.key,
                    ($event.target as HTMLTextAreaElement).value,
                  )
                "
              />

              <select
                v-else-if="field.kind === 'select'"
                class="cv-profile-field__input"
                :value="getInputValue(field.key)"
                @change="
                  setInputValue(
                    field.key,
                    ($event.target as HTMLSelectElement).value,
                  )
                "
              >
                <option
                  v-for="option in languageOptions"
                  :key="String(option)"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>

              <label
                v-else-if="field.kind === 'checkbox'"
                class="cv-profile-field__checkbox"
              >
                <input
                  type="checkbox"
                  :checked="draft.isActive"
                  @change="setCheckboxValue"
                />

                <span> This profile is active </span>
              </label>

              <input
                v-else
                class="cv-profile-field__input"
                :type="field.kind"
                :placeholder="field.placeholder"
                :value="getInputValue(field.key)"
                @input="
                  setInputValue(
                    field.key,
                    ($event.target as HTMLInputElement).value,
                  )
                "
              />
            </div>

            <div v-else class="cv-profile-field__value">
              <span
                class="cv-profile-field__text"
                :class="{
                  'cv-profile-field__text--empty':
                    getDisplayValue(field.key) === '—',
                }"
              >
                {{ getDisplayValue(field.key) }}
              </span>
            </div>
          </article>
        </div>
      </section>

      <section class="cv-profile-card">
        <header class="cv-profile-card__header">
          <div>
            <h2 class="cv-profile-card__title">System</h2>

            <p class="cv-profile-card__description">
              Technical profile metadata from database.
            </p>
          </div>
        </header>

        <div class="cv-profile-meta">
          <div class="cv-profile-meta__item">
            <span class="cv-profile-meta__label">ID</span>
            <span class="cv-profile-meta__value">{{ profile.id }}</span>
          </div>

          <div class="cv-profile-meta__item">
            <span class="cv-profile-meta__label">Created at</span>
            <span class="cv-profile-meta__value">{{
              formatDate(profile.createdAt)
            }}</span>
          </div>

          <div class="cv-profile-meta__item">
            <span class="cv-profile-meta__label">Updated at</span>
            <span class="cv-profile-meta__value">{{
              formatDate(profile.updatedAt)
            }}</span>
          </div>

          <div class="cv-profile-meta__item">
            <span class="cv-profile-meta__label">Deleted at</span>
            <span class="cv-profile-meta__value">{{
              formatDate(profile.deletedAt)
            }}</span>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.loading-overlay {
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin: 0 auto;

  border-radius: 10px;
  background-color: var(--primary-color-6);
}

.loading-overlay__icon {
  animation: loading-rotate 1s linear infinite;
}

.loading-overlay-fade-enter-active,
.loading-overlay-fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.loading-overlay-fade-enter-from,
.loading-overlay-fade-leave-to {
  opacity: 0;
  transform: translateY(-80px) scale(0.98);
}

.loading-overlay-fade-enter-to,
.loading-overlay-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@keyframes loading-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.cv-profile-by-id {
  position: relative;
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  overflow: hidden;
  border: 1px dashed var(--border-color-1);
  border-radius: 10px;

  background: var(--background-color-1, transparent);
}

.cv-profile-by-id__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;

  padding: 18px 24px;

  border-bottom: 1px dotted var(--border-color-1);
}

.cv-profile-by-id__header-main {
  display: flex;
  align-items: flex-start;
  gap: 16px;

  min-width: 0;
}

.cv-profile-by-id__back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  min-height: 34px;
  padding: 0 10px;

  border: 1px solid var(--border-color-1);
  border-radius: 8px;

  color: var(--text-color-3);
  font-size: 13px;
  text-decoration: none;

  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.cv-profile-by-id__back-link:hover {
  border-color: var(--primary-color-4);
  background-color: var(--primary-color-3);
  color: var(--primary-color-4);
}

.cv-profile-by-id__eyebrow {
  margin: 0 0 4px;

  color: var(--text-color-3);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.cv-profile-by-id__title {
  margin: 0;

  color: var(--text-color-1);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
}

.cv-profile-by-id__subtitle {
  margin: 6px 0 0;

  color: var(--text-color-3);
  font-size: 13px;
  word-break: break-all;
}

.cv-profile-by-id__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  flex-shrink: 0;
}

.cv-profile-by-id__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  min-height: 34px;
  padding: 0 10px;

  border-radius: 999px;

  font-size: 13px;
  font-weight: 700;
}

.cv-profile-by-id__status--active {
  background-color: rgb(22 163 74 / 12%);
  color: #16a34a;
}

.cv-profile-by-id__status--inactive {
  background-color: rgb(107 114 128 / 12%);
  color: var(--text-color-3);
}

.cv-profile-by-id__icon-button,
.cv-profile-by-id__save-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-height: 34px;

  border: 0;
  border-radius: 8px;

  background-color: var(--primary-color-3);
  color: var(--primary-color-4);

  font: inherit;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.cv-profile-by-id__icon-button {
  width: 34px;
}

.cv-profile-by-id__save-button {
  padding: 0 12px;
}

.cv-profile-by-id__icon-button:hover,
.cv-profile-by-id__save-button:hover {
  background-color: var(--primary-color-3-hover);
}

.cv-profile-by-id__icon-button:active,
.cv-profile-by-id__save-button:active {
  transform: translateY(1px);
}

.cv-profile-by-id__hero {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;

  padding: 24px;

  border-bottom: 1px dotted var(--border-color-1);
}

.cv-profile-by-id__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 72px;
  height: 72px;

  border: 1px solid var(--border-color-1);
  border-radius: 20px;

  background-color: var(--primary-color-3);
  color: var(--primary-color-4);

  font-size: 22px;
  font-weight: 800;
}

.cv-profile-by-id__hero-content {
  min-width: 0;
}

.cv-profile-by-id__hero-name {
  margin: 0;

  color: var(--text-color-1);
  font-size: 22px;
  font-weight: 800;
}

.cv-profile-by-id__hero-title {
  margin: 6px 0 0;

  color: var(--text-color-2);
  font-size: 15px;
  font-weight: 700;
}

.cv-profile-by-id__hero-summary {
  max-width: 820px;
  margin: 12px 0 0;

  color: var(--text-color-3);
  font-size: 14px;
  line-height: 1.6;
}

.cv-profile-by-id__content {
  display: flex;
  flex-direction: column;
  gap: 14px;

  padding: 18px 24px 24px;
}

.cv-profile-card {
  overflow: hidden;

  border: 1px solid var(--border-color-1);
  border-radius: 10px;

  background-color: var(--primary-color-2, transparent);
}

.cv-profile-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  padding: 14px 16px;

  border-bottom: 1px solid var(--border-color-1);
}

.cv-profile-card__title {
  margin: 0;

  color: var(--text-color-1);
  font-size: 15px;
  font-weight: 800;
}

.cv-profile-card__description {
  margin: 4px 0 0;

  color: var(--text-color-3);
  font-size: 13px;
  line-height: 1.4;
}

.cv-profile-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  padding: 12px;
}

.cv-profile-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 10px;

  padding: 12px;

  border: 1px solid var(--border-color-1);
  border-radius: 8px;

  background-color: var(--primary-color-3);

  transition: background-color 0.2s ease;
}

.cv-profile-field:hover {
  background-color: var(--primary-color-3-hover);
}

.cv-profile-field--wide {
  grid-column: 1 / -1;
}

.cv-profile-field__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.cv-profile-field__label {
  margin: 0;

  color: var(--text-color-1);
  font-size: 13px;
  font-weight: 800;
}

.cv-profile-field__hint {
  margin: 4px 0 0;

  color: var(--text-color-3);
  font-size: 12px;
  line-height: 1.35;
}

.cv-profile-field__controls {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  flex-shrink: 0;
}

.cv-profile-field__control,
.cv-profile-field__icon-control {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 28px;

  border: 0;
  border-radius: 7px;

  font: inherit;
  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.cv-profile-field__control {
  padding: 0 10px;
}

.cv-profile-field__control--save {
  background-color: var(--primary-color-4);
  color: var(--primary-color-6);
}

.cv-profile-field__icon-control {
  width: 28px;

  background-color: transparent;
  color: var(--text-color-3);
}

.cv-profile-field__icon-control:hover {
  background-color: var(--primary-color-3);
  color: var(--primary-color-4);
}

.cv-profile-field__value {
  min-width: 0;
}

.cv-profile-field__text {
  display: block;

  color: var(--text-color-2);
  font-size: 14px;
  line-height: 1.5;

  white-space: pre-wrap;
  word-break: break-word;
}

.cv-profile-field__text--empty {
  color: var(--text-color-3);
  font-style: italic;
}

.cv-profile-field__editor {
  min-width: 0;
}

.cv-profile-field__input,
.cv-profile-field__textarea {
  width: 100%;

  border: 1px solid var(--border-color-1);
  border-radius: 8px;

  background-color: var(--primary-color-6);
  color: var(--text-color-1);

  font: inherit;
  font-size: 14px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.cv-profile-field__input {
  min-height: 38px;
  padding: 0 10px;
}

.cv-profile-field__textarea {
  resize: vertical;

  min-height: 120px;
  padding: 10px;
  line-height: 1.5;
}

.cv-profile-field__input:focus,
.cv-profile-field__textarea:focus {
  border-color: var(--primary-color-4);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--primary-color-4) 18%, transparent);
}

.cv-profile-field__checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: var(--text-color-2);
  font-size: 14px;
  font-weight: 600;
}

.cv-profile-field__checkbox input {
  width: 16px;
  height: 16px;

  accent-color: var(--primary-color-4);
}

.cv-profile-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  padding: 12px;
}

.cv-profile-meta__item {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;

  padding: 12px;

  border: 1px solid var(--border-color-1);
  border-radius: 8px;

  background-color: var(--primary-color-3);
}

.cv-profile-meta__label {
  color: var(--text-color-3);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.cv-profile-meta__value {
  overflow: hidden;

  color: var(--text-color-2);
  font-size: 13px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 860px) {
  .cv-profile-by-id__header {
    flex-direction: column;
  }

  .cv-profile-by-id__actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .cv-profile-fields,
  .cv-profile-meta {
    grid-template-columns: 1fr;
  }

  .cv-profile-by-id__hero {
    grid-template-columns: 1fr;
  }
}
</style>
