import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { boolean, id, timestamp } from '~/server/database/helpers'
import { ProfileLanguages } from '~/shared/types'

export const cvProfileTable = sqliteTable('cv_profile', {
  id: id(),

  language: text('language', {
    enum: ProfileLanguages,
  }).notNull(),

  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),

  title: text('title').notNull(),
  location: text('location'),

  summary: text('summary').notNull(),

  email: text('email'),
  phone: text('phone'),

  isActive: boolean('is_active').notNull().default(false),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
  deletedAt: timestamp('deleted_at'),
})
