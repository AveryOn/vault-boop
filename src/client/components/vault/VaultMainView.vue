<script setup lang="ts">

</script>

<template>
  <section class="mx-auto w-[360px] h-full flex items-center justify-center py-10">
    <article class="overlay-card">
      <div class="w-[360px] min-h-[720px] flex flex-col px-[24px] py-[12px] gap-[28px]">
        <h1 class="text-[36px] ml-auto">
          Vault
        </h1>
      </div>

    </article>
  </section>
</template>

<style scoped>
.overlay-card {
  position: relative;
  overflow: hidden;
  width: max-content;
  display: flex;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  height: max-content;
  background-color: var(--primary-color-2);
  color: var(--cv-text-color-1);
}
</style>
