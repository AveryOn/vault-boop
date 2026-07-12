import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { vaultUserTable } from '~/server/database/schema/vault-user.table'

export const vaultActionTable = sqliteTable('vault_action', {
  id: id(),

  name: text('name').notNull(),

  vaultUserId: text('vault_user_id')
    .notNull()
    .references(() => vaultUserTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
  deletedAt: timestamp('deleted_at'),
})
