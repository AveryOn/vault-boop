import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'

export const userTable = sqliteTable('user', {
  id: id(),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  masterPasswordHash: text('master_password_hash').notNull(),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
  deletedAt: timestamp('deleted_at'),
})
