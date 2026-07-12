import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { userTable } from '~/server/database/schema/user.table'
import { actionTable } from './action.table'

export const userActionTable = sqliteTable('user_action', {
  id: id(),

  actionId: text('action_id')
    .notNull()
    .references(() => actionTable.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', true).notNull(),
})
