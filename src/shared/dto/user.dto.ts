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

export const updateUserDto = z.object({
  username: z.string().trim().min(3).optional(),
  firstName: z.string().trim().min(3).optional(),
  lastName: z.string().trim().min(3).optional(),
  password: z.string().trim().min(8).optional(),
})

export type UpdateUserDto = z.infer<typeof updateUserDto>
export type UpdateUserResponse = Omit<User, 'masterPasswordHash' | 'username'>
