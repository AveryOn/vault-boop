import type { APIRoute } from 'astro'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { _ } from '~/shared/const'
import { CvExperienceService } from '~/server/services/admin/cv/experience.service'
import { createCvExperienceDto } from '~/shared/dto/cv/experience.dto'
import { throwZodError } from '~/server/plugins/zod.plugin'
import { HttpStatusCode } from 'axios'

export const GET: APIRoute = async () => {
  const logger = new Logger('HTTP:GET:Experience.GET_LIST')
  try {
    // GET LIST
    logger.info('request experience list')
    const experiences = await CvExperienceService.getList()

    logger.info('GET: experience', { count: experiences.length })

    return Response.json({ data: experiences })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}

export const POST: APIRoute = async ({ request }) => {
  const logger = new Logger('HTTP:POST:Experience.Create')

  const body = await request.json()
  logger.info('Pick up BODY', { body: body.data })
  const { success, data, error } = createCvExperienceDto.safeParse(
    body.data,
  )

  if (!success) {
    logger.error('Validation Failed', { error })
    throwZodError(error, logger, 'Validation Error')
  }
  const newRecord = await CvExperienceService.create(data!, logger)

  return Response.json(
    { data: newRecord },
    { status: HttpStatusCode.Created },
  )
}
