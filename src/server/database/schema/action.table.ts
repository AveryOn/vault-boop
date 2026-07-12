import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'

export const actionTable = sqliteTable('action', {
  id: id(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
  deletedAt: timestamp('deleted_at'),
})
