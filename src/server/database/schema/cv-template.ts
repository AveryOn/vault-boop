import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import {
  CVTemplateStatus,
  CVTemplateStatuses,
  ProfileLanguages,
} from '~/shared/types'

export const cvTemplateTable = sqliteTable('cv_template', {
  id: id(),

  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),

  language: text('language', {
    enum: ProfileLanguages,
  }).notNull(),

  html: text('html').notNull(),
  css: text('css').notNull(),

  status: text('status', {
    enum: CVTemplateStatuses,
  })
    .notNull()
    .default(CVTemplateStatus.draft),

  order: integer('order').notNull().default(0),

  createdAt: timestamp('created_at', true).notNull(),
  updatedAt: timestamp('updated_at', true).notNull(),
})
