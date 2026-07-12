import type { cvLanguageTable } from '~/server/database/schema'

export type Language = typeof cvLanguageTable.$inferSelect
export type LanguageInput = typeof cvLanguageTable.$inferInsert
