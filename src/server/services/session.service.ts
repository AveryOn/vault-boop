import type { GetSessionByParams, Session } from "~/shared/dto/session.dto";
import type { DatabaseTransaction } from '~/server/database/client'
import type { Logger } from "~/shared/logger/logger.client";
import { SessionRepo } from "~/server/repo/session.repo";
import { HttpStatusCode } from "axios";



export const SessionService = {

  async getByParams(
    params: GetSessionByParams,
    tx?: DatabaseTransaction,
    logger?: Logger
  ): Promise<Session | null> {
    try {
      const session = await SessionRepo.getByTokenAndUser(params, tx)
      if (!session) {
        logger?.error('Session with such params is not found', { status: HttpStatusCode.NotFound })
        return null
      }

      return session ?? null
    }
    catch (err) {
      logger?.error('Get Session By Params: ERROR', { err })
      return null
    }
  },

  async getAllByUserId(
    userId: string,
    tx?: DatabaseTransaction,
    logger?: Logger
  ) {
    try {
      return await SessionRepo.getByUserId(userId, tx)

    }
    catch (err) {
      logger?.error('Get Sessions By UserID: ERROR', { err })
      return null
    }
  }
}
