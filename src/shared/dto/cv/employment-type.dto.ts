import type { cvEmploymentTypeTable } from '~/server/database/schema'

export type EmploymentType = typeof cvEmploymentTypeTable.$inferSelect
export type EmploymentTypeInput =
  typeof cvEmploymentTypeTable.$inferInsert
