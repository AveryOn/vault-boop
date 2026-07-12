import { cvSkillTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { Skill } from '~/shared/dto/cv/skill.dto'

export const CvSkillService = {
  async getList(): Promise<Skill[]> {
    return await db.select().from(cvSkillTable)
  },
}
