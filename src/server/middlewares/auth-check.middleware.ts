import { defineMiddleware } from 'astro:middleware'
import { CookieName, ProcessStatus, SessionStatus } from '~/shared/const'
import { Logger } from '~/shared/logger/logger.client'
import { AccessTokenService, SessionService } from '~/server/services'
import { clientRoutes } from '~/shared/router/client.routes'
import { decryptData } from '../utils/crypto'
import type { AccessTokenPayload } from '~/shared/dto/access-token.dto'
import type { APIContext } from 'astro'
import type { Session } from '~/shared/dto/session.dto'
import { SessionUseCase } from '../use-cases/session.use-case'

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
    // const accessToken = ctx.cookies.get(CookieName['accessToken'])?.value
    const accessToken = 'asdasd'

    if (!accessToken) {
      logger.warn('Access Token is not found!')
      return RedirectToSignIn(ctx)
    }

    // Проверка токена доступа:
    const tokenPayload: AccessTokenPayload | null = await decryptAccessToken(accessToken, logger)
    if (!tokenPayload) {
      logger.warn('Failed to exclude the token payload data')
      return RedirectToSignIn(ctx)
    }

    // Проверка сессий пользователя
    const sessions = await SessionService.getByUserId(tokenPayload.userId)

    // Получение и проверка текущей сессии привязанной к токену доступа
    const currentSession = sessions.find(s => s.id === tokenPayload.sessionId) ?? null
    // Если по такому ID сессии не существует то это нарушение
    if (!currentSession) {
      return RedirectToSignIn(ctx)
    }

    //  Группировка сессий по статусу
    const sessionsMap = sessions.reduce<
      Record<keyof typeof SessionStatus, Session[]>
    >((acc, session) => {
      acc[session.status as SessionStatus] ??= []
      acc[session.status as SessionStatus].push(session)

      return acc
    }, {} as Record<keyof typeof SessionStatus, Session[]>)

    /*
     Если у пользователя неожиданное состояние сессий (когда есть и ACTIVE и PENDING сессии)
     то делаем деактивацию всех сессий пользователя
     */
    if (
      sessionsMap.ACTIVE.length > 0
      && sessionsMap.PENDING.length > 0
    ) {
      for (const s of sessions) {
        await SessionService.terminate(s.id)
      }
      return RedirectToSignIn(ctx)
    }

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
