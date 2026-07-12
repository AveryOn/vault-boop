import type { APIRoute } from 'astro'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { _ } from '~/shared/const'
import { CvEmploymentTypeService } from '~/server/services/admin/cv/employment-type.service'

export const GET: APIRoute = async () => {
  const logger = new Logger('HTTP:GET:EmploymentType.GET_LIST')
  try {
    // GET LIST
    logger.info('request employmentType list')
    const employmentTypes = await CvEmploymentTypeService.getList()

    logger.info('GET: employmentTypes', {
      count: employmentTypes.length,
    })

    return Response.json({ data: employmentTypes })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}
