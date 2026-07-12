import { createClient, type ResultSet } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

import * as schema from './schema'
import { serverEnv } from '~/server/config/env'
import type { SQLiteTransaction } from 'drizzle-orm/sqlite-core'
import type { ExtractTablesWithRelations } from 'drizzle-orm'

const client = createClient({
  url: serverEnv.DATABASE_URL ?? 'file:./sqlite.db',
})

export const db = drizzle(client, { schema })

export type Database = typeof db

export type DatabaseTransaction = SQLiteTransaction<
  'async',
  ResultSet,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>

export type DatabaseAdapter = Database | DatabaseTransaction
