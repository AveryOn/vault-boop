import type { APIRoute } from 'astro'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { _ } from '~/shared/const'
import { CvSkillService } from '~/server/services/admin/cv/skill.service'

export const GET: APIRoute = async () => {
  const logger = new Logger('HTTP:GET:Skill.GET_LIST')
  try {
    // GET LIST
    logger.info('request skills list')
    const skills = await CvSkillService.getList()

    logger.info('GET: skills', { count: skills.length })

    return Response.json({ data: skills })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}
