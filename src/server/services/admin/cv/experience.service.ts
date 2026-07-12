import { cvExperienceTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { CreateExperienceDto, CreateExperienceResponse, Experience } from '~/shared/dto/cv/experience.dto'
import type { Logger } from '~/shared/logger/logger.client'
import { dateISO } from '~/shared/utils/datetime'
import { and, eq } from 'drizzle-orm'

export const CvExperienceService = {
  async getList(): Promise<Experience[]> {
    return await db.select().from(cvExperienceTable)
  },

  async create(dto: CreateExperienceDto, logger?: Logger): Promise<CreateExperienceResponse> {
    return await db.transaction(async (tx) => {
      const now = dateISO()

      logger?.info('TRANSACTION', { now })
      logger?.info('Conflict Row Check')

      const [existingExperience] = await tx
        .select()
        .from(cvExperienceTable)
        .where(
          and(
            eq(cvExperienceTable.profileId, dto.profileId),
            eq(cvExperienceTable.company, dto.company)
          )
        )
        .limit(1)

      // Если такой опыт уже существует для этого профиля
      if (existingExperience) {
        logger?.error('[CONFLICT] Such a experience already exists', {
          profileId: existingExperience.profileId,
          company: existingExperience.company
        })
        throw new Error('Conflict', { cause: 'Such a experience already exists' })
      }

      logger?.info(`Get list by Profile ${dto.profileId}:: PENDING`)

      const experiencesOnProfile = await tx
        .select({
          order: cvExperienceTable.order,
          id: cvExperienceTable.id,
        })
        .from(cvExperienceTable)
        .where(
          eq(cvExperienceTable.profileId, dto.profileId),
        )

      logger?.info(`Get list by Profile ${dto.profileId}:: COMPLETE`, { count: experiencesOnProfile.length })


      logger?.info('Reorder experiences:: PENDING')
      const shiftedExperiences = experiencesOnProfile.map((e) => {
        e.order += 1
        return e
      })
      logger?.info('Reorder experiences:: COMPLETE', { shiftedLinks: shiftedExperiences })


      // Фиксирование индексов порядка для всех остальных experience в профиле
      logger?.info('Reorder experiences COMMIT:: PENDING')
      for (const e of experiencesOnProfile) {
        await tx
          .update(cvExperienceTable)
          .set({
            order: e.order
          })
          .where(eq(cvExperienceTable.id, e.id))
      }
      logger?.info('Reorder experiences COMMIT:: COMPLETE')


      logger?.info('Create new experience:: PENDING')
      const [newExperience] = await tx
        .insert(cvExperienceTable)
        .values({
          company: dto.company,
          description: dto.description,
          position: dto.position,
          profileId: dto.profileId,
          startDate: dto.startDate,
          endDate: dto.endDate,
          location: dto.location,
          employmentTypeId: dto.employmentTypeId,
          order: 1,
          isCurrent: dto.isCurrent,
          updatedAt: now,
          createdAt: now,
        })
        .returning()

      logger?.info('Create new experience:: COMPLETE', {
        newExperienceId: newExperience.id,
        newExperienceCompany: newExperience.company,
      })

      return { newExperience, shiftedExperiences }
    })
  },
}
