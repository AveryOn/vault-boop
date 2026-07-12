import { cvLanguageTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { Language } from '~/shared/dto/cv/language.dto'

export const CvLanguageService = {
  async getList(): Promise<Language[]> {
    return await db.select().from(cvLanguageTable)
  },
}
