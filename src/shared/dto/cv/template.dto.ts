import type { cvTemplateTable } from '~/server/database/schema'

export type Template = typeof cvTemplateTable.$inferSelect
export type TemplateInput = typeof cvTemplateTable.$inferInsert
