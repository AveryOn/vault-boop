import type {
  cvSkillGroupTable,
  cvSkillTable,
} from '~/server/database/schema'

export type SkillGroup = typeof cvSkillGroupTable.$inferSelect
export type SkillGroupInput = typeof cvSkillGroupTable.$inferInsert

export type Skill = typeof cvSkillTable.$inferSelect
export type SkillInput = typeof cvSkillTable.$inferInsert
