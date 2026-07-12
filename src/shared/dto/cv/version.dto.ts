import type { cvVersionTable } from '~/server/database/schema'

export type Version = typeof cvVersionTable.$inferSelect
export type VersionInput = typeof cvVersionTable.$inferInsert
