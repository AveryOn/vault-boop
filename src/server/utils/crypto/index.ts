import crypto, { type CipherGCMTypes } from 'node:crypto'
import { serverEnv as env } from "~/server/config/env"
import argon2 from 'argon2'

function getDataKey(): Buffer {
  const secret = env.DATA_HASH_KEY

  if (!secret) {
    throw new Error('HASH_KEY is not configured')
  }

  return crypto
    .createHash('sha256')
    .update(secret)
    .digest()
}

function getAccessKey(): Buffer {
  const secret = env.ACCESS_HASH_KEY

  if (!secret) {
    throw new Error('HASH_KEY is not configured')
  }

  return crypto
    .createHash('sha256')
    .update(secret)
    .digest()
}

const getKeyMap = {
  access: getAccessKey,
  data: getDataKey,
} as const
type GetKeyType = keyof typeof getKeyMap


export function encryptData(value: string, type: GetKeyType): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(
    env.CIPHER_ALGORITHM as CipherGCMTypes,
    getKeyMap[type](),
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


export function decryptData(value: string, type: GetKeyType): string {
  const [ivBase64, authTagBase64, encryptedBase64] = value.split(':')

  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error('Invalid encrypted value')
  }


  const decipher = crypto.createDecipheriv(
    env.CIPHER_ALGORITHM as CipherGCMTypes,
    getKeyMap[type](),
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

const algorithmMap = {
  argon2id: argon2.argon2id,
  argon2i: argon2.argon2i,
  argon2d: argon2.argon2d,
} as const

const algorithm = algorithmMap[env.HASH_ALGORITHM as keyof typeof algorithmMap]

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: algorithm,
    memoryCost: env.HASH_ALGORITHM_MEM_COST,
    timeCost: env.HASH_ALGORITHM_TIME_COST,
    parallelism: env.HASH_ALGORITHM_PARALLELISM,
  })
}
