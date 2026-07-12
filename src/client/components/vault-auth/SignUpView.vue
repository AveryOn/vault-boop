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
    username: z
      .string()
      .trim()
      .min(3, 'Username must contain at least 3 characters'),

    firstName: z
      .string()
      .trim()
      .min(2, 'First name must contain at least 2 characters'),

    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must contain at least 2 characters'),

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters'),

    repeatPassword: z
      .string()
      .min(1, 'Repeat the password'),
  })
  .refine(
    data => data.password === data.repeatPassword,
    {
      path: ['repeatPassword'],
      message: 'Passwords do not match',
    },
  )

const formData = ref({
  username: {
    value: '',
    error: '',
    focused: '',
  },
  firstName: {
    value: '',
    error: '',
    focused: '',
  },
  lastName: {
    value: '',
    error: '',
    focused: '',
  },
  password: {
    value: '',
    error: '',
    focused: '',
  },
  repeatPassword: {
    value: '',
    error: '',
    focused: '',
  },
})

const isLoading = ref(false)

function clearErrors(): void {
  formData.value.username.error = ''
  formData.value.firstName.error = ''
  formData.value.lastName.error = ''
  formData.value.password.error = ''
  formData.value.repeatPassword.error = ''
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
      firstName: formData.value.firstName.value,
      lastName: formData.value.lastName.value,
      password: formData.value.password.value,
      repeatPassword: formData.value.repeatPassword.value,
    })

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors

      formData.value.username.error = errors.username?.[0] ?? ''
      formData.value.firstName.error = errors.firstName?.[0] ?? ''
      formData.value.lastName.error = errors.lastName?.[0] ?? ''
      formData.value.password.error = errors.password?.[0] ?? ''
      formData.value.repeatPassword.error =
        errors.repeatPassword?.[0] ?? ''

      return
    }

    const {
      ...payload
    } = result.data

    await AuthApi.signUp(payload)

    toast.success('Success!')
  } catch (err) {
    console.error(err)
    throw err
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
          Sign Up
        </h1>

        <InputUI v-model="formData.username.value" placeholder="Username" :size="'large'" type="text" label="Username"
          :error="formData.username.error" @input="undoError('username')" />

        <InputUI v-model="formData.firstName.value" placeholder="First name" :size="'large'" type="text"
          label="First name" :error="formData.firstName.error" @input="undoError('firstName')" />

        <InputUI v-model="formData.lastName.value" placeholder="Last name" :size="'large'" type="text" label="Last name"
          :error="formData.lastName.error" @input="undoError('lastName')" />

        <InputUI v-model="formData.password.value" type="password" autocomplete="new-password" placeholder="Password"
          :size="'large'" label="Password" :error="formData.password.error" @input="undoError('password')" />

        <InputUI v-model="formData.repeatPassword.value" type="password" autocomplete="new-password"
          placeholder="Repeat password" :size="'large'" label="Repeat password" :error="formData.repeatPassword.error"
          @input="undoError('repeatPassword')" />

        <div class="w-full flex justify-center mt-auto mb-[24px]">
          <ButtonUI type="submit" class="w-[50%]" :disabled="isLoading">
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
