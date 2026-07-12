import { userTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { CreateUserDto, CreateUserResponse, UpdateUserDto, UpdateUserResponse, UserSafety } from '~/shared/dto/user.dto'
import { dateISO } from '~/shared/utils/datetime'
import { serverEnv as env } from '~/server/config/env/env.server';
import { eq } from 'drizzle-orm';

export const UserService = {
  async getList(): Promise<UserSafety[]> {
    return await db
      .select({
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        deletedAt: userTable.deletedAt,
      })
      .from(userTable)
  },

  async getById(userId: string): Promise<UserSafety> {
    const [user] = await db
      .select({
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        deletedAt: userTable.deletedAt,
      })
      .from(userTable)
      .where(
        eq(userTable.id, userId)
      )
    return user
  },

  async getByUsername(username: string): Promise<UserSafety | null> {
    const [user] = await db
      .select({
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        deletedAt: userTable.deletedAt,
      })
      .from(userTable)
      .where(
        eq(userTable.username, username)
      )
    return user ?? null
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
      .returning({
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        deletedAt: userTable.deletedAt,
      })

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
      .returning({
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        deletedAt: userTable.deletedAt,
      })
    return user
  },

  async delete(userId: string): Promise<boolean> {
    try {
      const now = dateISO()
      await db
        .update(userTable)
        .set({
          deletedAt: now,
        })
        .where(
          eq(userTable.id, userId),
        )
      return true
    }
    catch (err) {
      console.error(err)
      return false
    }
  }
}
