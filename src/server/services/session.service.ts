import type { Session } from "~/shared/dto/session.dto";
import { db } from "~/server/database/client";
import { sessionTable } from "../database/schema";
import { eq } from "drizzle-orm";


export const SessionService = {
  async getList(): Promise<Session[]> {
    return await db
      .select()
      .from(sessionTable)
  },

  async getById(sessionId: string): Promise<Session | null> {
    const [session] = await db
      .select()
      .from(sessionTable)
      .where(
        eq(sessionTable.id, sessionId),
      )

    return session ?? null
  },

  async getByUserId(userId: string): Promise<Session | null> {
    const [session] = await db
      .select()
      .from(sessionTable)
      .where(
        eq(sessionTable.userId, userId),
      )

    return session ?? null
  },

  async getByAccessTokenId(accessTokenId: string): Promise<Session | null> {
    const [session] = await db
      .select()
      .from(sessionTable)
      .where(
        eq(sessionTable.accessTokenId, accessTokenId),
      )
    return session ?? null
  },

  async terminateAllSession(): Promise<boolean> {
    try {
      await db
        .update(sessionTable)
        .set({
          status: 'TERMINATED'
        })
    }
    catch (err) {
      console.error(err)
      return false
    }
  }
}
