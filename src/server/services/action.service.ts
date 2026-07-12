import { db } from "~/server/database/client";
import { actionTable } from "../database/schema";
import { eq } from "drizzle-orm";
import type { Action, CreateActionDto } from "~/shared/dto/action.dto";
import { dateISO } from "~/shared/utils/datetime";


export const ActionService = {
  async getList(): Promise<Action[]> {
    return await db
      .select()
      .from(actionTable)
  },

  async getById(actionId: string): Promise<Action | null> {
    const [action] = await db
      .select()
      .from(actionTable)
      .where(
        eq(actionTable.id, actionId),
      )

    return action ?? null
  },

  async create(dto: CreateActionDto): Promise<Action> {
    const now = dateISO()
    const [action] = await db
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

  async delete(actionId: string): Promise<boolean> {
    const now = dateISO()
    try {
      await db
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
