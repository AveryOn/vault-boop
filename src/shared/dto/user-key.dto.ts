import z from 'zod'
import type { userKeyTable } from '~/server/database/schema'

export type UserKey = typeof userKeyTable.$inferSelect
export type UserKeyInput = typeof userKeyTable.$inferInsert

export const createUserKeyDto = z.object({
  name: z.string().trim().min(3),
  key: z.string().trim().min(3),
})
export type CreateUserKeyDto = z.infer<typeof createUserKeyDto>

export type CreateUserKeyResponse = Omit<UserKey, 'masterPasswordHash' | 'username'>

export const updateUserKeyDto = z.object({
  name: z.string().trim().min(3).optional(),
  key: z.string().trim().min(3).optional(),
})

export type UpdateUserKeyDto = z.infer<typeof updateUserKeyDto>
export type UpdateUserKeyResponse = Omit<UserKey, 'masterPasswordHash' | 'username'>
