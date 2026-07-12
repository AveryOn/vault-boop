import z from 'zod'
import type { userTable } from '~/server/database/schema'

export type User = typeof userTable.$inferSelect
export type UserInput = typeof userTable.$inferInsert

export const createUserDto = z.object({
  // profileId: z.uuid(),
  username: z.string().trim().min(3),
  firstName: z.string().trim().min(3),
  lastName: z.string().trim().min(3),
  password: z.string().trim().min(8),
  // position: z.string().trim().min(1),
  // description: z.string().trim().min(1),
  // location: z.string().trim().min(1).nullable(),
  // employmentTypeId: z.uuid(),
  // startDate: z.string().min(1),
  // endDate: z.string().trim().min(1).nullable(),
  // isCurrent: z.boolean().default(false),
})
export type CreateUserDto = z.infer<typeof createUserDto>

export type CreateUserResponse = Omit<User, 'masterPasswordHash'>
