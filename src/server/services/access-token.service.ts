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
      AccessTokenRepo.
    }
    catch (err) {
      logger?.error('Get AccessToken By Params: ERROR', { err })
      return null
    }
  }

}
