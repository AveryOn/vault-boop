import z from 'zod'
import type { cvExperienceTable } from '~/server/database/schema'

export type Experience = typeof cvExperienceTable.$inferSelect
export type ExperienceInput = typeof cvExperienceTable.$inferInsert

export const createCvExperienceDto = z.object({
  profileId: z.uuid(),
  company: z.string().trim().min(1),
  position: z.string().trim().min(1),
  description: z.string().trim().min(1),
  location: z.string().trim().min(1).nullable(),
  employmentTypeId: z.uuid(),
  startDate: z.string().min(1),
  endDate: z.string().trim().min(1).nullable(),
  isCurrent: z.boolean().default(false),
})
export type CreateExperienceDto = z.infer<typeof createCvExperienceDto>

export interface CreateExperienceResponse {
  newExperience: Experience,
  shiftedExperiences: {
    id: string,
    order: number,
  }[]
}
