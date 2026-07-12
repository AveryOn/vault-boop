import z from 'zod'
import type { userKeyTable } from '~/server/database/schema'

export type UserKey = typeof userKeyTable.$inferSelect
export type UserKeyInput = typeof userKeyTable.$inferInsert
export type UserKeySafety = Omit<
  | UserKey
  | 'userId'
  | 'deletedAt',
  | 'keyHash'
>


export const createUserKeyDto = z.object({
  name: z.string().trim().min(3),
  key: z.string().trim().min(3),
})
export type CreateUserKeyDto = z.infer<typeof createUserKeyDto>
export type CreateUserKeySecureDto = Pick<UserKeyInput, 'userId' | 'userActionId'>

export type CreateUserKeyResponse = UserKeySafety

export const updateUserKeyDto = z.object({
  name: z.string().trim().min(3).optional(),
  key: z.string().trim().min(3).optional(),
})

export type UpdateUserKeyDto = z.infer<typeof updateUserKeyDto>
export type UpdateUserKeyResponse = UserKeySafety
