import { sequence } from 'astro:middleware'
import { AuthCheckMiddleware } from '~/server/middlewares/auth-check.middleware'

export const onRequest = sequence(AuthCheckMiddleware)
