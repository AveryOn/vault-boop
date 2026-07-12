import { httpClient } from '~/client/api/http-client'
import type { Article } from '~/shared/dto/article.dto'

export type CreateArticleDto = {
  slug: string
  title: string
  content: string
}

export const ArticlesApi = {
  getAll() {
    return httpClient.get<Article[]>('/articles')
  },

  getBySlug(slug: string) {
    return httpClient.get<Article>(`/articles/${slug}`)
  },

  create(dto: CreateArticleDto) {
    return httpClient.post<Article, CreateArticleDto>('/articles', dto)
  },

  update(id: string, dto: Partial<CreateArticleDto>) {
    return httpClient.patch<Article, Partial<CreateArticleDto>>(
      `/articles/${id}`,
      dto,
    )
  },

  delete(id: string) {
    return httpClient.delete<void>(`/articles/${id}`)
  },
}
