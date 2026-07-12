import { defineMiddleware } from 'astro:middleware'

export const AuthCheckMiddleware = defineMiddleware(
  async (ctx, next) => {
    // const url = new URL(ctx.request.url)

    // console.log('HELLO', url)

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
