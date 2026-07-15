// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/**
 * Расширение клиентского контекста через глобальное объявление
 * Документация: https://docs.astro.build/en/guides/middleware/#example-redacting-sensitive-information
 */

interface ImportMetaEnv {
  readonly NODE_ENV: string
  readonly DATABASE_URL: string
  readonly PUBLIC_APP_NAME: string
  readonly PUBLIC_APP_URL: string
  readonly PUBLIC_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  namespace App {
    interface Locals {
      title: string
      description: string
    }
  }
}

declare module '@jamescoyle/vue-icon' { }


/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    ip?: string | null
    ua?: string | null
    deviceId?: string | null
    userId?: string | null
    sessionId?: string | null
    tokenId?: string | null
    username?: string | null
  }
}
