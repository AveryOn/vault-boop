import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { userTable } from '~/server/database/schema/user.table'

export const accessTokenTable = sqliteTable('access_token', {
  id: id(),

  token: text('token').notNull(),

  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  replacedBy: text('replaced_by'),

  createdAt: timestamp('created_at', true).notNull(),
  archivedAt: timestamp('archived_at', true),
})
