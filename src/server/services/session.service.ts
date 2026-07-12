import type { Session, TerminateAllSessionsDto } from "~/shared/dto/session.dto";
import { db } from "~/server/database/client";
import { sessionTable } from "../database/schema";
import { and, eq } from "drizzle-orm";
import { SessionStatus } from "~/shared/const";


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

  /** Принудительное завершение всех сессий для пользователя */
  async terminateAllSession(dto: TerminateAllSessionsDto): Promise<boolean> {
    try {
      await db
        .update(sessionTable)
        .set({
          status: SessionStatus.TERMINATED,
        })
        .where(
          eq(sessionTable.userId, dto.userId),
        )
      return true
    }
    catch (err) {
      console.error(err)
      return false
    }
  },

  async terminateSession(sessionId: string): Promise<boolean> {
    try {
      await db
        .update(sessionTable)
        .set({
          status: SessionStatus.TERMINATED,
        })
        .where(
          eq(sessionTable.id, sessionId),
        )
      return true
    }
    catch (err) {
      console.error(err)
      return false
    }
  }
}
