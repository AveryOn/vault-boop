

import { userActionTable, userKeyTable, userTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import { dateISO } from '~/shared/utils/datetime'
import { serverEnv as env } from '~/server/config/env/env.server';
import { eq } from 'drizzle-orm';
import type { CreateUserKeyDto, CreateUserKeySecureDto, UpdateUserKeyDto, UserKeySafety } from '~/shared/dto/user-key.dto';
import type { CreateUserActionDto, CreateUserActionSecureDto, UserAction, UserActionSafety } from '~/shared/dto/user-action.dto';

export const UserActionService = {
  async getList(): Promise<UserActionSafety[]> {
    return await db
      .select({
        id: userActionTable.id,
        createdAt: userActionTable.createdAt,
        actionId: userActionTable.actionId,
      })
      .from(userActionTable)
  },

  async getById(userActionId: string): Promise<UserActionSafety | null> {
    const [userAction] = await db
      .select({
        id: userActionTable.id,
        createdAt: userActionTable.createdAt,
        actionId: userActionTable.actionId,
      })
      .from(userActionTable)
      .where(
        eq(userActionTable.id, userActionId)
      )
    return userAction ?? null
  },

  async create(secureData: CreateUserActionSecureDto, dto: CreateUserActionDto): Promise<UserKeySafety> {
    const now = dateISO()
    const [newUserAction] = await db
      .insert(userActionTable)
      .values({
        actionId: dto.actionId,
        userId: secureData.userId,
        createdAt: now,
      })
      .returning({
        id: userActionTable.id,
        createdAt: userActionTable.createdAt,
        actionId: userActionTable.actionId,
      })

    return newUserAction
  },

  async update(dto: UpdateUserKeyDto): Promise<UserKeySafety> {

  },

  async delete(keyId: string): Promise<boolean> {

  }
}
