<script setup lang="ts">
import { reactive, ref } from 'vue'
import { CvProfileApi } from '~/client/api/admin/cv/profile.api'
import ButtonBaseUI from '~/client/components/shared/ButtonBaseUI.vue'
import CheckboxUI from '~/client/components/shared/CheckboxUI.vue'
import EmailInputUI from '~/client/components/shared/EmailInputUI.vue'
import InputUI from '~/client/components/shared/InputUI.vue'
import PhoneInputUI from '~/client/components/shared/PhoneInputUI.vue'
import SelectInputUI from '~/client/components/shared/SelectInputUI.vue'
import TextareaUI from '~/client/components/shared/TextareaUI.vue'
import { useFormValidator } from '~/client/composables/useFormValidator'
import { useToast } from '~/client/composables/useToast'
import { sleep } from '~/shared/async'
import { createCvProfileDto } from '~/shared/dto/cv/profile.dto'
import { AppRoutes } from '~/shared/router'
import { ProfileLanguage } from '~/shared/types'

const formData = reactive({
  title: '',
  firstName: '',
  lastName: '',
  language: ProfileLanguage.en,
  location: '',
  summary: '',
  email: undefined,
  phone: undefined,
  isActive: false,
})
const isSubmitLoading = ref(false)
const isSubmitDisabled = ref(false)
const languageOptions = [
  {
    label: 'English',
    value: ProfileLanguage.en,
  },
  {
    label: 'Russian',
    value: ProfileLanguage.ru,
  },
  {
    label: 'French',
    value: ProfileLanguage.fr,
  },
]

const {
  errors,
  isSomeError,
  undoError,
  validateFormOrThrow,
} = useFormValidator(formData)

const toast = useToast()

async function submit() {
  try {
    isSubmitLoading.value = true
    const data = validateFormOrThrow(createCvProfileDto, formData)
    const newProfile = await CvProfileApi.create({
      firstName: data.data.firstName,
      isActive: data.data.isActive,
      language: data.data.language,
      lastName: data.data.lastName,
      summary: data.data.summary,
      title: data.data.title,
      email: data.data.email,
      location: data.data.location,
      phone: data.data.phone,
    })
    toast.success('Профиль успешно создан!', {
      duration: 3000,
      title: 'Профиль успешно создан!',
    })
    console.debug('CREATE NEW PROFILE', { newProfile })
    isSubmitLoading.value = false
    isSubmitDisabled.value = true
    await sleep('2.5s')
    window.location.href = AppRoutes.admin.CvProfile
  } catch (err) {
    toast.error('Произошла ошибка при создании профиля', {
      duration: 3000,
      title: 'Ошибка',
    })
    console.error(err)
  } finally {
    isSubmitLoading.value = false
  }
}
</script>

<template>
  <section class="cv-admin__profile-new py-[24px]">
    <h2 class="text-[24px]">CREATE NEW PROFILE</h2>
    <form class="profile-new-form relative" @submit.prevent>
      <div class="flex flex-col w-[50%] gap-[18px]">
        <!-- TITLE -->
        <InputUI v-model="formData.title" type="text" :error="errors.title" label="Profile Title"
          placeholder="The coolest profile!" @input="undoError('title')" />
        <!-- FIRST NAME -->
        <InputUI v-model="formData.firstName" type="text" :error="errors.firstName" label="First Name"
          placeholder="Alex" @input="undoError('firstName')" />
        <!-- LAST NAME -->
        <InputUI v-model="formData.lastName" type="text" :error="errors.lastName" label="Last Name" placeholder="Mercer"
          @input="undoError('lastName')" />
        <!-- LANGUAGE -->
        <SelectInputUI v-model="formData.language" :error="errors.language" :options="languageOptions"
          label="Profile Language" @input="undoError('language')" />
        <!-- LOCATION -->
        <InputUI id="location" v-model="formData.location" :error="errors.location" label="Location"
          placeholder="Tbilisi, Georgia" @input="undoError('location')" />
      </div>

      <div class="px-[4px] bg-[--primary-color-4] top-0 bottom-0"></div>

      <div class="flex flex-col w-[50%] gap-[18px]">
        <!-- IS ACTIVE PROFILE -->
        <CheckboxUI id="profile-is-active" v-model="formData.isActive" :error="errors.isActive" label="Active profile"
          @input="undoError('isActive')" />
        <!-- PHONE NUMBER -->
        <PhoneInputUI id="profile-phone" v-model="formData.phone" label="Phone Number" placeholder="+33 6 12 34 56 78"
          default-country="FR" :error="errors.phone" @phone-change="(payload) => console.log(payload)"
          @input="undoError('phone')" />
        <!-- EMAIL -->
        <EmailInputUI id="profile-email" v-model="formData.email" label="Email" placeholder="your@email.com"
          hint="Used as contact email in CV profile." :error="errors.email" :required="false"
          @email-change="(payload) => console.log(payload)" @input="undoError('email')" />
        <!-- SUMMARY -->
        <TextareaUI id="summary" v-model="formData.summary" :error="errors.summary"
          placeholder="Write profile summary..." label="Summary"
          description="Short professional summary that will be shown in your CV profile."
          @input="undoError('summary')" />
      </div>
    </form>
    <ButtonBaseUI class="w-[30%]" type="submit" variant="primary" :disabled="isSomeError || isSubmitDisabled"
      :loading="isSubmitLoading" @click="submit">Save profile</ButtonBaseUI>
  </section>
</template>

<style scoped>
.cv-admin__profile-new {
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 60vh;
  flex-direction: column;
  border-radius: 10px;
  border: 1px dashed var(--border-color-1);
}

.profile-new-form {
  display: flex;
  justify-content: center;
  gap: 32px;
  background-color: var(--primary-color-6);
  width: 800px;
  padding: 12px 20px;
}
</style>
