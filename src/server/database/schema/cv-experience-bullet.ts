import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { id, timestamp } from '~/server/database/helpers'
import { cvExperienceTable } from '~/server/database/schema/cv-experience'

export const cvExperienceBulletTable = sqliteTable(
  'cv_experience_bullet',
  {
    id: id(),

    experienceId: text('experience_id')
      .notNull()
      .references(() => cvExperienceTable.id, { onDelete: 'cascade' }),

    content: text('content').notNull(),

    order: integer('order').notNull().default(0),

    createdAt: timestamp('created_at', true).notNull(),
    updatedAt: timestamp('updated_at', true).notNull(),
  },
)
