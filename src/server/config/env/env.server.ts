import z from 'zod'

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  DATABASE_URL: z.string().min(1),
  DATA_HASH_KEY: z.string().min(1),
  ACCESS_HASH_KEY: z.string().min(1),
  ACCESS_TOKEN_TTL: z.string(),
  CIPHER_ALGORITHM: z.string(),
  HASH_ALGORITHM: z.string(),
  HASH_ALGORITHM_MEM_COST: z.coerce.number(),
  HASH_ALGORITHM_TIME_COST: z.coerce.number(),
  HASH_ALGORITHM_PARALLELISM: z.coerce.number(),
})

const parsed = serverEnvSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error(JSON.stringify(z.treeifyError(parsed.error)))
  throw new Error('Invalid server environment variables')
}

export const serverEnv = parsed.data
