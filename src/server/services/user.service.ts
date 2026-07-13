import { userTable } from '~/server/database/schema'
import { db as database, type DatabaseTransaction } from '~/server/database/client'
import type { CreateUserDto, CreateUserResponse, UpdateUserDto, UpdateUserResponse, User, UserSafety } from '~/shared/dto/user.dto'
import { dateISO } from '~/shared/utils/datetime'
import { serverEnv as env } from '~/server/config/env/env.server';
import { eq } from 'drizzle-orm';
import { SelectDatabaseAdapter } from '~/server/database/helpers';
import { _ } from '~/shared/const';

export const UserService = {
  async getList(tx?: DatabaseTransaction): Promise<UserSafety[]> {
    const db = SelectDatabaseAdapter(database, tx)
    return await db
      .select({
        id: userTable.id,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        deletedAt: userTable.deletedAt,
      })
      .from(userTable)
  },

  async getById(userId: string): Promise<UserSafety> {
    const [user] = await database
      .select({
        id: userTable.id,
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

  async getByUsername(
    username: string,
    tx?: DatabaseTransaction
  ): Promise<User | null> {
    const db = SelectDatabaseAdapter(database, tx)
    const [user] = await db
      .select({
        id: userTable.id,
        username: userTable.username,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        masterPasswordHash: userTable.masterPasswordHash,
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


  async create(data: CreateUserDto, tx?: DatabaseTransaction): Promise<CreateUserResponse> {
    const db = SelectDatabaseAdapter(database, tx)
    const now = dateISO()
    const [user] = await db
      .insert(userTable)
      .values({
        id: crypto.randomUUID(),
        firstName: data.firstName,
        lastName: data.lastName,
        //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        masterPasswordHash: data.password + env.DATA_HASH_KEY, //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        username: data.username,
        updatedAt: now,
        createdAt: now,
        deletedAt: null,
      })
      .returning({
        id: userTable.id,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        deletedAt: userTable.deletedAt,
      })

    return user
  },

  async update(userId: string, data: UpdateUserDto, tx?: DatabaseTransaction): Promise<UpdateUserResponse> {
    const db = SelectDatabaseAdapter(database, tx)
    const now = dateISO()
    const [user] = await db
      .update(userTable)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        masterPasswordHash: data.password && data.password + env.DATA_HASH_KEY, //  TODO ПОСТАВИТЬ РЕАЛЬНУЮ ЗАЩИТУ
        updatedAt: now,
      })
      .where(eq(userTable.id, userId))
      .returning({
        id: userTable.id,
        firstName: userTable.firstName,
        lastName: userTable.lastName,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        deletedAt: userTable.deletedAt,
      })
    return user
  },

  async delete(userId: string, tx?: DatabaseTransaction): Promise<boolean> {
    try {
      const db = SelectDatabaseAdapter(database, tx)
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
