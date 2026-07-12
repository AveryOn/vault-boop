import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { vaultUserTable } from '~/server/database/schema/vault-user.table'

export const vaultUserActionTable = sqliteTable('vault_user_action', {
  id: id(),

  action: text('action'),
  vaultUserId: text('vault_user_id')
    .notNull()
    .references(() => vaultUserTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
  deletedAt: timestamp('deleted_at'),
})
