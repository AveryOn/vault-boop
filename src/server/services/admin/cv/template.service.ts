import { cvTemplateTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { Template } from '~/shared/dto/cv/template.dto'

export const CvTemplateService = {
  async getList(): Promise<Template[]> {
    return await db.select().from(cvTemplateTable)
  },
}
