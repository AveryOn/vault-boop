import type { APIRoute } from 'astro'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { _ } from '~/shared/const'
import { CvLanguageService } from '~/server/services/admin/cv/language.service'

export const GET: APIRoute = async () => {
  const logger = new Logger('HTTP:GET:Language.GET_LIST')
  try {
    // GET LIST
    logger.info('request language list')
    const languages = await CvLanguageService.getList()

    logger.info('GET: language', { count: languages.length })

    return Response.json({ data: languages })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}
