import z from 'zod'
import { accessTokenTable } from '~/server/database/schema'

export type AccessToken = typeof accessTokenTable.$inferSelect
export type AccessTokenInput = typeof accessTokenTable.$inferInsert

export const createAccessTokenDto = z.object({
  token: z.string(),
})
export type CreateAccessTokenDto = z.infer<typeof createAccessTokenDto>
export type CreateAccessTokenResponse = Omit<AccessToken, 'token' | 'userId'>


export type CreateAccessTokenSecureDto = Pick<AccessTokenInput, 'userId'>


export interface AccessTokenPayload {
  userId: string
  username: string
}
