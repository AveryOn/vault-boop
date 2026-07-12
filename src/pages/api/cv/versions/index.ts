import type { APIRoute } from 'astro'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { _ } from '~/shared/const'
import { CvVersionService } from '~/server/services/admin/cv/version.service'

export const GET: APIRoute = async () => {
  const logger = new Logger('HTTP:GET:Version.GET_LIST')
  try {
    // GET LIST
    logger.info('request versions list')
    const versions = await CvVersionService.getList()

    logger.info('GET: versions', { count: versions.length })

    return Response.json({ data: versions })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}
