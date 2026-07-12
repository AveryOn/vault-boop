import { onBeforeUnmount, onMounted, unref, type MaybeRef } from 'vue'
import { _ } from '~/shared/const';

export type KeyboardKey =
  | 'esc'
  | 'ctrl'
  | 'enter'
  | 'space'
  | 'tab'
  | 'backspace'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'

export type KeyboardShortcut =
  | KeyboardKey
  | `ctrl+${Exclude<KeyboardKey, 'ctrl'>}`

export type KeyboardCallback = (event: KeyboardEvent) => void

export type KeyboardHandlers = Partial<Record<KeyboardShortcut, KeyboardCallback>>

export type UseKeyboardOptions = {
  enabled?: MaybeRef<boolean>
  preventDefault?: boolean | KeyboardShortcut[]
  stopPropagation?: boolean
  eventName?: 'keydown' | 'keyup'
}

const KEY_MAP: Record<string, KeyboardKey> = {
  Escape: 'esc',
  Esc: 'esc',
  Control: 'ctrl',
  Enter: 'enter',
  ' ': 'space',
  Spacebar: 'space',
  Tab: 'tab',
  Backspace: 'backspace',
  ArrowUp: 'arrow-up',
  ArrowDown: 'arrow-down',
  ArrowLeft: 'arrow-left',
  ArrowRight: 'arrow-right',
}

function normalizeKey(event: KeyboardEvent): KeyboardKey | null {
  return KEY_MAP[event.key] ?? null
}

function shouldPreventDefault(
  shortcut: KeyboardShortcut,
  preventDefault?: boolean | KeyboardShortcut[],
) {
  if (preventDefault === true) {
    return true
  }

  if (Array.isArray(preventDefault)) {
    return preventDefault.includes(shortcut)
  }

  return false
}

function getShortcuts(event: KeyboardEvent): KeyboardShortcut[] {
  const key = normalizeKey(event)

  if (!key) {
    return []
  }

  const shortcuts: KeyboardShortcut[] = [key]

  if (event.ctrlKey && key !== 'ctrl') {
    shortcuts.unshift(`ctrl+${key}` as KeyboardShortcut)
  }

  return shortcuts
}

export function useKeyboard(
  handlers: KeyboardHandlers,
  options: UseKeyboardOptions = {},
) {
  const eventName = options.eventName ?? 'keydown'

  function handleKeyboardEvent(event: KeyboardEvent) {
    if (options.enabled !== undefined && !unref(options.enabled)) {
      return
    }

    const shortcuts = getShortcuts(event)

    for (const shortcut of shortcuts) {
      const callback = handlers[shortcut]

      if (!callback) {
        continue
      }

      if (shouldPreventDefault(shortcut, options.preventDefault)) {
        event.preventDefault()
      }

      if (options.stopPropagation) {
        event.stopPropagation()
      }

      callback(event)
      break
    }
  }

  onMounted(() => {
    window.addEventListener(eventName, handleKeyboardEvent)
  })

  onBeforeUnmount(() => {
    window.removeEventListener(eventName, handleKeyboardEvent)
  })

  return {
    handleKeyboardEvent,
  }
}
