import { readonly, ref } from 'vue'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastPayload {
  title?: string
  message: string
  variant?: ToastVariant
  duration?: number | false
  closable?: boolean
  action?: ToastAction
}

export interface ToastItem {
  id: string
  title?: string
  message: string
  variant: ToastVariant
  duration: number | false
  closable: boolean
  action?: ToastAction
  createdAt: number
}

type ToastShortcutOptions = Omit<ToastPayload, 'message' | 'variant'>

interface ToastTimerState {
  timer: ReturnType<typeof setTimeout> | null
  startedAt: number
  remaining: number
}

const DEFAULT_DURATION = 4000
const MAX_TOASTS = 5

const toasts = ref<ToastItem[]>([])
const timers = new Map<string, ToastTimerState>()

function createToastId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
  )
}

function clearTimer(id: string) {
  const state = timers.get(id)

  if (state?.timer) {
    clearTimeout(state.timer)
  }

  timers.delete(id)
}

function scheduleRemove(id: string, duration: number) {
  clearTimer(id)

  const timer = setTimeout(() => {
    remove(id)
  }, duration)

  timers.set(id, {
    timer,
    startedAt: Date.now(),
    remaining: duration,
  })
}

function push(payload: ToastPayload) {
  const toast: ToastItem = {
    id: createToastId(),
    title: payload.title,
    message: payload.message,
    variant: payload.variant ?? 'info',
    duration: payload.duration ?? DEFAULT_DURATION,
    closable: payload.closable ?? true,
    action: payload.action,
    createdAt: Date.now(),
  }

  toasts.value.unshift(toast)

  if (toasts.value.length > MAX_TOASTS) {
    const removed = toasts.value.splice(MAX_TOASTS)

    removed.forEach((item) => {
      clearTimer(item.id)
    })
  }

  if (typeof toast.duration === 'number' && toast.duration > 0) {
    scheduleRemove(toast.id, toast.duration)
  }

  return toast.id
}

function remove(id: string) {
  clearTimer(id)

  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function clear() {
  toasts.value.forEach((toast) => {
    clearTimer(toast.id)
  })

  toasts.value = []
}

function pause(id: string) {
  const state = timers.get(id)

  if (!state?.timer) {
    return
  }

  clearTimeout(state.timer)

  const elapsed = Date.now() - state.startedAt
  const remaining = Math.max(state.remaining - elapsed, 0)

  timers.set(id, {
    timer: null,
    startedAt: 0,
    remaining,
  })
}

function resume(id: string) {
  const state = timers.get(id)

  if (!state || state.timer || state.remaining <= 0) {
    return
  }

  const timer = setTimeout(() => {
    remove(id)
  }, state.remaining)

  timers.set(id, {
    timer,
    startedAt: Date.now(),
    remaining: state.remaining,
  })
}

function info(message: string, options: ToastShortcutOptions = {}) {
  return push({
    ...options,
    message,
    variant: 'info',
  })
}

function success(message: string, options: ToastShortcutOptions = {}) {
  return push({
    ...options,
    message,
    variant: 'success',
  })
}

function warning(message: string, options: ToastShortcutOptions = {}) {
  return push({
    ...options,
    message,
    variant: 'warning',
  })
}

function error(message: string, options: ToastShortcutOptions = {}) {
  return push({
    ...options,
    message,
    variant: 'error',
  })
}

export function useToast() {
  return {
    toasts: readonly(toasts),

    push,
    remove,
    clear,

    pause,
    resume,

    info,
    success,
    warning,
    error,
  }
}
