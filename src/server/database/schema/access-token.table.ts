import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { userTable } from '~/server/database/schema/user.table'

export const vaultAccessTokenTable = sqliteTable('vault_access_token', {
  id: id(),

  token: text('token').notNull(),

  vaultUserId: text('vault_user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
  deletedAt: timestamp('deleted_at'),
})
