import z from 'zod'
import type { sessionTable } from '~/server/database/schema'

export type Session = typeof sessionTable.$inferSelect
export type SessionInput = typeof sessionTable.$inferInsert

export const createSessionDto = z.object({
  name: z.string().trim().min(3),
})
export type CreateSessionDto = z.infer<typeof createSessionDto>
export type CreateSessionResponse = Session

export const updateSessionDto = z.object({
  name: z.string().trim().min(3),
})

export type UpdateSessionDto = z.infer<typeof updateSessionDto>
export type UpdateSessionResponse = Session
