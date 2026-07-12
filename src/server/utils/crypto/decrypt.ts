import { serverEnv as env } from "~/server/config/env"

export function decrypt(value: string): string {
  const [ivBase64, authTagBase64, encryptedBase64] = value.split(':')

  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error('Invalid encrypted value')
  }


  const decipher = crypto.createDecipheriv(
    env.ALGORITHM,
    getKey(),
    Buffer.from(ivBase64, 'base64'),
  )

  decipher.setAuthTag(Buffer.from(authTagBase64, 'base64'))

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedBase64, 'base64')),
    decipher.final(),
  ])

  return decrypted.toString('utf8')
}
