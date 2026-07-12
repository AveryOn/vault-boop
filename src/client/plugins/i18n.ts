import { createI18n } from 'vue-i18n'

import en from '~/client/locales/en.json'
import ru from '~/client/locales/ru.json'

export enum AppLocaleEnum {
  en = 'en',
  ru = 'ru',
}
export type AppLocale = 'en' | 'ru'

const getInitialLocale = (): AppLocale => {
  if (typeof document === 'undefined') return AppLocaleEnum.en

  const match = document.cookie.match(/(?:^|;\s*)lang=(en|ru)(?:;|$)/)

  return match?.[1] === AppLocaleEnum.ru
    ? AppLocaleEnum.ru
    : AppLocaleEnum.en
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,

  locale: getInitialLocale(),
  fallbackLocale: 'en',

  messages: {
    en,
    ru,
  },

  pluralRules: {
    ru(choice) {
      const mod10 = choice % 10
      const mod100 = choice % 100

      if (mod10 === 1 && mod100 !== 11) return 0
      if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
        return 1

      return 2
    },

    en(choice) {
      return choice === 1 ? 0 : 1
    },
  },
})

type PluralTranslate = (
  key: string,
  plural: number,
  named?: Record<string, unknown>,
) => string

export const plural = (
  key: string,
  count: number,
  params: Record<string, unknown> = {},
): string => {
  const t = i18n.global.t as unknown as PluralTranslate

  return t(key, count, {
    ...params,
    count,
  })
}
export const setLocale = (locale: AppLocale): void => {
  i18n.global.locale.value = locale
  document.cookie = `lang=${AppLocaleEnum[locale]}; path=/; max-age=31536000`
}

export const getLocale = (): AppLocale => {
  return i18n.global.locale.value as AppLocale
}
