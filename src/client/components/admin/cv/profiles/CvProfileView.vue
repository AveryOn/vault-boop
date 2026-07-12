<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CvProfileApi } from '~/client/api/admin/cv/profile.api'
import type { Profile } from '~/shared/dto/cv/profile.dto'
import Icon from '~/client/components/common/Icon.vue'
import { mdiPlus } from '@mdi/js'
import { AppRoutes } from '~/shared/router'
import ProfileActiveBadge from '~/client/components/shared/ProfileActiveBadge.vue'

const profiles = ref<Profile[]>([])

onMounted(async () => {
  profiles.value = await CvProfileApi.getAll()
})
</script>

<template>
  <section class="cv-admin__profile">
    <div class="cv-profile__action-block">
      <a
        href="/admin/cv/profile/new"
        class="action-button text-[--primary-color-4] bg-[--primary-color-3] px-[8px] py-[4px] rounded-[6px]"
      >
        <Icon :icon="mdiPlus" :size="24"></Icon>
      </a>
    </div>
    <ul class="cv-profile__list-block">
      <li
        v-for="profile in profiles"
        :key="profile.id"
        class="profile-list-item"
      >
        <a :href="AppRoutes.admin.CvProfileById(profile.id)">
          <div class="flex w-full justify-between">
            <h2 class="profile-item__header w-full">
              {{ profile.title }}
            </h2>
            <ProfileActiveBadge :is-active="profile.isActive" />
          </div>
          <div
            class="flex items-center gap-[14px] w-full text-[--text-color-3] py-[8px] px-[8px]"
          >
            <div
              class="bg-[--primary-color-3-100] px-[8px] py-[4px] rounded-[4px] font-bold"
            >
              {{
                `${profile.firstName}
              ${profile.lastName}`
              }}
            </div>
            <div>
              {{ profile.summary }}
            </div>
          </div>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.cv-admin__profile {
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  border-radius: 10px;
  border: 1px dashed var(--border-color-1);
}

.cv-profile__action-block {
  display: flex;
  justify-content: end;
  width: 100%;
  height: 50px;
  padding: 10px 24px;
  border-bottom: 1px dotted var(--border-color-1);
}

.action-button {
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: var(--primary-color-3-hover);
  transition: all 0.3s ease;
}

.cv-profile__list-block {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 12px 24px;
  gap: 8px;
}

.profile-list-item {
  padding: 12px;
  background-color: var(--primary-color-3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-list-item:hover {
  transition: all 0.3s ease;
  background-color: var(--primary-color-3-hover);
}

.profile-item__header {
  padding-bottom: 6px;
  padding-left: 4px;
  border-bottom: 1px solid var(--border-color-1);
}
</style>
