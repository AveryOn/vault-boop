import { userKeyTable, userTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { CreateUserDto, CreateUserResponse, UpdateUserDto, UpdateUserResponse, UserSafety } from '~/shared/dto/user.dto'
import { dateISO } from '~/shared/utils/datetime'
import { serverEnv as env } from '~/server/config/env/env.server';
import { eq } from 'drizzle-orm';
import type { CreateUserKeyDto, CreateUserKeySecureDto, UserKey, UserKeySafety } from '~/shared/dto/user-key.dto';

export const UserKeyService = {
  async getList(): Promise<UserKeySafety[]> {
    return await db
      .select({
        id: userKeyTable.id,
        name: userKeyTable.name,
        userActionId: userKeyTable.userActionId,
        createdAt: userKeyTable.createdAt,
        updatedAt: userKeyTable.updatedAt,
      })
      .from(userTable)
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
        keyHash: dto.key + env.HASH_kEY,
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
  }

}
