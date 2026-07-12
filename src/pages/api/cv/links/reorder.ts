import type { APIRoute } from "astro"
import { ZodBundleErrors } from "~/server/plugins/zod.plugin"
import { CvLinkService } from "~/server/services/admin/cv/link.service"
import { _ } from "~/shared/const"
import { reorderLinksDto } from "~/shared/dto/cv/link.dto"
import { Logger } from "~/shared/logger/logger.client"

export const PUT: APIRoute = async ({ request }) => {
  const logger = new Logger('HTTP:PUT:REORDER_LINKS')
  try {
    const body = await request.json()
    logger.info('Excludes request body', { body })

    const { success, data, error } = reorderLinksDto.safeParse(body)

    if (!success) {
      logger.error(_, { error })
      return Response.json(
        { error: ZodBundleErrors(error) },
        { status: 400 },
      )
    }

    const isSuccess = await CvLinkService.reorder({
      linksOrder: data.linksOrder,
      profileId: data.profileId,
    }, logger)

    return Response.json({ data: isSuccess })
  } catch (err) {
    logger.error(_, { err })
    throw err
  }
}
