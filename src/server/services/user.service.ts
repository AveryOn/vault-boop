import type { Logger } from "~/shared/logger/logger.client"
import { UserRepo } from "~/server/repo/user.repo"
import type { DatabaseTransaction } from "~/server/database/client"
import { HttpStatusCode } from "axios"

export const UserService = {

  async getByUsername(username: string, tx?: DatabaseTransaction, logger?: Logger) {
    try {
      const user = await UserRepo.getByUsername(username, tx)
      if (!user) {
        logger?.error('User with such username is not found', { status: HttpStatusCode.NotFound })
        throw new Error('User with such username is not found')
      }
      return user
    }
    catch (err) {
      logger?.error('Get User By Username: ERROR', { err })
    }
  },
}
