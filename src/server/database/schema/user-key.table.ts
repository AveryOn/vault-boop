import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { userTable } from '~/server/database/schema/user.table'
import { userActionTable } from './user-action.table'

export const userKeyTable = sqliteTable('user_key', {
  id: id(),

  userActionId: text('user_action_id')
    .notNull()
    .references(() => userActionTable.id, { onDelete: 'no action' }),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  keyHash: text('key_hash').notNull(),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
  deletedAt: timestamp('deleted_at'),
})
