import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { userTable } from '~/server/database/schema/user.table'
import { actionTable } from './action.table'

export const sessionTable = sqliteTable('session', {
  id: id(),

  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  accessTokenId: text('access_token_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  lastUserActionId: text('last_user_action_id')
    .notNull()
    .references(() => actionTable.id, { onDelete: 'no action' }),

  status: text('status').default('ACTIVE'),
  expiresAt: timestamp('expires_at').notNull(),
  lastUsedAt: timestamp('last_used_at', true).notNull(),
  createdAt: timestamp('created_at', true).notNull(),
  deletedAt: timestamp('deleted_at'),
})
