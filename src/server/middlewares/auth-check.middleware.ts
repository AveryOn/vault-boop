import { defineMiddleware } from 'astro:middleware'
import { CookieName, ProcessStatus } from '~/shared/const'
import { Logger } from '~/shared/logger/logger.client'
import { AccessTokenService, SessionService, UserService } from '~/server/services'
import { clientRoutes } from '~/shared/router/client.routes'
import { decryptData } from '~/server/utils/crypto'
import type { AccessTokenPayload } from '~/shared/dto/access-token.dto'
import type { APIContext } from 'astro'
import { AppRoutes } from '~/shared/router'

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

export const AuthCheckMiddleware = defineMiddleware(
  async (ctx, next) => {
    const logger = new Logger('MIDDLEWARE:AuthCheck')
    const url = new URL(ctx.request.url)
    const pathname = normalizePath(url.pathname)

    // Excludes User-Agent
    const ua = excludesUserAgent(ctx)

    // Excludes IP
    const ip = excludesIP(ctx)

    //  Excludes Device ID
    const deviceId = excludesDeviceId(ctx)

    // Excludes AccessToken
    logger.info('[STAGE_1]:: Exclude the accessToken from cookies')
    const accessToken = excludesAccessToken(ctx)

    // Excludes Token Payload
    const TokenPayload = await excludesTokenPayload(accessToken)


    // Собираем все необходимые данные в один объект
    const LocalContext: App.Locals = {
      ua,
      ip,
      deviceId,
      userId: TokenPayload?.userId ?? null,
      sessionId: TokenPayload?.sessionId ?? null,
      tokenId: TokenPayload?.tokenId ?? null,
      username: TokenPayload?.username ?? null,
    }

    logger.info('Excludes require data from Request', {
      pathname,
      ...LocalContext,
    })

    return next()
  },
)
