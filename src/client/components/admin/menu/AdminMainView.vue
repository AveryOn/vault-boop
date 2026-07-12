<script setup lang="ts">
import { AppTheme } from '~/client/config/app-themes.config'
import { useAppStore } from '~/client/stores/app.store'
import {
  mdiPalette,
  mdiNewspaperVariantMultipleOutline,
  mdiFolderOpenOutline,
  mdiCardAccountDetailsOutline,
} from '@mdi/js'
import MenuItem from '~/client/components/admin/menu/MenuItem.vue'
import { UseI18n } from '~/client/composables/useI18n.ts'

const appStore = useAppStore()
const { $t } = UseI18n()
</script>

<template>
  <div>
    <header>
      <button
        @click="appStore.applyTheme(AppTheme['app-theme-package-1'])"
      >
        Theme 1
      </button>
      <button
        @click="appStore.applyTheme(AppTheme['app-theme-package-2'])"
      >
        Theme 2
      </button>
      <button
        @click="appStore.applyTheme(AppTheme['app-theme-package-3'])"
      >
        Theme 3
      </button>
    </header>

    <main class="main-admin-menu pt-[24px] overflow-hidden">
      <a href="/admin/cv">
        <MenuItem
          :icon="mdiCardAccountDetailsOutline"
          :title="$t('CV Management')"
        />
      </a>
      <a href="/admin/projects">
        <MenuItem
          :icon="mdiFolderOpenOutline"
          :title="$t('Projects Management')"
        />
      </a>
      <a href="/admin/articles">
        <MenuItem
          :icon="mdiNewspaperVariantMultipleOutline"
          :title="$t('Articles Management')"
        />
      </a>
      <a href="/admin/settings">
        <MenuItem
          :icon="mdiPalette"
          :title="$t('Adjust the color schema')"
        />
      </a>
    </main>
  </div>
</template>

<style scoped>
.main-admin-menu {
  width: 100%;
  margin-left: auto;
  height: max-content;
  display: flex;
  display: flex;
  gap: 36px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
