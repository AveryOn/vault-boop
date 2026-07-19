import type { GetTokenActiveByUser } from "~/shared/dto/access-token.dto";
import type { DatabaseTransaction } from "~/server/database/client";
import type { Logger } from "~/shared/logger/logger.client";
import { AccessTokenRepo } from "~/server/repo/access-token.repo";

export const AccessTokenService = {

  async getActiveByUser(
    params: GetTokenActiveByUser,
    tx?: DatabaseTransaction,
    logger?: Logger
  ) {
    try {
      const token = AccessTokenRepo.getByParams(params, tx)
      if (!token) {
        logger?.error('AccessToken with such params is not found: ERROR')
        return null
      }
      return token
    }
    catch (err) {
      logger?.error('Get AccessToken By Params: ERROR', { err })
      return null
    }
  }

}
