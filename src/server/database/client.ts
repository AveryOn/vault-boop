import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import * as schema from './schema'
import { serverEnv } from '~/server/config/env'

const client = createClient({
  url: serverEnv.DATABASE_URL ?? 'file:./sqlite.db',
})

export const db = drizzle(client, { schema })
