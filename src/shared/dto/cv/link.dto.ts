import z from 'zod'
import type { cvProfileLinkTable } from '~/server/database/schema'
import { SocialNetwork, SocialNetworks } from '~/shared/types'

export type Link = typeof cvProfileLinkTable.$inferSelect
export type LinkInput = typeof cvProfileLinkTable.$inferInsert

export const createCvLinkDto = z.object({
  profileId: z.uuid(),
  type: z.enum(SocialNetwork),
  label: z.string().trim().min(1),
  url: z.url(),
})
export type CreateCvLinkDto = z.infer<typeof createCvLinkDto>

export const patchCvLinkDto = z.object({
  profileId: z.uuid().optional(),
  type: z.enum(SocialNetworks).optional(),
  label: z.string().trim().optional(),
  url: z.url().optional(),
  isVisible: z.boolean().optional(),
})
export type PatchCvLinkDto = z.infer<typeof patchCvLinkDto>

export const reorderLinksDto = z.object({
  linksOrder: z.array(
    z.object({
      id: z.uuid(),
      order: z.number().min(0),
      label: z.string().trim().optional(),
    }),
  ),
  profileId: z.uuid(),
})
export type ReorderLinksDto = z.infer<typeof reorderLinksDto>

export interface CreateLinkResponse {
  newLink: Link
  shiftedLinks: {
    id: string
    order: number
  }[]
}
