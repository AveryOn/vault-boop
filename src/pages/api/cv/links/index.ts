import type { APIRoute } from 'astro'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { _ } from '~/shared/const'
import { CvLinkService } from '~/server/services/admin/cv/link.service'
import { throwZodError } from '~/server/plugins/zod.plugin'
import { createCvLinkDto } from '~/shared/dto/cv/link.dto'
import { HttpStatusCode } from 'axios'

export const GET: APIRoute = async () => {
  const logger = new Logger('HTTP:GET:Links.GET_LIST')
  try {
    // GET LIST
    logger.info('request links list')
    const links = await CvLinkService.getList()

    logger.info('GET: projects', { count: links.length })

    return Response.json({ data: links })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}

export const POST: APIRoute = async ({ request }) => {
  const logger = new Logger('HTTP:POST:Link.Create')

  const body = await request.json()
  logger.info('Pick up BODY', { body: body.data })
  const { success, data, error } = createCvLinkDto.safeParse(body.data)

  if (!success) {
    logger.error('Validation Failed', { error })
    throwZodError(error, logger, 'Validation Error')
  }
  const newRecord = await CvLinkService.create(data!, logger)

  return Response.json(
    { data: newRecord },
    { status: HttpStatusCode.Created },
  )
}
