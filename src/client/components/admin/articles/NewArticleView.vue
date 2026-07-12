<script setup lang="ts">
import { ref } from 'vue'
import TextareaUI from '~/client/components/shared/TextareaUI.vue'
import { UseI18n } from '~/client/composables/useI18n'
import { renderMarkdown } from '~/shared/utils/markdown/renderMarkdown'
import MarkdownBody from '~/client/components/shared/MarkdownBody.vue'
import { ArticlesApi } from '~/client/api/articles.api'
import InputUI from '~/client/components/shared/InputUI.vue'
import Icon from '~/client/components/common/Icon.vue'
import { mdiLanguageMarkdownOutline } from '@mdi/js'
import ButtonUI from '../../shared/ButtonUI.vue'

const loading = ref(false)
const title = ref('')
const rawValue = ref('')
const html = ref('')

const { $t } = UseI18n()
async function handlerInput(input: string) {
  html.value = await renderMarkdown(input)
}

async function submit() {
  try {
    loading.value = true
    await ArticlesApi.create({
      content: rawValue.value,
      slug: `slug-${Date.now()}`,
      title: title.value,
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="new-article-viewer">
    <div class="grid-empty-left"></div>

    <InputUI
      v-model="title"
      class="grid-title-input"
      :placeholder="$t('Title')"
    />

    <div class="grid-title-block-right" :placeholder="$t('Title')">
      {{ $t('Title') }}:<span>{{ title }}</span>
    </div>

    <ButtonUI
      :disabled="rawValue.length <= 0 || title.length < 3"
      :loading="loading"
      :label="'SAVE'"
      @click="submit"
    />

    <div class="viewer-input-block">
      <TextareaUI
        v-model="rawValue"
        :placeholder="$t('Input Here')"
        :rows="20"
        :throttle-ms="800"
        @throttled-input="handlerInput"
      />
    </div>

    <div class="viewer-preview-block">
      <Icon
        v-if="html.length <= 0"
        class="markdown-placeholder-icon"
        :icon="mdiLanguageMarkdownOutline"
        :size="200"
      ></Icon>
      <MarkdownBody :html="html" :uuid="'none'" />
    </div>
  </div>
</template>

<style scoped>
.new-article-viewer {
  width: 100%;
  height: max-content;

  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: 70px auto;
  grid-template-areas:
    'input block-right'
    'textarea preview';

  gap: 12px;

  border: 1px dashed rgba(128, 128, 128, 0.205);
  padding: 24px 8px;
}

.grid-title-input {
  grid-area: input;
  height: 100%;
}

.grid-title-block-right {
  grid-area: block-right;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 10px;
}

.viewer-input-block {
  grid-area: textarea;
  width: 100%;
}

.viewer-preview-block {
  position: relative;
  grid-area: preview;
  width: 100%;

  background-color: var(--primary-color-2);
  border-radius: 10px;
  border: 1px solid var(--border-color-1);
}

.markdown-placeholder-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--primary-color-1);
}
</style>
