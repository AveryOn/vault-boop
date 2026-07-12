import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { boolean, id, timestamp } from '~/server/database/helpers'
import { cvProfileTable } from '~/server/database/schema/cv-profile'

export const cvProjectTable = sqliteTable('cv_project', {
  id: id(),

  profileId: text('profile_id')
    .notNull()
    .references(() => cvProfileTable.id, { onDelete: 'cascade' }),

  title: text('title').notNull(),

  shortDescription: text('short_description').notNull(),
  description: text('description').notNull(),

  repositoryUrl: text('repository_url'),
  demoUrl: text('demo_url'),

  startDate: text('start_date'),
  endDate: text('end_date'),

  isFeatured: boolean('is_featured').notNull().default(false),

  order: integer('order').notNull().default(0),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
  deletedAt: timestamp('deleted_at', true),
})
