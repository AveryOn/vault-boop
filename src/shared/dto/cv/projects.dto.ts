import type { cvProjectTable } from '~/server/database/schema'

export type Project = typeof cvProjectTable.$inferSelect
export type ProjectInput = typeof cvProjectTable.$inferInsert
