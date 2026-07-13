<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import InputUI from '~/client/components/shared/InputUI.vue'
import ButtonUI from '~/client/components/shared/ButtonUI.vue'
import { useToast } from '~/client/composables/useToast'
import { AuthApi } from '~/client/api/auth.api'

const toast = useToast()

const signUpDto = z
  .object({
    username: z.string().trim().min(3, 'Username must contain at least 3 characters'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
  })

const formData = ref({
  username: {
    value: '',
    error: '',
    focused: '',
  },
  password: {
    value: '',
    error: '',
    focused: '',
  },
})

const isLoading = ref(false)

function clearErrors(): void {
  formData.value.username.error = ''
  formData.value.password.error = ''
}

function undoError(field: keyof typeof formData.value): void {
  formData.value[field].error = ''
}

async function submit(): Promise<void> {
  try {
    isLoading.value = true
    clearErrors()

    const result = signUpDto.safeParse({
      username: formData.value.username.value,
      password: formData.value.password.value,
    })

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors

      formData.value.username.error = errors.username?.[0] ?? ''
      formData.value.password.error = errors.password?.[0] ?? ''

      return
    }

    await AuthApi.signIn({
      username: result.data.username,
      password: result.data.password,
    })
  } catch (error) {
    console.error(error)
    toast.error('Failed to create account')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section class="mx-auto w-[360px] h-full flex items-center justify-center py-10">
    <article class="overlay-card">
      <form class="w-[360px] min-h-[720px] flex flex-col px-[24px] py-[12px] gap-[28px]" @submit.prevent="submit">
        <h1 class="text-[36px] ml-auto">
          Sign In
        </h1>

        <InputUI v-model="formData.username.value" placeholder="Username" size="large" type="text" label="Username"
          :error="formData.username.error" @input="undoError('username')" />

        <InputUI v-model="formData.password.value" type="password" autocomplete="new-password" placeholder="Password"
          size="large" label="Password" :error="formData.password.error" @input="undoError('password')" />

        <div class="w-full flex justify-center mt-auto mb-[24px]">
          <ButtonUI type="submit" class="w-[50%]" :disabled="isLoading" :size="'large'">
            {{ isLoading ? 'Loading...' : 'Submit' }}
          </ButtonUI>
        </div>
      </form>

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
