import { httpClient } from '~/client/api/http-client'
import type {
  CreateCvProfileDto,
  Profile,
  UpdateCvProfileDto,
} from '~/shared/dto/cv/profile.dto'
import { AppRoutes } from '~/shared/router'

const routes = AppRoutes.api.admin

export const CvProfileApi = {
  async getAll() {
    const result = await httpClient.get<{ data: Profile[] }>(
      routes.CvProfiles,
    )
    return result.data
  },

  getById(uuid: string) {
    return httpClient.get<Profile[]>(routes.cvProfileByUuid(uuid))
  },

  getActive() {
    return httpClient.get<Profile[]>(routes.CvProfiles, {
      params: {
        isActive: true,
      },
    })
  },

  create(data: CreateCvProfileDto) {
    return httpClient.post<Profile[]>(routes.CvProfiles, {
      data,
    })
  },

  update(uuid: string, data: UpdateCvProfileDto) {
    return httpClient.patch<Profile[]>(routes.cvProfileByUuid(uuid), {
      data,
    })
  },
}
