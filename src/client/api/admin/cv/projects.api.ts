import { httpClient } from '~/client/api/http-client'
import type { Project } from '~/shared/dto/cv/projects.dto'
import { AppRoutes } from '~/shared/router'

const routes = AppRoutes.api.admin

export const CvProjectsApi = {
  async getList() {
    const result = await httpClient.get<{ data: Project[] }>(
      routes.CvProjects,
    )
    return result.data
  },
}
