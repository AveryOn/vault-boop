import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { cvProfileTable } from '~/server/database/schema/cv-profile'

export const cvSkillGroupTable = sqliteTable('cv_skill_group', {
  id: id(),

  profileId: text('profile_id')
    .notNull()
    .references(() => cvProfileTable.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),

  order: integer('order').notNull().default(0),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
})
