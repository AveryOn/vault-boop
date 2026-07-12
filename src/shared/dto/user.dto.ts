import z from 'zod'
import type { userTable } from '~/server/database/schema'

export type User = typeof userTable.$inferSelect
export type UserInput = typeof userTable.$inferInsert

export const createUserDto = z.object({
  username: z.string().trim().min(3),
  firstName: z.string().trim().min(3),
  lastName: z.string().trim().min(3),
  password: z.string().trim().min(8),
})
export type CreateUserDto = z.infer<typeof createUserDto>

export type CreateUserResponse = Omit<User, 'masterPasswordHash' | 'username'>

