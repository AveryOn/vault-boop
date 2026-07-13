import z from 'zod'
import type { userActionTable } from '~/server/database/schema'

export type UserAction = typeof userActionTable.$inferSelect
export type UserActionInput = typeof userActionTable.$inferInsert

export type UserActionSafety = Omit<UserAction, 'userId'>
export const createUserActionDto = z.object({
  actionId: z.uuid(),
  comment: z.string().nullable().optional(),
})
export type CreateUserActionDto = z.infer<typeof createUserActionDto>
export type CreateUserActionResponse = UserAction
export type CreateUserActionSecureDto = Pick<UserActionInput, 'userId'>
