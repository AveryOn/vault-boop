import type { APIRoute } from 'astro'
import { createCvProfileDto } from '~/shared/dto/cv/profile.dto'
import { CvProfileService } from '~/server/services/admin/cv/profile.service'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { throwZodError } from '~/server/plugins/zod.plugin'
import { _ } from '~/shared/const'
import { HttpStatusCode } from 'axios'

export const GET: APIRoute = async ({ url }) => {
  const logger = new Logger('HTTP:GET:Profile.GET_LIST_OR_ACTIVE')
  try {
    // GET IS ACTIVE
    const isActive = url.searchParams.get('isActive')
    if (isActive) {
      logger.info('request isActive profile')
      const profile = await CvProfileService.getActive()

      logger.info('Fetched Profile', { profile })
      return Response.json(
        { data: profile },
        { status: HttpStatusCode.Ok },
      )
    }

    // GET LIST
    logger.info('request profiles list')
    const profiles = await CvProfileService.getList()

    logger.info('GET: profiles', { count: profiles.length })

    return Response.json({ data: profiles })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}

export const POST: APIRoute = async ({ request }) => {
  const logger = new Logger('HTTP:POST:Profile.Create')

  const body = await request.json()
  logger.info('Pick up BODY', { body: body.data })
  const { success, data, error } = createCvProfileDto.safeParse(
    body.data,
  )

  if (!success) {
    logger.error('Validation Failed', { error })
    throwZodError(error, logger, 'Validation Error')
  }
  const newProfile = await CvProfileService.create(data!)

  return Response.json(
    { data: newProfile },
    { status: HttpStatusCode.Created },
  )
}
