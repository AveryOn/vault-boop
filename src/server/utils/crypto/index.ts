import crypto, { type CipherGCMTypes } from 'node:crypto'
import { serverEnv as env } from "~/server/config/env"

function getKey(): Buffer {
  const secret = env.HASH_kEY

  if (!secret) {
    throw new Error('HASH_KEY is not configured')
  }

  return crypto
    .createHash('sha256')
    .update(secret)
    .digest()
}

export function encrypt(value: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(
    env.ALGORITHM as CipherGCMTypes,
    getKey(),
    iv
  )

  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ])

  const authTag = cipher.getAuthTag()

  return [
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64'),
  ].join(':')
}


export function decrypt(value: string): string {
  const [ivBase64, authTagBase64, encryptedBase64] = value.split(':')

  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error('Invalid encrypted value')
  }


  const decipher = crypto.createDecipheriv(
    env.ALGORITHM as CipherGCMTypes,
    getKey(),
    Buffer.from(ivBase64, 'base64'),
  )

  decipher.setAuthTag(Buffer.from(authTagBase64, 'base64'))

  const decrypted = Buffer
    .concat([
      decipher.update(Buffer.from(encryptedBase64, 'base64')),
      decipher.final(),
    ])

  return decrypted.toString('utf8')
}
