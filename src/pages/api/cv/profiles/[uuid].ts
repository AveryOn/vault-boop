import type { APIRoute } from 'astro'
import { HttpStatusCode } from 'axios'
import { eq } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { cvProfileTable } from '~/server/database/schema/cv-profile'
import { ZodBundleErrors } from '~/server/plugins/zod.plugin'
import { CvProfileService } from '~/server/services/admin/cv/profile.service'
import { _ } from '~/shared/const'
import { updateCvProfileDto } from '~/shared/dto/cv/profile.dto'
import { Logger } from '~/shared/logger/logger.client'

// Получить профиль по его ID
export const GET: APIRoute = async ({ params, url }) => {
  const logger = new Logger('HTTP:GET:PROFILE:GET_BY_ID')
  const uuid = params.uuid
  logger.info(_, { uuid, url })

  if (!uuid) {
    return Response.json(
      { error: 'Profile uuid is required' },
      { status: HttpStatusCode.BadRequest },
    )
  }

  const [profile] = await db
    .select()
    .from(cvProfileTable)
    .where(eq(cvProfileTable.id, uuid))

  if (!profile) {
    return Response.json({ error: 'Profile not found' }, { status: 404 })
  }

  return Response.json({ data: profile })
}

export const PATCH: APIRoute = async ({ params, request }) => {
  const logger = new Logger('HTTP:PATCH:UPDATE_CV_PROFILE')
  try {
    const uuid = params.uuid

    if (!uuid) {
      return Response.json(
        { error: 'Profile uuid is required' },
        { status: 400 },
      )
    }

    const body = await request.json()
    logger.info('Excludes request body', { body })

    const { success, data, error } = updateCvProfileDto.safeParse(
      body?.data,
    )

    if (!success) {
      logger.error(_, { error })
      return Response.json(
        { error: ZodBundleErrors(error) },
        { status: 400 },
      )
    }

    const profile = await CvProfileService.getById(uuid)
    if (!profile) {
      return Response.json(
        { error: 'Profile not found' },
        { status: 404 },
      )
    }

    const updatedProfile = await CvProfileService.update(uuid, data)

    return Response.json({ data: updatedProfile })
  } catch (err) {
    logger.error(_, { err })
    throw err
  }
}

export const DELETE: APIRoute = async ({ params }) => {
  const uuid = params.uuid

  if (!uuid) {
    return Response.json(
      { error: 'Profile uuid is required' },
      { status: 400 },
    )
  }

  await db.delete(cvProfileTable).where(eq(cvProfileTable.id, uuid))

  return Response.json({ ok: true })
}
