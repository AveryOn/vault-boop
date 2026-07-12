import z from 'zod'
import type { actionTable } from '~/server/database/schema'

export type Action = typeof actionTable.$inferSelect
export type ActionInput = typeof actionTable.$inferInsert

export const createActionDto = z.object({
  name: z.string().trim().min(3),
})
export type CreateActionDto = z.infer<typeof createActionDto>
export type CreateActionResponse = Action

export const updateActionDto = z.object({
  username: z.string().trim().min(3).optional(),
  firstName: z.string().trim().min(3).optional(),
  lastName: z.string().trim().min(3).optional(),
  password: z.string().trim().min(8).optional(),
})

export type UpdateActionDto = z.infer<typeof updateActionDto>
export type UpdateActionResponse = Action
