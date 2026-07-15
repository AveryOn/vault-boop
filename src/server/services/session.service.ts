import type { CreateSessionDto, GetSessionByStatus, Session, TerminateAllSessionsDto } from "~/shared/dto/session.dto";
import { db as database, type DatabaseTransaction } from "~/server/database/client";
import { sessionTable } from "../database/schema";
import { and, eq } from "drizzle-orm";
import { SessionStatus } from "~/shared/const";
import { dateISO, getExpiresAt } from "~/shared/utils/datetime";
import { serverEnv as env } from "~/server/config/env";
import { SelectDatabaseAdapter } from "~/server/database/helpers";


export const SessionService = {
  async create(dto: CreateSessionDto, tx?: DatabaseTransaction): Promise<Session> {
    const db = SelectDatabaseAdapter(database, tx)
    const now = dateISO()
    const [session] = await db
      .insert(sessionTable)
      .values({
        accessTokenId: null,
        createdAt: now,
        expiresAt: getExpiresAt(env.SESSION_TTL, new Date(now)),
        lastUsedAt: now,
        lastUserActionId: dto.lastUserActionId,
        userId: dto.userId,
        status: SessionStatus.ACTIVE,
      })
      .returning()

    return session
  },

  async getList(tx?: DatabaseTransaction): Promise<Session[]> {
    const db = SelectDatabaseAdapter(database, tx)
    return await db
      .select()
      .from(sessionTable)
  },

  async getById(sessionId: string, tx?: DatabaseTransaction): Promise<Session | null> {
    const db = SelectDatabaseAdapter(database, tx)
    const [session] = await db
      .select()
      .from(sessionTable)
      .where(
        eq(sessionTable.id, sessionId),
      )

    return session ?? null
  },

  async getByUserId(userId: string, tx?: DatabaseTransaction): Promise<Session[]> {
    const db = SelectDatabaseAdapter(database, tx)
    const session = await db
      .select()
      .from(sessionTable)
      .where(
        eq(sessionTable.userId, userId),
      )
    return session
  },

  async getByStatus(dto: GetSessionByStatus, tx?: DatabaseTransaction): Promise<Session[]> {
    const db = SelectDatabaseAdapter(database, tx)
    const sessions = await db
      .select()
      .from(sessionTable)
      .where(
        and(
          eq(sessionTable.userId, dto.userId),
          eq(sessionTable.status, dto.status),
        )
      )
    return sessions
  },

  async getByAccessTokenId(accessTokenId: string, tx?: DatabaseTransaction): Promise<Session | null> {
    const db = SelectDatabaseAdapter(database, tx)
    const [session] = await db
      .select()
      .from(sessionTable)
      .where(
        eq(sessionTable.accessTokenId, accessTokenId),
      )
    return session ?? null
  },

  /** Принудительное завершение всех сессий для пользователя */
  async terminateAll(dto: TerminateAllSessionsDto, tx?: DatabaseTransaction): Promise<boolean> {
    try {
      const db = SelectDatabaseAdapter(database, tx)
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

  async terminate(sessionId: string, tx?: DatabaseTransaction): Promise<boolean> {
    try {
      const db = SelectDatabaseAdapter(database, tx)
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
