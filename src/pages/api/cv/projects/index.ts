import type { APIRoute } from 'astro'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { _ } from '~/shared/const'
import { CvProjectService } from '~/server/services/admin/cv/project.service'

export const GET: APIRoute = async () => {
  const logger = new Logger('HTTP:GET:Projects.GET_LIST')
  try {
    // GET LIST
    logger.info('request projects list')
    const projects = await CvProjectService.getList()

    logger.info('GET: projects', { count: projects.length })

    return Response.json({ data: projects })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}
