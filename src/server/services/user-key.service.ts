import { userKeyTable, userTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { CreateUserDto, CreateUserResponse, UpdateUserDto, UpdateUserResponse, UserSafety } from '~/shared/dto/user.dto'
import { dateISO } from '~/shared/utils/datetime'
import { serverEnv as env } from '~/server/config/env/env.server';
import { eq } from 'drizzle-orm';
import type { UserKey } from '~/shared/dto/user-key.dto';

export const UserKeyService = {
  async getList(): Promise<UserKey[]> {
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

}
