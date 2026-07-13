import { defineMiddleware } from 'astro:middleware'
import { ProcessStatus, SessionStatus } from '~/shared/const'
import { Logger } from '~/shared/logger/logger.client'
import { AccessTokenService, SessionService, UserService } from '~/server/services'
import { clientRoutes } from '~/shared/router/client.routes'
import { decryptData } from '../utils/crypto'
import type { AccessTokenPayload } from '~/shared/dto/access-token.dto'
import type { APIContext } from 'astro'
import type { Session } from '~/shared/dto/session.dto'
import { SessionUseCase } from '../use-cases/session.use-case'
import { AppRoutes } from '~/shared/router'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MiddlewareCtx = APIContext<Record<string, any>, Record<string, string | undefined>>

/**
 * Переход на страницу входа
 * @param ctx - контекст выполнения middleware
 */
function RedirectToSignIn(ctx: MiddlewareCtx): Response {
  return ctx.redirect(clientRoutes.SignIn)
}

/** Дешифрование токена доступа. Извлечение payload токена */
async function decryptAccessToken(accessToken: string, logger: Logger): Promise<AccessTokenPayload | null> {
  try {
    return JSON.parse(await decryptData(accessToken, 'access')) as AccessTokenPayload
  } catch (err) {
    logger.error('AccessToken decryption Error:: ' + ProcessStatus.ERROR, { err })
    return null
  }
}

