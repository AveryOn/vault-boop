import { httpClient } from '~/client/api/http-client'
import { _ } from '~/shared/const'
import type {
  CreateCvLinkDto,
  Link,
  PatchCvLinkDto,
  ReorderLinksDto,
} from '~/shared/dto/cv/link.dto'
import { AppRoutes } from '~/shared/router'

const routes = AppRoutes.api.admin

export const CvLinksApi = {
  async getListByProfileId(profileId?: string) {
    const result = await httpClient.get<{ data: Link[] }>(
      routes.CvLinks,
      {
        params: profileId ? { profileId } : _,
      },
    )
    return result.data
  },

  async create(data: CreateCvLinkDto) {
    return await httpClient.post<Link>(routes.CvLinks, {
      data,
    })
  },

  async reorder(data: ReorderLinksDto) {
    const result = await httpClient.put<{ data: boolean }>(
      routes.CvLinksReorder,
      {
        linksOrder: data.linksOrder,
        profileId: data.profileId,
      },
    )
    return result.data
  },

  async patch(linkId: string, data: PatchCvLinkDto) {
    const result = await httpClient.patch<{ data: boolean }>(
      routes.cvLinkByUuid(linkId),
      data,
    )
    return result.data
  },
}
