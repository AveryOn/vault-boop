import { cvVersionTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { Version } from '~/shared/dto/cv/version.dto'

export const CvVersionService = {
  async getList(): Promise<Version[]> {
    return await db.select().from(cvVersionTable)
  },
}
