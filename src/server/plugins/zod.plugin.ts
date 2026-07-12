import z from 'zod'
import type { Logger } from '~/shared/logger/logger.client'

export function ZodBundleErrors(error: z.core.$ZodError<unknown>) {
  return z.treeifyError(error).errors
}

export function throwZodError(
  error: z.core.$ZodError<unknown>,
  logger?: Logger,
  msg?: string,
) {
  const errors = ZodBundleErrors(error)
  if (logger) {
    logger.error(msg ?? undefined, { errors })
  }
  throw errors
}
