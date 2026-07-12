import { sequence } from 'astro:middleware'
import { AuthCheckMiddleware } from '~/server/middlewares/auth-check.middleware'
import { BaseCheckUpMiddleware } from '~/server/middlewares/base-checkup.middleware'

export const onRequest = sequence(
  BaseCheckUpMiddleware,
  AuthCheckMiddleware
)
