<!-- eslint-disable no-undef -->
<script setup lang="ts">
import { mdiShieldLockOutline } from '@mdi/js'
import { onMounted } from 'vue'
import { useAppStore } from '~/client/stores/app.store'
import Icon from '~/client/components/common/Icon.vue'

const appStore = useAppStore()


onMounted(() => {
  appStore.initTheme()
})
</script>

<template>
  <div class="app-header">
    <a href="/" class="app-header__brand">
      <Icon :icon="mdiShieldLockOutline" :size="50" />

      <h1 class="app-header__title">Vault BooP</h1>
    </a>
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
</style>
