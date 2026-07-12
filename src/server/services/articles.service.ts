import { articlesTable } from '~/server/database/schema'
import { db } from '~/server/database/client'
import type { ArticleInput, Article } from '~/shared/dto/article.dto'

export const ArticleService = {
  async getList(): Promise<Article[]> {
    return await db.select().from(articlesTable)
  },

  async create(data: ArticleInput): Promise<Article> {
    const [article] = await db
      .insert(articlesTable)
      .values(data)
      .returning()
    return article
  },
}
