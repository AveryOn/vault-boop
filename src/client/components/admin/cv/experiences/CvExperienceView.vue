<script setup lang="ts">
import { useCvExperienceEditor } from '~/client/composables/useCvExperienceEditor'
import SelectInputUI from '~/client/components/shared/SelectInputUI.vue'
import {
  mdiChevronDownBoxOutline,
  mdiChevronUpBoxOutline,
  mdiHandOkay,
  mdiPen,
  mdiUndo,
} from '@mdi/js'
import Icon from '~/client/components/common/Icon.vue'
import ButtonBaseUI from '~/client/components/shared/ButtonBaseUI.vue'
import { computed, onMounted, ref } from 'vue'
import type { EmploymentType } from '~/shared/dto/cv/employment-type.dto'
import {
  CVEmploymentType,
  CVEmploymentTypeDisplay,
} from '~/shared/types'
import CheckboxUI from '~/client/components/shared/CheckboxUI.vue'
import InputUI from '~/client/components/shared/InputUI.vue'
import { CvEmploymentTypeApi } from '~/client/api/admin/cv/employment-type.api'

const {
  profiles,
  selectedProfileId,
  isSaveReorderLoading,
  entitiesByProfileId: experiencesByProfileId,
  selectedEntity: selectedExperience,

  editFormData: editExperienceFormData,

  entitiesAreReordered: experienceAreReordered,
  someChange,

  selectEntity: selectExperience,
  moveEntity: moveExperience,
  // loadEntities: uploadLinks,

  setFieldFocus,

  confirmUpdateField,
  undoChanges,
  submitFormChanges,
  resetFormChanges,
  saveNewOrder,
  resetChangesOrder,
  goToCreatePage,
} = useCvExperienceEditor()

const employmentTypes = ref<EmploymentType[]>([])

const EmploymentTypes = computed(() => {
  return employmentTypes.value.map((v) => {
    return {
      label:
        CVEmploymentTypeDisplay[v.code as keyof typeof CVEmploymentType],
      value: v.id,
    }
  })
})

const employmentTypeLabel = computed(() => {
  const val = editExperienceFormData.value['employmentTypeId']?.oldValue
  return employmentTypes.value.find((v) => v.id === val)?.label
})

onMounted(async () => {
  console.debug(editExperienceFormData)
  employmentTypes.value = await CvEmploymentTypeApi.getList()
})
</script>

