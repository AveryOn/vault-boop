<script setup lang="ts">
import SelectInputUI, {
} from '~/client/components/shared/SelectInputUI.vue'
import { useKeyboard } from '~/client/composables/useKeyboard'
import ButtonBaseUI from '~/client/components/shared/ButtonBaseUI.vue'
import { useProfiles } from '~/client/composables/useProfiles'
import { useFormValidator } from '~/client/composables/useFormValidator'
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useToast } from '~/client/composables/useToast'
import { sleep } from '~/shared/async'
import { AppRoutes } from '~/shared/router'
import InputUI from '~/client/components/shared/InputUI.vue'
import { createCvExperienceDto, type CreateExperienceDto } from '~/shared/dto/cv/experience.dto'
import { CvExperienceApi } from '~/client/api/admin/cv/experience.api'
import CheckboxUI from '~/client/components/shared/CheckboxUI.vue'
import { CVEmploymentType, CVEmploymentTypeDisplay } from '~/shared/types'
import { CvEmploymentTypeApi } from '~/client/api/admin/cv/employment-type.api'
import type { EmploymentType } from '~/shared/dto/cv/employment-type.dto'

const toast = useToast()

useKeyboard({
  esc: () => { },
})

const { profiles } = useProfiles()

const formData = reactive<CreateExperienceDto>({
  company: '',
  description: '',
  employmentTypeId: '',
  endDate: '',
  location: '',
  position: '',
  profileId: '',
  startDate: '',
  isCurrent: false,
})

const {
  errors,
  undoError,
  validateFormOrThrow,
} = useFormValidator(formData)

const employmentTypes = ref<EmploymentType[]>([])
const isSubmitLoading = ref(false)
const isSubmitDisabled = computed(() => {
  return !formData.company
    && !formData.profileId
    && !formData.description
    && !formData.employmentTypeId
    && !formData.startDate
    && !formData.location
    && !formData.position
})

const EmploymentTypes = computed(() => {
  return employmentTypes.value.map((v) => {
    return {
      label: CVEmploymentTypeDisplay[v.code as keyof typeof CVEmploymentType],
      value: v.id,
    }
  })
})

async function submit() {
  try {
    isSubmitLoading.value = true
    const data = validateFormOrThrow(createCvExperienceDto, formData, () => { })

    const newRecord = await CvExperienceApi.create({
      company: data.data.company,
      location: data.data.location,
      description: data.data.description,
      employmentTypeId: data.data.employmentTypeId,
      endDate: data.data.endDate,
      isCurrent: data.data.isCurrent,
      position: data.data.position,
      profileId: data.data.profileId,
      startDate: data.data.startDate,
    })
    toast.success('Опыт успешно создан!', {
      duration: 3000,
      title: 'Опыт успешно создан!',
    })
    console.debug('CREATE NEW EXPERIENCE', { newRecord })
    isSubmitLoading.value = false
    await sleep('2.5s')

    window.location.href = AppRoutes.admin.CvExperience
  } catch (err) {
    toast.error('Произошла ошибка при создании опыта', {
      duration: 3000,
      title: 'Ошибка',
    })
    console.error(err)
  } finally {
    isSubmitLoading.value = false
  }
}

onBeforeMount(async () => {
  employmentTypes.value = await CvEmploymentTypeApi.getList()
})

</script>

<template>
  <section class="cv-admin__experience_new">
    <div class="flex flex-col gap-[24px] min-w-[360px] w-[800px]">
      <div class="w-full flex flex-col justify-center items-center gap-[24px] w-[360px]! mx-auto">
        <h1 class="text-[26px] mb-[24px]">Creation a new Experience</h1>

        <!-- PROFILE_ID -->
        <SelectInputUI v-model="formData.profileId" :options="profiles" :placeholder="'Select Profile'"
          :error="errors.profileId" :label="'Profile*'" />

        <!-- COMPANY -->
        <InputUI v-model="formData.company" class="w-[360px]!" type="text" :error="errors.company" label="Company*"
          placeholder="Company name..." @input="undoError('company')" />

        <!-- POSITION -->
        <InputUI v-model="formData.position!" class="w-[360px]!" type="text" :error="errors.position" label="Position*"
          placeholder="Position..." @input="undoError('position')" />

        <!-- LOCATION -->
        <InputUI v-model="formData.location!" class="w-[360px]!" type="text" :error="errors.location" label="Location*"
          placeholder="Location..." @input="undoError('location')" />

        <!-- DESCRIPTION -->
        <InputUI v-model="formData.description" class="w-[360px]!" type="text" :error="errors.description"
          label="Description*" placeholder="Description..." @input="undoError('description')" />

        <!-- START_DATE -->
        <InputUI v-model="formData.startDate" class="w-[360px]!" type="text" :error="errors.startDate"
          label="Start Date*" placeholder="e.g February 2026" @input="undoError('startDate')" />

        <!-- END_DATE -->
        <InputUI v-model="formData.endDate as string" class="w-[360px]!" type="text" :error="errors.endDate"
          label="End Date" placeholder="e.g February 2026" @input="undoError('endDate')" />

        <!-- EMPLOYMENT TYPE ID -->
        <SelectInputUI v-model="formData.employmentTypeId!" :options="EmploymentTypes"
          :placeholder="'Select Employment Type'" :label="'Employment Type*'" :error="errors.employmentTypeId"
          @input="undoError('employmentTypeId'); console.debug(EmploymentTypes)" />

        <CheckboxUI v-model="formData.isCurrent as boolean" label="Is Current" />

        <ButtonBaseUI :disabled="isSubmitDisabled" @click="submit">Save</ButtonBaseUI>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cv-admin__experience_new {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 60vh;
  border-radius: 10px;
  border: 1px dashed var(--border-color-1);
  padding: 24px 48px;
}
</style>
