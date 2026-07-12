import {
  cvProfileLinkTable,
  cvProfileTable,
} from '~/server/database/schema'
import { db } from '~/server/database/client'
import type {
  CreateCvLinkDto,
  CreateLinkResponse,
  Link,
  PatchCvLinkDto,
  ReorderLinksDto,
} from '~/shared/dto/cv/link.dto'
import { and, asc, eq } from 'drizzle-orm'
import { dateISO } from '~/shared/utils/datetime'
import type { Logger } from '~/shared/logger/logger.client'
import { HttpStatusCode } from 'axios'
import { ProcessStatus } from '~/shared/const'
// import { dateISO } from '~/shared/utils/datetime'

export const CvLinkService = {
  async getList(): Promise<Link[]> {
    return await db
      .select()
      .from(cvProfileLinkTable)
      .orderBy(asc(cvProfileLinkTable.order))
  },

  async create(
    dto: CreateCvLinkDto,
    logger?: Logger,
  ): Promise<CreateLinkResponse> {
    return await db.transaction(async (tx) => {
      const now = dateISO()

      logger?.info('TRANSACTION', { now })
      logger?.info('Conflict Row Check')

      const [existingLink] = await tx
        .select()
        .from(cvProfileLinkTable)
        .where(
          and(
            eq(cvProfileLinkTable.profileId, dto.profileId),
            eq(cvProfileLinkTable.label, dto.label),
          ),
        )
        .limit(1)

      // Если такая ссылка уже существует для этого профиля
      if (existingLink) {
        logger?.error('[CONFLICT] Such a link already exists', {
          profileId: existingLink.profileId,
          label: existingLink.label,
        })
        throw new Error('Conflict', {
          cause: 'Such a link already exists',
        })
      }

      logger?.info(`Get list by Profile ${dto.profileId}:: PENDING`)

      const linksOnProfile = await tx
        .select({
          order: cvProfileLinkTable.order,
          id: cvProfileLinkTable.id,
        })
        .from(cvProfileLinkTable)
        .where(eq(cvProfileLinkTable.profileId, dto.profileId))

      logger?.info(`Get list by Profile ${dto.profileId}:: COMPLETE`, {
        count: linksOnProfile.length,
      })

      logger?.info('Reorder links:: PENDING')
      const shiftedLinks = linksOnProfile.map((link) => {
        link.order += 1
        return link
      })
      logger?.info('Reorder links:: COMPLETE', { shiftedLinks })

      // Фиксирование индексов порядка для всех остальных link в профиле
      logger?.info('Reorder links COMMIT:: PENDING')
      for (const link of linksOnProfile) {
        await tx
          .update(cvProfileLinkTable)
          .set({
            order: link.order,
          })
          .where(eq(cvProfileLinkTable.id, link.id))
      }
      logger?.info('Reorder links COMMIT:: COMPLETE')

      logger?.info('Create new link:: PENDING')
      const [newLink] = await tx
        .insert(cvProfileLinkTable)
        .values({
          label: dto.label,
          profileId: dto.profileId,
          type: dto.type,
          url: dto.url,
          order: 1,
          isVisible: true,
          updatedAt: now,
          createdAt: now,
        })
        .returning()

      logger?.info('Create new link:: COMPLETE', {
        newLinkId: newLink.id,
        newLinkLabel: newLink.label,
      })

      return {
        newLink,
        shiftedLinks: shiftedLinks,
      }
    })
  },

  async patch(
    linkId: string,
    dto: PatchCvLinkDto,
    logger?: Logger,
  ): Promise<boolean> {
    return await db.transaction(async (tx) => {
      try {
        // Получение объекта ссылки
        logger?.info('Get Link by ID:: ' + ProcessStatus.PENDING)
        const [link] = await tx
          .select()
          .from(cvProfileLinkTable)
          .where(eq(cvProfileLinkTable.id, linkId))
          .limit(1)

        // Если ссылки с таким ID не существует
        if (!link) {
          logger?.info('Get Link by ID:: ' + ProcessStatus.ERROR, {
            status: HttpStatusCode.NotFound,
          })
          return false
        }
        logger?.info('Get Link by ID:: ' + ProcessStatus.COMPLETE)

        // Обновление объекта ссылки
        logger?.info('Patch Link:: ' + ProcessStatus.PENDING)
        await tx
          .update(cvProfileLinkTable)
          .set({ ...dto })
          .where(eq(cvProfileLinkTable.id, link.id))
          .returning()

        logger?.info('Patch Link:: ' + ProcessStatus.COMPLETE)
        return true
      } catch (err) {
        logger?.error(ProcessStatus.ERROR, { error: err })
        return false
      }
    })
  },

  async reorder(
    dto: ReorderLinksDto,
    logger?: Logger,
  ): Promise<boolean> {
    return await db.transaction(async (tx) => {
      try {
        logger?.info('Get Profile:: PENDING', {
          profileId: dto.profileId,
        })

        // GET PROFILE
        const [profile] = await tx
          .select()
          .from(cvProfileTable)
          .where(eq(cvProfileTable.id, dto.profileId))
          .limit(1)

        if (!profile) {
          logger?.error('Get Profile:: ERROR', {
            msg: 'Profile not found',
          })
          throw new Error('Profile not found')
        }
        logger?.info('Get Profile:: COMPLETE')

        logger?.info('Reorder Links:: PENDING')
        for (const link of dto.linksOrder) {
          await tx
            .update(cvProfileLinkTable)
            .set({
              order: link.order,
            })
            .where(eq(cvProfileLinkTable.id, link.id))
        }
        logger?.info('Reorder Links:: COMPLETE')
        return true
      } catch (err) {
        logger?.error('Reorder Error', { error: err })
        return false
      }
    })
  },
}
