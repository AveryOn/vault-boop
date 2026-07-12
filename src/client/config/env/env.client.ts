import z from 'zod'

export const clientEnvSchema = z.object({
  PUBLIC_APP_NAME: z.string().min(1),
  PUBLIC_APP_URL: z.url(),
  PUBLIC_API_URL: z.url(),
})

const parsed = clientEnvSchema.safeParse({
  PUBLIC_APP_NAME: import.meta.env.PUBLIC_APP_NAME,
  PUBLIC_APP_URL: import.meta.env.PUBLIC_APP_URL,
  PUBLIC_API_URL: import.meta.env.PUBLIC_API_URL,
})

if (!parsed.success) {
  console.error(z.treeifyError(parsed.error))
  throw new Error('Invalid client environment variables')
}

export const clientEnv = parsed.data
