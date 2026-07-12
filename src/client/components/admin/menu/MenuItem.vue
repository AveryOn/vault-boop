<script setup lang="ts">
import Icon from '~/client/components/common/Icon.vue'

const props = defineProps<{
  title: string
  icon: string
}>()
</script>

<template>
  <div class="menu-item">
    <Icon :icon="props.icon" :size="60"></Icon>
    <h2 class="mt-[48px]">
      {{ props.title }}
    </h2>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 300px;
  border: 1px solid var(--border-color-1);
  border-radius: 18px;
  background-color: var(--primary-color-2);
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: var(--primary-color-3);
  transition: all 0.3s ease;
  cursor: pointer;
}
</style>
