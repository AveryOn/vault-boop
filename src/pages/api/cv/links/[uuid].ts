import type { APIRoute } from "astro"
import z from "zod"
import { ZodBundleErrors } from "~/server/plugins/zod.plugin"
import { CvLinkService } from "~/server/services/admin/cv/link.service"
import { _ } from "~/shared/const"
import { patchCvLinkDto } from "~/shared/dto/cv/link.dto"
import { Logger } from "~/shared/logger/logger.client"


export const PATCH: APIRoute = async ({ params, request }) => {
  const logger = new Logger('HTTP:PATCH:UPDATE_PROFILE_LINK')
  try {
    const linkId = params.uuid

    if (!linkId || !z.uuid().safeParse(linkId).success) {
      return Response.json(
        { error: 'Profile uuid is required' },
        { status: 400 },
      )
    }

    const body = await request.json()
    logger.info('Excludes request body', { body })

    const { success, data, error } = patchCvLinkDto.safeParse(body)

    if (!success) {
      logger.error(_, { error })
      return Response.json(
        { error: ZodBundleErrors(error) },
        { status: 400 },
      )
    }

    const isSuccess = await CvLinkService.patch(linkId, data, logger)

    return Response.json({ data: isSuccess })
  } catch (err) {
    logger.error(_, { err })
    throw err
  }
}
