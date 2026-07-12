import type { APIRoute } from 'astro'
import {
  Logger,
  type LoggerDetails,
} from '~/shared/logger/logger.client'
import { _, CookieName } from '~/shared/const'
import { HttpStatusCode } from 'axios'
import { throwZodError } from '~/server/plugins/zod.plugin'
import { UserActionService, UserKeyService } from '~/server/services'
import { createUserKeyDto } from '~/shared/dto/user-key.dto'
import { db } from '~/server/database/client'

export const GET: APIRoute = async () => {
  const logger = new Logger('HTTP:GET:UserKey.GET_LIST')
  try {
    // GET LIST
    logger.info('request user-keys list')
    const rows = await UserKeyService.getList(logger)

    logger.info('GET: user-keys', { count: rows.length })

    return Response.json({ data: rows })
  } catch (err) {
    logger.error('ERROR', err as LoggerDetails)
    throw err
  }
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const logger = new Logger('HTTP:POST:UserKey.Create')


  logger.info('Excludes an accessToken from cookies')
  const accessToken = cookies.get(CookieName['accessToken'])?.value

  if (!accessToken) {
    logger.warn('Access Token is not found.', { status: HttpStatusCode.Unauthorized })
    return new Response(null, { status: HttpStatusCode.Unauthorized })
  }


  const body = await request.json()
  logger.info('Pick up BODY', { body: body.data })

  const { success, data, error } = createUserKeyDto.safeParse(body.data)

  if (!success) {
    logger.error('Validation Failed', { error })
    throwZodError(error, logger, 'Validation Error')
  }

  const result = db.transaction(async (tx) => {

    UserActionService.create({
      userId:
    })
    const newRecord = await UserKeyService.create({
      userActionId
    }, logger)
  })


  return Response.json(
    { data: newRecord },
    { status: HttpStatusCode.Created },
  )
}
