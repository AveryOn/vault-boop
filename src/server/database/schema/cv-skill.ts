import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { cvSkillGroupTable } from '~/server/database/schema/cv-skill-group'

export const cvSkillTable = sqliteTable('cv_skill', {
  id: id(),

  skillGroupId: text('skill_group_id')
    .notNull()
    .references(() => cvSkillGroupTable.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),

  order: integer('order').notNull().default(0),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
})
