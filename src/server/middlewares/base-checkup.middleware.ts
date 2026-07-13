import { defineMiddleware } from 'astro:middleware'
import { Logger } from '~/shared/logger/logger.client'
import { clientRoutes } from '~/shared/router/client.routes'

export const BaseCheckUpMiddleware = defineMiddleware(
  async (ctx, next) => {
    const logger = new Logger('MIDDLEWARE:BaseCheckUp')

    const url = new URL(ctx.request.url)
    const pathname = url.pathname
    logger.info('', { pathname })

    // Переход на страницу входа
    if (pathname === clientRoutes.Auth && !pathname.startsWith(clientRoutes.SignIn)) {
      logger.info('move to ' + clientRoutes.SignIn)
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
