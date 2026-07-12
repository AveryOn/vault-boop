import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'

export const articlesTable = sqliteTable('article', {
  id: id(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
  createdAt: timestamp('created_at', true).notNull(),
})
