

import { userActionTable, userKeyTable, userTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import { dateISO } from '~/shared/utils/datetime'
import { serverEnv as env } from '~/server/config/env/env.server';
import { eq } from 'drizzle-orm';
import type { CreateUserKeyDto, CreateUserKeySecureDto, UpdateUserKeyDto, UserKeySafety } from '~/shared/dto/user-key.dto';
import type { UserAction, UserActionSafety } from '~/shared/dto/user-action.dto';

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

  async getById(keyId: string): Promise<UserKeySafety> {

  },

  async create(secureData: CreateUserKeySecureDto, dto: CreateUserKeyDto): Promise<UserKeySafety> {

  },

  async update(dto: UpdateUserKeyDto): Promise<UserKeySafety> {

  },

  async delete(keyId: string): Promise<boolean> {

  }
}
