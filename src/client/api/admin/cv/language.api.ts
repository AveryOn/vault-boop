import { httpClient } from '~/client/api/http-client'
import type { Language } from '~/shared/dto/cv/language.dto'
import { AppRoutes } from '~/shared/router'

const routes = AppRoutes.api.admin

export const CvLanguageApi = {
  async getList() {
    const result = await httpClient.get<{ data: Language[] }>(
      routes.CvLanguages,
    )
    return result.data
  },
}
