import { db } from "~/server/database/client";
import { accessTokenTable, actionTable } from "~/server/database/schema";
import { eq } from "drizzle-orm";
import type { Action, CreateActionDto } from "~/shared/dto/action.dto";
import { dateISO } from "~/shared/utils/datetime";
import type { AccessToken, CreateAccessTokenDto, CreateAccessTokenSecureDto } from "~/shared/dto/access-token.dto";


export const AccessTokenService = {
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
  }
}
