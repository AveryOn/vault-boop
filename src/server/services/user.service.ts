import { userTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { CreateUserDto, CreateUserResponse, UpdateUserDto, UpdateUserResponse, User } from '~/shared/dto/user.dto'
import { dateISO } from '~/shared/utils/datetime'
import { serverEnv as env } from '~/server/config/env/env.server';
import { eq } from 'drizzle-orm';

export const UserService = {
  async getList(): Promise<User[]> {
    return await db.select().from(userTable)
  },

  async create(data: CreateUserDto): Promise<CreateUserResponse> {
    const now = dateISO()
    const [user] = await db
      .insert(userTable)
      .values({
        id: crypto.randomUUID(),
        firstName: data.firstName,
        lastName: data.lastName,
        //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        masterPasswordHash: data.password + env.HASH_kEY, //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        username: data.username,
        updatedAt: now,
        createdAt: now,
        deletedAt: null,
      })
      .returning()

    Reflect.deleteProperty(user, 'masterPasswordHash')
    Reflect.deleteProperty(user, 'username')
    return user
  },

  async update(userId: string, data: UpdateUserDto): Promise<UpdateUserResponse> {
    const now = dateISO()
    const [user] = await db
      .update(userTable)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        masterPasswordHash: data.password && data.password + env.HASH_kEY, //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        updatedAt: now,
      })
      .where(eq(userTable.id, userId))
      .returning()

    Reflect.deleteProperty(user, 'masterPasswordHash')
    Reflect.deleteProperty(user, 'username')
    return user
  },

}
