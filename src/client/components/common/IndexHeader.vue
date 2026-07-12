<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { mdiConsole } from '@mdi/js'
import { onMounted, ref } from 'vue'
import { useAppStore } from '~/client/stores/app.store'
import Icon from '~/client/components/common/Icon.vue'

const appStore = useAppStore()

const currentPath = ref('/')
const navItems = [
  {
    label: 'Main',
    href: '/',
  },
  {
    label: 'Projects',
    href: '/projects',
  },
  {
    label: 'News',
    href: '/news',
  },
  {
    label: 'About Me',
    href: '/about-me',
  },
  {
    label: 'Admin',
    href: '/admin',
  },
]

function isActive(href: string) {
  if (href === '/') {
    return currentPath.value === '/'
  }

  return currentPath.value.startsWith(href)
}
onMounted(() => {
  currentPath.value = window.location.pathname
  appStore.initTheme()
})
</script>

<template>
  <div class="app-header">
    <a href="/" class="app-header__brand">
      <Icon :icon="mdiConsole" :size="50" />

      <h1 class="app-header__title">Everi Vladislav</h1>
    </a>

    <nav class="app-header__nav" aria-label="Main navigation">
      <a
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
        class="app-header__nav-link"
        :class="{
          'app-header__nav-link--active': isActive(item.href),
        }"
      >
        {{ item.label }}
      </a>
    </nav>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  margin: 12px 0;
  padding: 0 14px;
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 10px;

  color: var(--primary-color-1);
  text-decoration: none;
}

.app-header__title {
  margin: 0;

  font-size: 36px;
  font-weight: 600;
  line-height: 1;

  color: var(--text-color-1);
  user-select: none;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 6px;

  border: 1px solid var(--border-color-1);
  border-radius: 8px;

  background: var(--primary-color-2);
  backdrop-filter: blur(10px);
}

.app-header__nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 82px;
  height: 36px;
  padding: 0 14px;

  border-radius: 8px;

  color: color-mix(in srgb, #ffffff 78%, transparent);
  text-decoration: none;

  font-size: 14px;
  font-weight: 500;
  line-height: 1;

  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.app-header__nav-link:hover {
  color: #ffffff;
  background: var(--primary-color-3);
  transform: translateY(-1px);
}

.app-header__nav-link:active {
  transform: translateY(0);
}

.app-header__nav-link--active {
  color: #ffffff;
  background: var(--primary-color-1);
  box-shadow: 0 0 0 3px var(--primary-color-3);
}

@media (max-width: 760px) {
  .app-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .app-header__title {
    font-size: 28px;
  }

  .app-header__nav {
    width: 100%;
    overflow-x: auto;
    justify-content: flex-start;
  }

  .app-header__nav-link {
    min-width: max-content;
  }
}
</style>
