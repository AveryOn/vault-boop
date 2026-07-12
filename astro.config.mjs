import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import node from '@astrojs/node'
import { loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/astro'

const mode = process.env.NODE_ENV ?? 'development'
const rawEnv = loadEnv(mode, process.cwd(), '')

const env = {
  ...process.env,
  ...rawEnv,
}

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().min(1),
})

const clientEnvSchema = z.object({
  PUBLIC_APP_NAME: z.string().min(1),
  PUBLIC_APP_URL: z.url(),
  PUBLIC_API_URL: z.url(),
})

const serverParsed = serverEnvSchema.safeParse(env)

if (!serverParsed.success) {
  console.error(z.treeifyError(serverParsed.error))
  throw new Error('Invalid server env')
}

const clientParsed = clientEnvSchema.safeParse(env)

if (!clientParsed.success) {
  console.error(z.treeifyError(clientParsed.error))
  throw new Error('Invalid client env')
}

console.log('ASTRO CONFIG LOADED')

export default defineConfig({
  output: 'server',
  devToolbar: {
    enabled: false,
  },

  adapter: node({
    mode: 'standalone',
  }),

  integrations: [
    vue({
      appEntrypoint: '/src/client/_appVue.ts',
      devtools: false,
    }),
    UnoCSS({
      injectReset: '@unocss/reset/tailwind.css',
      inspector: false,
    }),
  ],

  vite: {
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },

  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],

      dirs: [
        './src/client/composables',
        './src/client/stores',
        './src/client/plugins',
        './src/client/utils',
      ],

      dts: './src/auto-imports.d.ts',

      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),

    Components({
      dirs: ['./src/client/components'],

      extensions: ['vue'],

      deep: true,

      dts: './src/components.d.ts',
    }),
  ],
})
