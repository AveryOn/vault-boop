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
import { signUpDto } from '~/shared/dto/auth.dto'

export const POST: APIRoute = async ({ request, cookies }) => {
  const logger = new Logger('HTTP:POST:Auth.Sign-Up')

  const body = await request.json()
  logger.info('Pick up BODY', { body: body })

  const { success, data, error } = signUpDto.safeParse(body)

  if (!success) {
    logger.error('Validation Failed', { error })
    throwZodError(error, logger, 'Validation Error')
  }
  logger.debug('TEST', { data })

  User

  // const result = db.transaction(async (tx) => {

  //   UserActionService.create({
  //     userId:
  //   })
  //   const newRecord = await UserKeyService.create({
  //     userActionId
  //   }, logger)
  // })


  return Response.json(
    { data: {} },
    { status: HttpStatusCode.Created },
  )
}
