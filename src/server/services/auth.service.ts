import type { SignInDto, SignUpDto } from "~/shared/dto/auth.dto"
import type { Logger } from "~/shared/logger/logger.client"
import { db } from "~/server/database/client"
import { UserService } from "~/server/services/user.service"
import { dateISO, getExpiresAt, isEntityExpired } from "~/shared/utils/datetime"
import { SessionService } from "~/server/services/session.service"
import { SessionStatus } from "~/shared/const"

export const AuthService = {

  async validateAuthContext(locals: Required<App.Locals>, logger?: Logger) {
    const ErrorMap: Record<keyof Required<App.Locals>, string[]> = {
      ip: [],
      ua: [],
      deviceId: [],
      sessionId: [],
      tokenId: [],
      userId: [],
      username: [],
    }

    return await db.transaction(async (tx) => {
      try {
        const now = dateISO()
        const mockUUID = crypto.randomUUID()

        // 1. Проверить существование пользователя
        let user = await UserService.getByUsername(locals.username!, tx, logger)
        if (!user) {
          ErrorMap.username.push('user_not_found')

          // Моковый пользователь
          user = {
            id: mockUUID,
            username: 'mock_username_123',
            firstName: 'MOCK_NAME',
            lastName: 'MOCK_LAST_NAME',
            masterPasswordHash: 'mock_hash_password',
            updatedAt: now,
            createdAt: now,
            deletedAt: null,
          }
        }

        // 2. Проверить сессию
        let session = await SessionService.getByParams({
          accessTokenId: locals.tokenId!,
          userId: locals.userId!,
        })
        if (!session) {
          ErrorMap.sessionId.push('session_not_found')
          session = {
            id: mockUUID,
            status: SessionStatus.ACTIVE,
            userId: mockUUID,
            accessTokenId: mockUUID,
            expiresAt: getExpiresAt('15m'),
            lastUsedAt: now,
            lastUserActionId: mockUUID,
            createdAt: now,
          }
        }

        if (isEntityExpired(session.expiresAt)) {
          ErrorMap.sessionId.push('session_expired')
        }



      }
      catch (err) {
        logger?.error('Sign-Up Error', { err })
        throw err
      }

    })
  },

  async signUp(dto: SignUpDto, logger: Logger) {
    return await db.transaction(async (tx) => {
      try {
        //
      }
      catch (err) {
        logger.error('Sign-Up Error', { err })
        throw err
      }

    })
  },

  async signIn(dto: SignInDto, logger: Logger) {
    return await db.transaction(async (tx) => {
      try {
        //
      } catch (err) {
        logger.error('Sign-In Error', { err })
        throw err
      }
    })
  }
}
