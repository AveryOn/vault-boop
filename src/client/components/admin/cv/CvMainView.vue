<script setup lang="ts">
import { ref } from 'vue'
import Icon from '~/client/components/common/Icon.vue'
import { mdiAccountEdit } from '@mdi/js'
import { useAppStore } from '~/client/stores/app.store'

const appStore = useAppStore()

const activeSection = ref('')

const ADMIN_CV_PATH_PREFIX = '/admin/cv'

interface NavItem {
  key: string
  label: string
  href: string
}

const navItems = [
  {
    key: 'profile',
    label: 'Profile',
    href: ADMIN_CV_PATH_PREFIX + '/profile',
  },
  {
    key: 'links',
    label: 'Links',
    href: ADMIN_CV_PATH_PREFIX + '/links',
  },
  {
    key: 'experience',
    label: 'Experience',
    href: ADMIN_CV_PATH_PREFIX + '/experience',
  },
  {
    key: 'projects',
    label: 'Projects',
    href: ADMIN_CV_PATH_PREFIX + '/projects',
  },
  {
    key: 'skills',
    label: 'Skills',
    href: ADMIN_CV_PATH_PREFIX + '/skills',
  },
  {
    key: 'languages',
    label: 'Languages',
    href: ADMIN_CV_PATH_PREFIX + '/languages',
  },
  {
    key: 'employment-types',
    label: 'Employment Types',
    href: ADMIN_CV_PATH_PREFIX + '/employment-types',
  },
  {
    key: 'templates',
    label: 'Templates',
    href: ADMIN_CV_PATH_PREFIX + '/templates',
  },
  {
    key: 'preview',
    label: 'Preview',
    href: ADMIN_CV_PATH_PREFIX + '/preview',
  },
  {
    key: 'versions',
    label: 'Versions',
    href: ADMIN_CV_PATH_PREFIX + '/versions',
  },
]

function isActiveSection(item: NavItem) {
  const isActive = appStore.getCurrentPath().startsWith(item.href)
  if (isActive) {
    activeSection.value = item.key
  }
  return isActive
}
</script>

<template>
  <section class="cv-admin">
    <header class="cv-admin__header">
      <div>
        <h1 class="cv-admin__title">CV Management</h1>
        <p class="cv-admin__subtitle">
          Manage resume content, templates and versions.
        </p>
      </div>

      <nav class="cv-admin__nav">
        <a v-for="item in navItems" :key="item.key" :href="item.href" class="cv-admin__nav-item" :class="{
          'cv-admin__nav-item--active': isActiveSection(item),
        }" type="button" @click="activeSection = item.key">
          {{ item.label }}
        </a>
      </nav>
    </header>

    <main class="cv-admin__content">
      <div v-if="!activeSection" class="min-h-[500px] flex items-center justify-center">
        <Icon :icon="mdiAccountEdit" :size="200" class="text-[--primary-color-1]"></Icon>
      </div>
      <div v-else>
        <slot></slot>
      </div>
    </main>
  </section>
</template>

<style scoped>
.cv-admin {
  padding: 24px;
}

.cv-admin__header {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 24px;
}

.cv-admin__title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.cv-admin__subtitle {
  margin: 6px 0 0;
  opacity: 0.7;
}

.cv-admin__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cv-admin__nav-item {
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  padding: 9px 14px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.cv-admin__nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.cv-admin__nav-item--active {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.32);
}

.cv-admin__content {
  min-height: 320px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 20px;
}

.cv-admin__placeholder {
  opacity: 0.8;
}
</style>
