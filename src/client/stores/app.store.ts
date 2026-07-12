import type { Theme } from '~/client/types/app.types'
import { defineStore } from 'pinia'
import { CookieKey } from '~/shared/const'
import { AppTheme, themes } from '~/client/config/app-themes.config'

export const useAppStore = defineStore('APP_STORE', () => {
  function setCookie(name: string, value: string, days = 365) {
    const maxAge = days * 24 * 60 * 60

    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
  }

  function getCookie(name: string) {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`))
      ?.split('=')[1]
  }

  function applyTheme(theme: Theme) {
    document.documentElement.classList.remove(...themes)
    document.documentElement.classList.add(theme)

    setCookie(CookieKey.APP_THEME, theme)
  }

  function initTheme() {
    const themeFromCookie = getCookie(CookieKey.APP_THEME)
    console.debug('CALL', themeFromCookie)

    if (themes.includes(themeFromCookie as Theme)) {
      applyTheme(themeFromCookie as Theme)
      return
    }

    applyTheme(AppTheme['app-theme-package-1'])
  }

  function getCurrentPath() {
    return window.location.pathname
  }

  return {
    setCookie,
    getCookie,
    initTheme,
    applyTheme,
    getCurrentPath,
  }
})
