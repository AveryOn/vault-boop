import { defineMiddleware } from 'astro:middleware'
import { CookieName } from '~/shared/const'
import { Logger } from '~/shared/logger/logger.client'
import { decryptData } from '~/server/utils/crypto'
import type { AccessTokenPayload } from '~/shared/dto/access-token.dto'
import type { APIContext } from 'astro'
import z from 'zod'
import { AuthService } from '../services/auth.service'

// function rejectUnauthorized(ctx: MiddlewareCtx): Response {
//   const pathname = normalizePath(new URL(ctx.request.url).pathname)

//   ctx.cookies.delete(CookieName.accessToken, {
//     path: '/',
//   })

//   if (pathname.startsWith('/api/')) {
//     return Response.json(
//       {
//         success: false,
//         error: 'Unauthorized',
//       },
//       {
//         status: 401,
//       },
//     )
//   }

//   if (pathname === normalizePath(clientRoutes.SignIn)) {
//     return new Response(null, {
//       status: 401,
//     })
//   }

//   return ctx.redirect(clientRoutes.SignIn)
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MiddlewareCtx = APIContext<Record<string, any>, Record<string, string | undefined>>

function normalizePath(path: string): string {
  return path !== '/' ? path.replace(/\/+$/, '') : path
}

/** Дешифрование токена доступа. Извлечение payload токена */
async function excludesTokenPayload(accessToken: string | null): Promise<AccessTokenPayload | null> {
  try {
    const token = accessToken ? accessToken : 'stub';
    return JSON.parse(await decryptData(token, 'access'))
  } catch {
    return null
  }
}

function excludesUserAgent(ctx: MiddlewareCtx): string | null {
  return ctx.request.headers.get('user-agent') ?? null
}

function excludesIP(ctx: MiddlewareCtx): string | null {
  return ctx.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? ctx.request.headers.get('x-real-ip')
    ?? ctx.clientAddress
    ?? null
}

function excludesAccessToken(ctx: MiddlewareCtx): string | null {
  return ctx.cookies.get(CookieName['accessToken'])?.value ?? null
}

function excludesDeviceId(ctx: MiddlewareCtx): string | null {
  return ctx.cookies.get(CookieName['deviceId'])?.value ?? null
}

function fillLocalsContext(ctx: MiddlewareCtx, locals: App.Locals): App.Locals {
  for (const key in locals) {
    const k = key as keyof App.Locals
    if (Object.prototype.hasOwnProperty.call(locals, k)) {
      ctx.locals[k] = locals[k]
    }
  }
  return locals
}

const BodyContextDto = z.object({
  ua: z.string(),
  ip: z.ipv4(),
  deviceId: z.string(),
  userId: z.uuid(),
  sessionId: z.uuid(),
  tokenId: z.uuid(),
  username: z.string(),
})

/** Валидация контекста запроса */
async function validationContext(locals: App.Locals, logger: Logger): Promise<boolean> {
  logger.info('[STAGE_7]:: Validation App.Locals Context')

  const result = BodyContextDto.safeParse(locals)

  // Моковый объект для имитации процесса (for timing attack)
  let data: App.Locals = {
    ua: 'MOCK_USER-AGENT',
    ip: '127.0.0.1',
    deviceId: 'device_id',
    userId: crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
    tokenId: crypto.randomUUID(),
    username: 'mock_user_123',
  }
  logger.info('Validation Auth Context', { data })

  if (result.success) {
    data = result.data
  }
  const success = await AuthService.validateAuthContext({
    ua: data.ua!,
    ip: data.ip!,
    deviceId: data.deviceId!,
    userId: data.userId!,
    sessionId: data.sessionId!,
    tokenId: data.tokenId!,
    username: data.username!,
  }, logger)
  logger.error('Validation Context Error', { error: result.error })
  return success

}

export const AuthCheckMiddleware = defineMiddleware(
  async (ctx, next) => {
    const logger = new Logger('MIDDLEWARE:AuthCheck')
    const url = new URL(ctx.request.url)

    logger.info('[STAGE_1]:: Exclude the Pathname from URL')
    const pathname = normalizePath(url.pathname)

    // Excludes User-Agent
    logger.info('[STAGE_2]:: Exclude the User Agent from cookies')
    const ua = excludesUserAgent(ctx)

    // Excludes IP
    logger.info('[STAGE_3]:: Exclude the IP from cookies')
    const ip = excludesIP(ctx)

    //  Excludes Device ID
    logger.info('[STAGE_4]:: Exclude the deviceId from cookies')
    const deviceId = excludesDeviceId(ctx)

    // Excludes AccessToken
    logger.info('[STAGE_5]:: Exclude the accessToken from cookies')
    const accessToken = excludesAccessToken(ctx)

    // Excludes Token Payload
    logger.info('[STAGE_6]:: Exclude the token payload from accessToken')
    const TokenPayload = await excludesTokenPayload(accessToken)


    // Заполняем App.Locals контекст все необходимые данные в один объект
    const LocalContext = fillLocalsContext(ctx, {
      ua,
      ip,
      deviceId,
      userId: TokenPayload?.userId ?? null,
      sessionId: TokenPayload?.sessionId ?? null,
      tokenId: TokenPayload?.tokenId ?? null,
      username: TokenPayload?.username ?? null,
    })

    logger.info('Excludes require data from Request', {
      pathname,
      ...LocalContext,
    })

    // Валидация контекста запроса
    const isUserAuthorized = await validationContext(LocalContext, logger)

    // Если пользователь не авторизован
    if (!isUserAuthorized) {
      logger.info('User Is Not Authorized')
    }
    else {
      logger.info('User Is Authorized')
    }




    return next()
  },
)
