import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { boolean, id, timestamp } from '~/server/database/helpers'
import { cvProfileTable } from '~/server/database/schema/cv-profile'
import { SocialNetworks } from '~/shared/types'

export const cvProfileLinkTable = sqliteTable('cv_profile_link', {
  id: id(),

  profileId: text('profile_id')
    .notNull()
    .references(() => cvProfileTable.id, { onDelete: 'cascade' }),

  type: text('type', {
    enum: SocialNetworks,
  }).notNull(),

  label: text('label').notNull(),
  url: text('url').notNull(),

  order: integer('order').notNull().default(0),
  isVisible: boolean('is_visible').notNull().default(true),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
})
