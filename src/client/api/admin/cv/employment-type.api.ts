import { httpClient } from '~/client/api/http-client'
import type { EmploymentType } from '~/shared/dto/cv/employment-type.dto'
import { AppRoutes } from '~/shared/router'

const routes = AppRoutes.api.admin

export const CvEmploymentTypeApi = {
  async getList() {
    const result = await httpClient.get<{ data: EmploymentType[] }>(
      routes.CvEmploymentTypes,
    )
    return result.data
  },
}
