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
        logger?.error('User with such username is not found', { status: HttpStatusCode.NotFound })
        return null
      }

      return session ?? null
    }
    catch (err) {
      logger?.error('Get User By Username: ERROR', { err })
      return null
    }
  }
}
