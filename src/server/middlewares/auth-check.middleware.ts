import { defineMiddleware } from 'astro:middleware'
import { CookieName } from '~/shared/const'
import { Logger } from '~/shared/logger/logger.client'
import { decryptData } from '~/server/utils/crypto'
import type { AccessTokenPayload } from '~/shared/dto/access-token.dto'
import type { APIContext } from 'astro'

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


    // Собираем все необходимые данные в один объект
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

    return next()
  },
)
