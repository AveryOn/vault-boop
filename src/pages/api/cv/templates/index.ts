import type { APIRoute } from 'astro'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { _ } from '~/shared/const'
import { CvTemplateService } from '~/server/services/admin/cv/template.service'

export const GET: APIRoute = async () => {
  const logger = new Logger('HTTP:GET:Template.GET_LIST')
  try {
    // GET LIST
    logger.info('request templates list')
    const templates = await CvTemplateService.getList()

    logger.info('GET: templates', { count: templates.length })

    return Response.json({ data: templates })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}
