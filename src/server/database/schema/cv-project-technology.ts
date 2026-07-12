import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { cvProjectTable } from '~/server/database/schema/cv-project'

export const cvProjectTechnologyTable = sqliteTable(
  'cv_project_technology',
  {
    id: id(),

    projectId: text('project_id')
      .notNull()
      .references(() => cvProjectTable.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),

    order: integer('order').notNull().default(0),

    createdAt: timestamp('created_at', true).notNull(),
    updatedAt: timestamp('updated_at', true).notNull(),
  },
)
