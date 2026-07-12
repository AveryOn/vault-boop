import { httpClient } from '~/client/api/http-client'
import type { Template } from '~/shared/dto/cv/template.dto'
import { AppRoutes } from '~/shared/router'

const routes = AppRoutes.api.admin

export const CvTemplateApi = {
  async getList() {
    const result = await httpClient.get<{ data: Template[] }>(
      routes.CvTemplates,
    )
    return result.data
  },
}
