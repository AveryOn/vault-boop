<script setup lang="ts">
const props = defineProps<{
  undoChanges: (field: string) => void
}>()
</script>

<template>
  <!-- COMPANY FIELD -->
  <div class="experience-edit-item">
    <div class="flex items-center justify-between">
      <p class="experience-edit-item__key">Company:</p>

      <InputUI v-if="editExperienceFormData['company']?.focused"
        v-model="editExperienceFormData['company']!.newValue! as string" size="xsmall" class="w-[50%]!"
        placeholder="Label">
      </InputUI>
      <p v-else class="experience-edit-item__value" @click="() => setFieldFocus('company', true)">
        {{ editExperienceFormData.company?.oldValue }}
      </p>

      <div class="experience-edit-item__actions">
        <Icon class="action-btn" :icon="mdiUndo" :size="26" @click="() => props.undoChanges('company')" />
        <span v-if="editExperienceFormData!['company']?.loading" class="base-button__loader" />
        <Icon v-else class="action-btn" :icon="mdiHandOkay" :size="26" @click="() => confirmUpdateField('company')" />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
