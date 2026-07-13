<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import InputUI from '~/client/components/shared/InputUI.vue'
import ButtonUI from '~/client/components/shared/ButtonUI.vue'
import { useToast } from '~/client/composables/useToast'
import { AuthApi } from '~/client/api/auth.api'
import { AppRoutes } from '~/shared/router'

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
    value: '_user_',
    error: '',
    focused: '',
  },
  lastName: {
    value: '_vault_',
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
const isRegistered = ref(false)

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

function goToSignIn(): void {
  window.location.href = AppRoutes.client.SignIn
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
      repeatPassword: _repeatPassword,
      ...payload
    } = result.data

    const { data } = await AuthApi.signUp(payload)
    if (!data?.success) {
      throw ''
    }
    isRegistered.value = true
    toast.success('Account created successfully')
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
      <Transition name="content-switch" mode="out-in">
        <form v-if="!isRegistered" key="signup-form"
          class="w-[360px] min-h-[720px] flex flex-col px-[24px] py-[12px] gap-[28px]" @submit.prevent="submit">
          <h1 class="text-[36px] ml-auto">
            Sign Up
          </h1>

          <InputUI v-model="formData.username.value" placeholder="Username" size="large" type="text" label="Username"
            :error="formData.username.error" @input="undoError('username')" />

          <InputUI v-model="formData.password.value" type="password" autocomplete="new-password" placeholder="Password"
            size="large" label="Password" :error="formData.password.error" @input="undoError('password')" />

          <InputUI v-model="formData.repeatPassword.value" type="password" autocomplete="new-password"
            placeholder="Repeat password" size="large" label="Repeat password" :error="formData.repeatPassword.error"
            @input="undoError('repeatPassword')" />

          <div class="w-full flex justify-center mt-auto mb-[24px]">
            <ButtonUI type="submit" class="w-[50%]" :disabled="isLoading" :size="'large'">
              {{ isLoading ? 'Loading...' : 'Submit' }}
            </ButtonUI>
          </div>
        </form>

        <div v-else key="success-message"
          class="w-[360px] min-h-[420px] flex flex-col items-center justify-center gap-[32px] px-[32px] py-[40px]">
          <h1 class="text-[36px]">
            Success
          </h1>

          <p class="text-center text-[18px] leading-[1.6]">
            Вы успешно зарегистрировали аккаунт, далее выполните вход в систему.
          </p>

          <ButtonUI type="button" class="w-[50%] mx-auto!" :size="'large'" @click="goToSignIn">
            Sign In
          </ButtonUI>
        </div>
      </Transition>
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

.content-switch-enter-active,
.content-switch-leave-active {
  transition:
    opacity 250ms ease,
    transform 250ms ease;
}

.content-switch-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

.content-switch-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
