import { db, type DatabaseTransaction } from "~/server/database/client";
import { actionTable } from "~/server/database/schema";
import { eq } from "drizzle-orm";
import type { Action, CreateActionDto } from "~/shared/dto/action.dto";
import { dateISO } from "~/shared/utils/datetime";
import { SelectDatabaseAdapter } from "~/server/database/helpers";


export const ActionService = {
  async getList(tx?: DatabaseTransaction): Promise<Action[]> {
    const database = SelectDatabaseAdapter(db, tx)
    return await database
      .select()
      .from(actionTable)
  },

  async getById(actionId: string, tx?: DatabaseTransaction): Promise<Action | null> {
    const database = SelectDatabaseAdapter(db, tx)
    const [action] = await database
      .select()
      .from(actionTable)
      .where(
        eq(actionTable.id, actionId),
      )

    return action ?? null
  },

  async getByName(name: string, tx?: DatabaseTransaction): Promise<Action | null> {
    const database = SelectDatabaseAdapter(db, tx)
    const [action] = await database
      .select()
      .from(actionTable)
      .where(
        eq(actionTable.name, name),
      )

    return action ?? null
  },

  async create(dto: CreateActionDto, tx?: DatabaseTransaction): Promise<Action> {
    const database = SelectDatabaseAdapter(db, tx)
    const now = dateISO()
    const [action] = await database
      .insert(actionTable)
      .values({
        name: dto.name,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      })
      .returning()

    return action;
  },

  async delete(actionId: string, tx?: DatabaseTransaction): Promise<boolean> {
    const database = SelectDatabaseAdapter(db, tx)
    const now = dateISO()
    try {
      await database
        .update(actionTable)
        .set({
          deletedAt: now,
        })
        .where(
          eq(actionTable.id, actionId),
        )
      return true
    }
    catch (err) {
      console.error(err)
      return false
    }
  }
}
