import { cvEmploymentTypeTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { EmploymentType } from '~/shared/dto/cv/employment-type.dto'

export const CvEmploymentTypeService = {
  async getList(): Promise<EmploymentType[]> {
    return await db.select().from(cvEmploymentTypeTable)
  },
}
