import z from 'zod'
import type { sessionTable } from '~/server/database/schema'
import { SessionStatus } from '~/shared/const'

export type Session = typeof sessionTable.$inferSelect
export type SessionInput = typeof sessionTable.$inferInsert

export const createSessionDto = z.object({
  lastUserActionId: z.uuid(),
  userId: z.uuid(),
})
export type CreateSessionDto = z.infer<typeof createSessionDto>
export type CreateSessionResponse = Session

export const updateSessionDto = z.object({
  accessTokenId: z.uuid(),
  lastUserActionId: z.uuid(),
  expiresAt: z.string(),
  lastUsedAt: z.string(),
})

export type UpdateSessionDto = z.infer<typeof updateSessionDto>
export type UpdateSessionResponse = Session


export const terminateAllSessionsDto = z.object({
  userId: z.uuid(),
})
export type TerminateAllSessionsDto = z.infer<typeof terminateAllSessionsDto>


export const getSessionByStatus = z.object({
  userId: z.uuid(),
  status: z.enum(SessionStatus),
})
export type GetSessionByStatus = z.infer<typeof getSessionByStatus>
