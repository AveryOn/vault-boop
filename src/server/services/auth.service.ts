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

export const AuthService = {

  async validateAuthContext(locals: App.Locals) {
    return await db.transaction(async (tx) => {
      try {
        // 1. Проверить существование пользователя
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
