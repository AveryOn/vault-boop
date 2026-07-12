import { articlesTable } from '~/server/database/schema/articles'

export type Article = typeof articlesTable.$inferSelect
export type ArticleInput = typeof articlesTable.$inferInsert
