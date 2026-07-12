import z from 'zod'

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  DATABASE_URL: z.string().min(1),
})

const parsed = serverEnvSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error(JSON.stringify(z.treeifyError(parsed.error)))
  throw new Error('Invalid server environment variables')
}

export const serverEnv = parsed.data
