import z from 'zod'
import type { actionTable } from '~/server/database/schema'

export type Action = typeof actionTable.$inferSelect
export type ActionInput = typeof actionTable.$inferInsert

export const createActionDto = z.object({
  name: z.string().trim().min(3),
})
export type CreateActionDto = z.infer<typeof createActionDto>
export type CreateActionResponse = Action

export const updateActionDto = z.object({
  name: z.string().trim().min(3).optional(),
})

export type UpdateActionDto = z.infer<typeof updateActionDto>
export type UpdateActionResponse = Action

export enum ActionKey {
  // Authentication
  UserSignUp = 'user_sign_up',
  UserSignIn = 'user_sign_in',
  UserSignOut = 'user_sign_out',
  SignInFailed = 'sign_in_failed',

  // Sessions
  SessionCreated = 'session_created',
  SessionRevoked = 'session_revoked',
  AllSessionsRevoked = 'all_sessions_revoked',

  // Vault
  VaultUnlocked = 'vault_unlocked',
  VaultLocked = 'vault_locked',

  // Password records
  PasswordRecordCreated = 'password_record_created',
  PasswordRecordUpdated = 'password_record_updated',
  PasswordRecordDeleted = 'password_record_deleted',
  PasswordCopied = 'password_copied',

  // User keys
  UserKeyCreated = 'user_key_created',
  UserKeyRotated = 'user_key_rotated',
  UserKeyRevoked = 'user_key_revoked',

  // Account
  MasterPasswordChanged = 'master_password_changed',
  ProfileUpdated = 'profile_updated',
  AccountDeleted = 'account_deleted',

  // Backup
  VaultExported = 'vault_exported',
  VaultImported = 'vault_imported',
}
