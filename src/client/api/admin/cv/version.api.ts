import { httpClient } from '~/client/api/http-client'
import type { Version } from '~/shared/dto/cv/version.dto'
import { AppRoutes } from '~/shared/router'

const routes = AppRoutes.api.admin

export const CvVersionApi = {
  async getList() {
    const result = await httpClient.get<{ data: Version[] }>(
      routes.CvVersions,
    )
    return result.data
  },
}