<template>
  <section class="cv-admin__experience">
    <div class="flex flex-col gap-[24px] min-w-[360px] w-[800px]">
      <SelectInputUI
        v-model="selectedProfileId"
        :options="profiles"
        :placeholder="'Select Profile'"
        @input="() => {}"
      />

      <!-- SEPARATOR -->
      <div class="w-full h-[4px] bg-[--primary-color-5]"></div>

      <div
        class="relative flex items-start justify-center h-[100%] gap-[24px]"
      >
        <div
          v-if="selectedExperience && experiencesByProfileId.length > 1"
          class="absolute left-[-36px] top-0 bottom-0 flex flex-col justify-between"
        >
          <Icon
            class="move-experience-btn"
            :size="28"
            :icon="mdiChevronUpBoxOutline"
            @click="() => moveExperience('up')"
          >
          </Icon>
          <Icon
            class="move-experience-btn"
            :size="28"
            :icon="mdiChevronDownBoxOutline"
            @click="moveExperience('down')"
          >
          </Icon>
        </div>

        <TransitionGroup
          tag="ul"
          name="experience-list"
          class="flex flex-col gap-[10px] w-[50%]"
        >
          <li
            v-for="experience in experiencesByProfileId"
            :key="experience.id"
            class="experience-item"
            :class="{
              'bg-[--primary-color-3-100]':
                experience.id === selectedExperience?.id,
            }"
            @click="() => selectExperience(experience)"
          >
            <span>{{ experience }}</span>

            <div class="experience-item__actions">
              <Icon :icon="mdiPen" :size="16" />
            </div>
          </li>
        </TransitionGroup>

        <!-- SEPARATOR -->
        <Transition name="separator">
          <div
            v-if="selectedExperience"
            class="experience-separator"
          ></div>
        </Transition>

        <Transition name="experience-editor">
          <div
            v-if="selectedExperience"
            class="w-[50%] experience-edit-overlay"
          >
            <form class="experience-edit-form" @submit.prevent>
              <!-- COMPANY FIELD -->
              <div class="experience-edit-item">
                <div class="flex items-center justify-between">
                  <p class="experience-edit-item__key">Company:</p>

                  <InputUI
                    v-if="editExperienceFormData['company']?.focused"
                    v-model="
                      editExperienceFormData['company']!
                        .newValue! as string
                    "
                    size="xsmall"
                    class="w-[50%]!"
                    placeholder="Label"
                  >
                  </InputUI>
                  <p
                    v-else
                    class="experience-edit-item__value"
                    @click="() => setFieldFocus('company', true)"
                  >
                    {{ editExperienceFormData.company?.oldValue }}
                  </p>

                  <div class="experience-edit-item__actions">
                    <Icon
                      class="action-btn"
                      :icon="mdiUndo"
                      :size="26"
                      @click="() => undoChanges('company')"
                    />
                    <span
                      v-if="editExperienceFormData!['company']?.loading"
                      class="base-button__loader"
                    />
                    <Icon
                      v-else
                      class="action-btn"
                      :icon="mdiHandOkay"
                      :size="26"
                      @click="() => confirmUpdateField('company')"
                    />
                  </div>
                </div>
              </div>

              <!-- EMPLOYMENT TYPE ID FIELD -->
              <div class="experience-edit-item">
                <div class="flex items-center justify-between">
                  <p class="experience-edit-item__key">
                    Employment Type:
                  </p>

                  <SelectInputUI
                    v-if="
                      editExperienceFormData['employmentTypeId']?.focused
                    "
                    v-model="
                      editExperienceFormData['employmentTypeId']
                        .newValue!
                    "
                    class="w-[50%]!"
                    :options="EmploymentTypes"
                    size="xsmall"
                  >
                  </SelectInputUI>
                  <p
                    v-else
                    class="experience-edit-item__value"
                    @click="
                      () => setFieldFocus('employmentTypeId', true)
                    "
                  >
                    {{ employmentTypeLabel }}
                  </p>

                  <div class="experience-edit-item__actions">
                    <Icon
                      class="action-btn"
                      :icon="mdiUndo"
                      :size="26"
                      @click="() => undoChanges('employmentTypeId')"
                    />
                    <span
                      v-if="
                        editExperienceFormData!['employmentTypeId']
                          ?.loading
                      "
                      class="base-button__loader"
                    />
                    <Icon
                      v-else
                      class="action-btn"
                      :icon="mdiHandOkay"
                      :size="26"
                      @click="
                        () => confirmUpdateField('employmentTypeId')
                      "
                    />
                  </div>
                </div>
              </div>

              <!-- IS CURRENT FIELD -->
              <div class="experience-edit-item">
                <div class="flex items-center justify-between">
                  <p class="experience-edit-item__key">Is Current:</p>

                  <CheckboxUI
                    v-model="
                      editExperienceFormData['isCurrent']!
                        .newValue! as boolean
                    "
                  />

                  <div class="experience-edit-item__actions">
                    <Icon
                      class="action-btn"
                      :icon="mdiUndo"
                      :size="26"
                      @click="() => undoChanges('isCurrent')"
                    />
                    <span
                      v-if="
                        editExperienceFormData!['isCurrent']?.loading
                      "
                      class="base-button__loader"
                    />
                    <Icon
                      v-else
                      class="action-btn"
                      :icon="mdiHandOkay"
                      :size="26"
                      @click="() => confirmUpdateField('isCurrent')"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Transition>
      </div>

      <TransitionGroup
        tag="div"
        name="experience-actions"
        class="w-full flex justify-center gap-[14px]"
      >
        <ButtonBaseUI
          v-if="experienceAreReordered"
          key="save-order"
          :loading="isSaveReorderLoading"
          @click="saveNewOrder"
        >
          Save New Order
        </ButtonBaseUI>

        <ButtonBaseUI
          v-if="experienceAreReordered"
          key="reset-order"
          :variant="'secondary'"
          @click="resetChangesOrder"
        >
          Reset Order
        </ButtonBaseUI>

        <ButtonBaseUI key="create-new" @click="goToCreatePage">
          * Create New *
        </ButtonBaseUI>

        <ButtonBaseUI
          v-if="someChange"
          key="commit-changes"
          @click="submitFormChanges"
        >
          Commit Changes
        </ButtonBaseUI>

        <ButtonBaseUI
          v-if="someChange"
          key="reset-changes"
          :variant="'secondary'"
          @click="resetFormChanges"
        >
          Reset Changes
        </ButtonBaseUI>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
.cv-admin__experience {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 60vh;
  border-radius: 10px;
  border: 1px dashed var(--border-color-1);
  padding: 24px 48px;
}

.move-experience-btn {
  color: var(--primary-color-4);
  transition: all ease 0.2s;
  cursor: pointer;
}

.move-experience-btn:hover {
  color: var(--primary-color-1);
  transition: all ease 0.2s;
}

.experience-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid var(--border-color-1);
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.experience-item:hover {
  background-color: var(--primary-color-3);
  transition: all 0.3s ease;
}

.experience-edit-overlay {
  padding: 10px;
}

.experience-edit-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.experience-edit-item {
  border-right: 1px solid var(--border-color-1);
  border-left: 1px solid var(--border-color-1);
  padding: 4px 8px;
  background-color: var(--primary-color-6);
}

.experience-edit-item__value {
  width: 50%;
  margin-left: auto;
  margin-right: 16px;
  overflow: hidden;

  padding: 3px 8px;
  border-radius: 4px;

  background-color: var(--primary-color-3);
  cursor: pointer;

  white-space: nowrap;
  text-overflow: ellipsis;

  transition: all 0.3s ease;
}

.experience-edit-item__value:hover {
  transition: all 0.3s ease;
  background-color: var(--primary-color-3-100);
}

.experience-edit-item__actions {
  display: flex;
  align-items: center;
  margin-left: 4px;
  /* border-left: 2px solid var(--border-color-1); */
  gap: 2px;
}

.action-btn {
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
  background-color: var(--primary-color-3);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transition: all 0.3s ease;
  background-color: var(--primary-color-3-100);
}

.base-button__loader {
  width: 14px;
  height: 14px;

  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 999px;

  animation: base-button-spin 0.7s linear infinite;
}

@keyframes base-button-spin {
  to {
    transform: rotate(360deg);
  }
}

/*--------------------------------------------------- */
.experience-list-move {
  transition: transform 0.25s ease;
}

.experience-list-enter-active,
.experience-list-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.experience-list-enter-from,
.experience-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* ----------------------------------------------------- */
.experience-actions-move {
  transition: transform 0.25s ease;
}

.experience-actions-enter-active,
.experience-actions-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.experience-actions-enter-from,
.experience-actions-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.experience-actions-enter-to,
.experience-actions-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
