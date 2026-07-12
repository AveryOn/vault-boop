// import type { APIRoute } from 'astro'
// import {
//   Logger,
//   type LoggerDetails,
// } from '~/shared/logger/logger.client'
// import { _, CookieName } from '~/shared/const'
// import { HttpStatusCode } from 'axios'
// import { throwZodError } from '~/server/plugins/zod.plugin'
// import { UserActionService, UserKeyService } from '~/server/services'
// import { createUserKeyDto } from '~/shared/dto/user-key.dto'
// import { db } from '~/server/database/client'

// export const POST: APIRoute = async ({ request, cookies }) => {
//   const logger = new Logger('HTTP:POST:Auth.Sign-Up')

//   const body = await request.json()
//   logger.info('Pick up BODY', { body: body.data })

//   const { success, data, error } = createUserKeyDto.safeParse(body.data)

//   if (!success) {
//     logger.error('Validation Failed', { error })
//     throwZodError(error, logger, 'Validation Error')
//   }

//   const result = db.transaction(async (tx) => {

//     UserActionService.create({
//       userId:
//     })
//     const newRecord = await UserKeyService.create({
//       userActionId
//     }, logger)
//   })


//   return Response.json(
//     { data: newRecord },
//     { status: HttpStatusCode.Created },
//   )
// }
