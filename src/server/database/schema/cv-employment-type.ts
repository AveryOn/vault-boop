import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { ProfileLanguages } from '~/shared/types'

export const cvEmploymentTypeTable = sqliteTable('cv_employment_type', {
  id: id(),

  code: text('code').notNull().unique(),

  language: text('language', {
    enum: ProfileLanguages,
  }).notNull(),

  label: text('label').notNull(),

  order: integer('order').notNull().default(0),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
})
