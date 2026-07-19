import type { SignInDto, SignUpDto } from "~/shared/dto/auth.dto"
import type { Logger } from "~/shared/logger/logger.client"
import { db } from "~/server/database/client"
import { hashPassword } from "~/server/utils/crypto"
import { ActionRepo } from "~/server/repo/action.repo"
import { UserActionRepo } from "~/server/repo/user-action.repo"
import { ActionKey } from "~/shared/dto/action.dto"
import { ProcessStatus } from "~/shared/const";
import { HttpStatusCode } from "axios";
import { UserRepo } from "~/server/repo/user.repo";
import { UserService } from "~/server/services/user.service"
import { dateISO } from "~/shared/utils/datetime"

export const AuthService = {

  async validateAuthContext(locals: Required<App.Locals>, logger?: Logger) {
    const ErrorMap: Record<keyof Required<App.Locals>, string> = {
      ip: '',
      ua: '',
      deviceId: '',
      sessionId: '',
      tokenId: '',
      userId: '',
      username: '',
    }

    return await db.transaction(async (tx) => {
      try {
        const now = dateISO()

        // 1. Проверить существование пользователя
        let user = await UserService.getByUsername(locals.username!, tx, logger)
        if (!user) {
          ErrorMap.username = 'user_not_found'

          // Моковый пользователь
          user = {
            id: crypto.randomUUID(),
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

      }
      catch (err) {
        logger.error('Sign-Up Error', { err })
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
