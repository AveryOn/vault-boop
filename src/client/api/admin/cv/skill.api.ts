import { httpClient } from '~/client/api/http-client'
import type { Skill } from '~/shared/dto/cv/skill.dto'
import { AppRoutes } from '~/shared/router'

const routes = AppRoutes.api.admin

export const CvSkillApi = {
  async getList() {
    const result = await httpClient.get<{ data: Skill[] }>(
      routes.CvSkills,
    )
    return result.data
  },
}
