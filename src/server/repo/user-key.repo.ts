import { userKeyTable, userTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import { dateISO } from '~/shared/utils/datetime'
import { serverEnv as env } from '~/server/config/env/env.server';
import { eq } from 'drizzle-orm';
import type { CreateUserKeyDto, CreateUserKeySecureDto, UpdateUserKeyDto, UserKeySafety } from '~/shared/dto/user-key.dto';
import type { Logger } from '~/shared/logger/logger.client';
import { ProcessStatus } from '~/shared/const';

export const UserKeyRepo = {
  async getList(logger: Logger): Promise<UserKeySafety[]> {
    try {
      logger.info('get list from db:: ' + ProcessStatus.PENDING)
      const rows = await db
        .select({
          id: userKeyTable.id,
          name: userKeyTable.name,
          userActionId: userKeyTable.userActionId,
          createdAt: userKeyTable.createdAt,
          updatedAt: userKeyTable.updatedAt,
        })
        .from(userTable)
      logger.info('get list from db:: ' + ProcessStatus.COMPLETE)
      return rows
    }
    catch (err) {
      logger.error('get list from db:: ' + ProcessStatus.ERROR, { err })
      throw err
    }
  },

  async getById(keyId: string): Promise<UserKeySafety> {
    const [key] = await db
      .select({
        id: userKeyTable.id,
        name: userKeyTable.name,
        userActionId: userKeyTable.userActionId,
        createdAt: userKeyTable.createdAt,
        updatedAt: userKeyTable.updatedAt,
      })
      .from(userKeyTable)
      .where(
        eq(userKeyTable.id, keyId),
      )

    return key
  },

  async create(secureData: CreateUserKeySecureDto, dto: CreateUserKeyDto): Promise<UserKeySafety> {
    const now = dateISO()
    const [key] = await db
      .insert(userKeyTable)
      .values({
        //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        keyHash: dto.key + env.DATA_HASH_KEY,//  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        name: dto.name,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        userActionId: secureData.userActionId,
        userId: secureData.userId,
      })
      .returning({
        id: userKeyTable.id,
        name: userKeyTable.name,
        userActionId: userKeyTable.userActionId,
        createdAt: userKeyTable.createdAt,
        updatedAt: userKeyTable.updatedAt,
      })

    return key
  },

  async update(dto: UpdateUserKeyDto): Promise<UserKeySafety> {
    const now = dateISO()
    const [key] = await db
      .update(userKeyTable)
      .set({
        name: dto.name,
        //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        keyHash: dto.key, //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        updatedAt: now,
      })
      .returning({
        id: userKeyTable.id,
        name: userKeyTable.name,
        userActionId: userKeyTable.userActionId,
        createdAt: userKeyTable.createdAt,
        updatedAt: userKeyTable.updatedAt,
      })
    return key;
  },

  async delete(keyId: string): Promise<boolean> {
    try {
      const now = dateISO()
      await db
        .update(userKeyTable)
        .set({
          deletedAt: now,
        })
        .where(
          eq(userKeyTable.id, keyId)
        )
      return true
    }
    catch (err) {
      console.error(err)
      return false
    }
  }
}
