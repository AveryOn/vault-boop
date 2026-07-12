import z from 'zod'
import type { userActionTable } from '~/server/database/schema'

export type UserAction = typeof userActionTable.$inferSelect
export type UserActionInput = typeof userActionTable.$inferInsert

export const createUserActionDto = z.object({
  userId: z.uuid(),
  actionId: z.uuid(),
})
export type CreateUserActionDto = z.infer<typeof createUserActionDto>
export type CreateUserActionResponse = UserAction
