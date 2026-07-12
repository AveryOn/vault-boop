import { cvProfileTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import { desc, eq } from 'drizzle-orm'
import type {
  CreateCvProfileDto,
  Profile,
  UpdateCvProfileDto,
} from '~/shared/dto/cv/profile.dto'
import { dateISO } from '~/shared/utils/datetime'

export const CvProfileService = {
  async getById(uuid: string): Promise<Profile | null> {
    const [profile] = await db
      .select()
      .from(cvProfileTable)
      .where(eq(cvProfileTable.id, uuid))
      .limit(1)

    return profile ?? null
  },

  async getList(): Promise<Profile[]> {
    return await db.select().from(cvProfileTable)
  },

  async getActive(): Promise<Profile[]> {
    const profiles = await db
      .select()
      .from(cvProfileTable)
      .where(eq(cvProfileTable.isActive, true))
      .orderBy(desc(cvProfileTable.createdAt))

    return profiles
  },

  async create(data: CreateCvProfileDto): Promise<Profile> {
    const now = dateISO()
    const [profile] = await db
      .insert(cvProfileTable)
      .values({
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      .returning()
    return profile
  },

  async update(uuid: string, data: Partial<UpdateCvProfileDto>) {
    const now = dateISO()

    const [profile] = await db
      .update(cvProfileTable)
      .set({
        ...data,
        updatedAt: now,
      })
      .where(eq(cvProfileTable.id, uuid))
      .returning()
    return profile
  },
}
