import type { APIRoute } from 'astro'
import {
  Logger,
} from '~/shared/logger/logger.client'
import { _ } from '~/shared/const'
import { HttpStatusCode } from 'axios'
import { throwZodError } from '~/server/plugins/zod.plugin'
import { signUpDto } from '~/shared/dto/auth.dto'
// import { SignupUseCase } from '~/server/use-cases/signup.user-case'

export const POST: APIRoute = async ({ request }) => {
  const logger = new Logger('HTTP:POST:Auth.Sign-Up')

  const body = await request.json()
  logger.info('Pick up BODY', { body: body })

  const { success, data, error } = signUpDto.safeParse(body)

  if (!success) {
    logger.error('Validation Failed', { error })
    throwZodError(error, logger, 'Validation Error')
  }
  logger.debug('TEST', { data })

  if (!data) throw new Error('DATA IS NOT DEFINED')
  await SignupUseCase.createUserKey({
    firstName: data?.firstName,
    lastName: data?.lastName,
    password: data?.password,
    username: data?.username,
  }, logger)


  return Response.json(
    { data: {} },
    { status: HttpStatusCode.Created },
  )
}
