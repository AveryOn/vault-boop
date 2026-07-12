
import { userActionTable } from '~/server/database/schema'
import { db, type DatabaseTransaction } from '~/server/database/client'
import { dateISO } from '~/shared/utils/datetime'
import { eq } from 'drizzle-orm';
import type { CreateUserActionDto, CreateUserActionSecureDto, UserActionSafety } from '~/shared/dto/user-action.dto';
import { SelectDatabaseAdapter } from '~/server/database/helpers';

export const UserActionService = {
  async getList(tx?: DatabaseTransaction): Promise<UserActionSafety[]> {
    const database = SelectDatabaseAdapter(db, tx)
    return await database
      .select({
        id: userActionTable.id,
        createdAt: userActionTable.createdAt,
        actionId: userActionTable.actionId,
      })
      .from(userActionTable)
  },

  async getById(userActionId: string, tx?: DatabaseTransaction): Promise<UserActionSafety | null> {
    const database = SelectDatabaseAdapter(db, tx)
    const [userAction] = await database
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

  async create(
    secureData: CreateUserActionSecureDto,
    dto: CreateUserActionDto,
    tx?: DatabaseTransaction,
  ): Promise<UserActionSafety> {
    const database = SelectDatabaseAdapter(db, tx)
    const now = dateISO()
    const [newUserAction] = await database
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
}
