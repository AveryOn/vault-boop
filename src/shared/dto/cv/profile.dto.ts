import { z } from 'zod'
import { ProfileLanguages } from '~/shared/types'
import { cvProfileTable } from '~/server/database/schema/cv-profile'

export const createCvProfileDto = z.object({
  language: z.enum(ProfileLanguages),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  title: z.string().trim().min(1),
  location: z.string().trim().optional().nullable(),
  summary: z.string().trim().min(1),
  email: z.email().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional().default(false),
})
export type CreateCvProfileDto = z.infer<typeof createCvProfileDto>

export const updateCvProfileDto = z
  .object({
    language: z.enum(ProfileLanguages).optional(),
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    title: z.string().trim().min(1).optional(),
    location: z.string().trim().optional().nullable(),
    summary: z.string().trim().min(1).optional(),
    email: z.email().optional().nullable(),
    phone: z.string().trim().optional().nullable(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })

export type UpdateCvProfileDto = z.infer<typeof updateCvProfileDto>

export type Profile = typeof cvProfileTable.$inferSelect