export const AuthCheckMiddleware = defineMiddleware(
  async (ctx, next) => {
    const url = new URL(ctx.request.url)

    const logger = new Logger('MIDDLEWARE:AuthCheck:RUN')

    logger.info('[STAGE_1]:: Exclude the accessToken from cookies')
    // const accessToken = ctx.cookies.get(CookieName['accessToken'])?.value
    const accessToken = 'asdasd'

    if (!accessToken) {
      logger.warn('[STAGE_1]:: Access Token is not found!')
      return RedirectToSignIn(ctx)
    }
    else {
      logger.info('[STAGE_1]:: AccessToken is excluded from cookies', { accessToken })
    }


    // Проверка токена доступа:
    logger.info('[STAGE_2]:: Decryption the AccessToken. Exclude a payload')
    const tokenPayload: AccessTokenPayload | null = await decryptAccessToken(accessToken, logger)
    if (!tokenPayload) {
      logger.warn('[STAGE_2]:: Failed to exclude the token payload data')
      return RedirectToSignIn(ctx)
    }
    else {
      logger.info('[STAGE_2]:: Decryption Complete', { tokenPayload })
      logger.info('[STAGE_2]:: Check AccessToken by its ID')
      const tokenFromDb = await AccessTokenService.getById(tokenPayload.tokenId)
      if (!tokenFromDb) {
        logger.error('[STAGE_2]:: Token with such ID is not found in DB')
        logger.info('[STAGE_2]:: Redirect to: ' + AppRoutes.client.SignIn)
        return RedirectToSignIn(ctx)
      }
      if (!tokenFromDb?.archivedAt && tokenFromDb.token !== accessToken) {
        logger.error('[STAGE_2]:: The token from the cookie NOT matches the token from the Database')
      }
      else {
        logger.info('[STAGE_2]:: The token from the cookie matches the token from the Database')
      }

      logger.info('[STAGE_2]:: Compare UserId from the AccessToken with the UserId from the AccessTokenPayload')
      if (tokenFromDb.userId !== tokenPayload.userId) {
        logger.info('[STAGE_2]:: UserIds are not matches!', {
          cookiesTokenUserId: tokenPayload.userId,
          dbTokenUserId: tokenFromDb.userId,
        })
      }
    }

    // Проверка пользователя
    logger.info('[STAGE_3]:: Checks userId', { userId: tokenPayload.userId })
    const userFromDb = await UserService.getById(tokenPayload.userId)
    // Если пользователя с таким ID нет
    if (!userFromDb) {
      logger.error('[STAGE_3]:: User with such ID is not found in Database')
      logger.info('[STAGE_3]:: Redirect to: ' + AppRoutes.client.SignIn)
      return RedirectToSignIn(ctx)
    }

    // Проверка сессий пользователя
    logger.info('[STAGE_3]:: Fetch all sessions by UserId', { userId: tokenPayload.userId })
    const sessions = await SessionService.getByUserId(tokenPayload.userId)

    // Получение и проверка текущей сессии привязанной к токену доступа
    logger.info('[STAGE_3]:: Exclude Current session from sessions', { sessionId: tokenPayload.sessionId })

    const currentSession = sessions.find(s => s.id === tokenPayload.sessionId && s.userId === tokenPayload.userId) ?? null
    // Если по такому ID сессии не существует то это нарушение
    if (!currentSession) {
      logger.error('[STAGE_3]:: Violation: session with such ID is not found')
      return RedirectToSignIn(ctx)
    }

    //  Группировка сессий по статусу
    logger.info('[STAGE_4]:: Grouping By session statuses')

    type SessionMap = Record<keyof typeof SessionStatus, Session[]>
    const sessionsMap = sessions.reduce<SessionMap>((acc, session) => {
      acc[session.status as SessionStatus] ??= []
      acc[session.status as SessionStatus].push(session)

      return acc
    }, {} as SessionMap)

    logger.info('[STAGE_4]:: Grouping Complete', {
      ACTIVE: `${sessionsMap.ACTIVE.length} pc.`,
      TERMINATED: `${sessionsMap.TERMINATED.length} pc.`,
      EXPIRED: `${sessionsMap.EXPIRED.length} pc.`,
      PENDING: `${sessionsMap.PENDING.length} pc.`,
    })

    /*
     Если у пользователя неожиданное состояние сессий (когда есть и ACTIVE и PENDING сессии)
     то делаем деактивацию всех сессий пользователя
     */
    logger.info('[STAGE_5]:: Check Violation Sessions: ACTIVE.count > 0 && PENDING.count > 0', {
      ACTIVE_SESSION_COUNT: sessionsMap.ACTIVE.length,
      PENDING_SESSION_COUNT: sessionsMap.PENDING.length,
    })
    if (
      sessionsMap.ACTIVE.length > 0
      && sessionsMap.PENDING.length > 0
    ) {

      logger.error('[STAGE_5]:: !VIOLATION!: ACTIVE.count > 0 && PENDING.count > 0')
      logger.error('[STAGE_5]:: Terminate all user sessions')
      for (const s of sessions) {
        logger.error('[STAGE_5]:: Terminate: ' + s.id)
        await SessionService.terminate(s.id)
      }
      logger.error('[STAGE_5]:: Redirect to: ' + AppRoutes.client.SignIn)
      return RedirectToSignIn(ctx)
    }

    logger.error('[STAGE_6]:: Handle PENDING session if it\'s exists')
    if (sessionsMap.PENDING?.length > 0) {
      const session = await SessionUseCase.handlerPendingSession(
        tokenPayload.userId,
        logger,
      )
      if (
        session?.expiresAt &&
        new Date(session.expiresAt).getTime() > Date.now()
      ) {

        // Сессия ещё не просрочена
        logger.error('[STAGE_6]:: PENDING session is exists', { sessionId: session.id })
        return RedirectToSignIn(ctx)
      }
      else {
        logger.error('[STAGE_6]:: PENDING session is expired', { sessionId: session?.id })
      }
    }

    // AccessTokenService.create
    // console.log('HELLO', 'AUTH MIDDLEWARE')

    // const isAdminRoute = url.pathname.startsWith('/admin')

    // const user = await getCurrentUser(ctx.request)

    // if (!user) {
    //   return ctx.redirect('/')
    // }

    // if (user.role === 'admin' && !isAdminRoute) {
    //   return ctx.redirect('/admin')
    // }

    // if (user.role !== 'admin' && isAdminRoute) {
    //   return ctx.redirect('/')
    // }

    return next()
  },
)

// async function getCurrentUser(request: Request) {
//   const cookie = request.headers.get('cookie')

//   if (!cookie) {
//     return null
//   }

//   // условный пример
//   const isAdmin = cookie.includes('role=admin')

//   return {
//     id: 'user-1',
//     role: isAdmin ? 'admin' : 'user',
//   }
// }
