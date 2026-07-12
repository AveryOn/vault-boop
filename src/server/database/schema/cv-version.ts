import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { cvProfileTable } from '~/server/database/schema/cv-profile'
import { cvTemplateTable } from '~/server/database/schema/cv-template'

export const cvVersionTable = sqliteTable('cv_version', {
  id: id(),

  profileId: text('profile_id')
    .notNull()
    .references(() => cvProfileTable.id, { onDelete: 'cascade' }),

  templateId: text('template_id')
    .notNull()
    .references(() => cvTemplateTable.id, { onDelete: 'cascade' }),

  version: integer('version').notNull(),

  title: text('title').notNull(),

  renderData: text('render_data').notNull(),

  renderedHtml: text('rendered_html').notNull(),

  changeNote: text('change_note'),

  status: text('status', {
    enum: ['draft', 'published', 'archived'],
  }).notNull(),

  createdAt: timestamp('created_at', true).notNull(),
  publishedAt: timestamp('published_at'),
})
