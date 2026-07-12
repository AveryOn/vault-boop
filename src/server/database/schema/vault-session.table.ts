import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { vaultUserTable } from '~/server/database/schema/vault-user.table'

export const vaultSessionTable = sqliteTable('vault_session', {
  id: id(),

  vaultUserId: text('vault_user_id')
    .notNull()
    .references(() => vaultUserTable.id, { onDelete: 'cascade' }),

  status: text('status').default('ACTIVE'),
  expiresAt: timestamp('expires_at').notNull(),
  lastUsedAt: timestamp('last_used_at', true).notNull(),
  createdAt: timestamp('created_at', true).notNull(),
  deletedAt: timestamp('deleted_at'),
})
