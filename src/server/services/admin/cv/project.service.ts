import { cvProjectTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { Project } from '~/shared/dto/cv/projects.dto'

export const CvProjectService = {
  async getList(): Promise<Project[]> {
    return await db.select().from(cvProjectTable)
  },
}
