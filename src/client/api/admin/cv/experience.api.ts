import { httpClient } from '~/client/api/http-client'
import { _ } from '~/shared/const'
import type { CreateExperienceDto, Experience } from '~/shared/dto/cv/experience.dto'
import { AppRoutes } from '~/shared/router'

const routes = AppRoutes.api.admin

export const CvExperienceApi = {
  async getListByProfileId(profileId?: string) {
    const result = await httpClient.get<{ data: Experience[] }>(
      routes.CvExperiences,
      {
        params: profileId ? { profileId } : _,
      },
    )
    return result.data
  },

  async create(data: CreateExperienceDto) {
    return await httpClient.post<Experience>(routes.CvExperiences, {
      data,
    })
  },

  // async reorder(data: ReorderLinksDto) {
  //   const result = await httpClient.put<{ data: boolean }>(routes.CvLinksReorder, {
  //     linksOrder: data.linksOrder,
  //     profileId: data.profileId,
  //   })
  //   return result.data
  // },

  // async patch(linkId: string, data: PatchCvLinkDto) {
  //   const result = await httpClient.patch<{ data: boolean }>(routes.cvLinkByUuid(linkId), data)
  //   return result.data
  // }

}
