import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { boolean, id, timestamp } from '~/server/database/helpers'
import { cvEmploymentTypeTable } from '~/server/database/schema/cv-employment-type'
import { cvProfileTable } from '~/server/database/schema/cv-profile'

export const cvExperienceTable = sqliteTable('cv_experience', {
  id: id(),

  profileId: text('profile_id')
    .notNull()
    .references(() => cvProfileTable.id, { onDelete: 'cascade' }),

  employmentTypeId: text('employment_type_id').references(
    () => cvEmploymentTypeTable.id,
    { onDelete: 'set null' },
  ),

  company: text('company').notNull(),
  position: text('position').notNull(),
  location: text('location'),

  startDate: text('start_date').notNull(),
  endDate: text('end_date'),

  isCurrent: boolean('is_current').notNull().default(false),

  description: text('description').notNull(),

  order: integer('order').notNull().default(0),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
})
