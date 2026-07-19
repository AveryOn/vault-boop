import { db, type DatabaseTransaction } from "~/server/database/client";
import { accessTokenTable, sessionTable } from "~/server/database/schema";
import { and, eq } from "drizzle-orm";
import { dateISO } from "~/shared/utils/datetime";
import type { AccessToken, AccessTokenPayload, CreateAccessTokenDto, CreateAccessTokenSecureDto, GetTokenActiveByUser } from "~/shared/dto/access-token.dto";
import { decryptData, encryptData } from "~/server/utils/crypto";
import { SelectDatabaseAdapter } from "../database/helpers";
import { SessionStatus } from "~/shared/const";


export const AccessTokenRepo = {
  async getList(): Promise<AccessToken[]> {
    return await db
      .select()
      .from(accessTokenTable)
  },

  async getById(accessTokenId: string): Promise<AccessToken | null> {
    const [accessToken] = await db
      .select()
      .from(accessTokenTable)
      .where(
        eq(accessTokenTable.id, accessTokenId),
      )

    return accessToken ?? null
  },

  async getByParams(params: GetTokenActiveByUser, tx?: DatabaseTransaction): Promise<AccessToken | null> {
    const database = SelectDatabaseAdapter(db, tx)

    const [{ token }] = await database
      .select({
        token: accessTokenTable,
      })
      .from(accessTokenTable)
      .innerJoin(
        sessionTable,
        and(
          eq(sessionTable.accessTokenId, accessTokenTable.id),
          eq(sessionTable.status, SessionStatus.ACTIVE),
        )
      )
      .where(
        and(
          eq(accessTokenTable.id, params.tokenId),
          eq(accessTokenTable.userId, params.userId),
          eq(sessionTable.userId, params.userId),
        )
      )

    return token ?? null
  },

  async create(
    secureData: CreateAccessTokenSecureDto,
    dto: CreateAccessTokenDto
  ): Promise<AccessToken> {
    const now = dateISO()
    const [accessToken] = await db
      .insert(accessTokenTable)
      .values({
        token: dto.token,
        userId: secureData.userId,
        createdAt: now,
        archivedAt: null,
      })
      .returning()

    return accessToken;
  },

  async archive(accessTokenId: string): Promise<boolean> {
    const now = dateISO()
    try {
      await db
        .update(accessTokenTable)
        .set({
          archivedAt: now,
        })
        .where(
          eq(accessTokenTable.id, accessTokenId),
        )
      return true
    }
    catch (err) {
      console.error(err)
      return false
    }
  },

  async generateAccessToken(payload: AccessTokenPayload) {
    return await encryptData(JSON.stringify(payload), 'access')
  },

  async decodeAccessToken(cipher: string): Promise<AccessTokenPayload> {
    try {
      const raw = await decryptData(cipher, 'access')
      return JSON.parse(raw)
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
