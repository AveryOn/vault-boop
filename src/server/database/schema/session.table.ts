import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { userTable } from '~/server/database/schema/user.table'
import { userActionTable } from '~/server/database/schema/user-action.table'
import { accessTokenTable } from '~/server/database/schema/access-token.table'

export const sessionTable = sqliteTable('session', {
  id: id(),

  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),

  accessTokenId: text('access_token_id')
    .references(() => accessTokenTable.id, { onDelete: 'cascade' }),

  lastUserActionId: text('last_user_action_id')
    .notNull()
    .references(() => userActionTable.id, { onDelete: 'no action' }),

  deviceId: text('device_id').notNull(),
  ip: text('ip').notNull(),
  ua: text('ua').notNull(),

  status: text('status').default('ACTIVE'),
  expiresAt: timestamp('expires_at').notNull(),
  lastUsedAt: timestamp('last_used_at', true).notNull(),
  createdAt: timestamp('created_at', true).notNull(),
})
