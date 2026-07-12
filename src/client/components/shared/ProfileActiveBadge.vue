<script setup lang="ts">
import { mdiCheckCircleOutline } from '@mdi/js'
import Icon from '~/client/components/common/Icon.vue'

const { isActive = false } = defineProps<{
  isActive?: boolean
}>()
</script>

<template>
  <span
    class="cv-profile-by-id__status"
    :class="{
      'cv-profile-by-id__status--active': isActive,
      'cv-profile-by-id__status--inactive': !isActive,
    }"
  >
    <Icon :icon="mdiCheckCircleOutline" :size="20" />
    {{ isActive ? 'Active' : 'Inactive' }}
  </span>
</template>

<style scoped>
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
</style>
