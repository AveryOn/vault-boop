import { defineMiddleware } from 'astro:middleware'
import { CookieName } from '~/shared/const'
import { Logger } from '~/shared/logger/logger.client'
import { AccessTokenService } from '~/server/services'
import { clientRoutes } from '~/shared/router/client.routes'

export const AuthCheckMiddleware = defineMiddleware(
  async (ctx, next) => {
    const url = new URL(ctx.request.url)

    const logger = new Logger('MIDDLEWARE:AuthCheck:RUN')
    // const accessToken = ctx.cookies.get(CookieName['accessToken'])?.value
    const accessToken = 'asdasd'

    if (!accessToken) {
      logger.warn('Access Token is not found!')
      return ctx.redirect(clientRoutes.SignIn)
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
