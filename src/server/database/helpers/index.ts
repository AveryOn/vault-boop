import { sql } from 'drizzle-orm'
import { integer, text } from 'drizzle-orm/sqlite-core'
import { db, type DatabaseAdapter, type DatabaseTransaction } from '~/server/database/client'

export const id = () =>
  text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())

export const timestamp = (field: string, defaultNow: boolean = false) =>
  defaultNow ? text(field).default(sql`CURRENT_TIMESTAMP`) : text(field)

export const boolean = (field: string) =>
  integer(field, { mode: 'boolean' })


export function SelectDatabaseAdapter(
  db: DatabaseAdapter,
  adapter?: DatabaseAdapter,
): DatabaseAdapter {
  return adapter ?? db
}

export function completeWithTransaction<T>(
  func: (tx: DatabaseTransaction) => Promise<T>,
  tx?: DatabaseTransaction,
): Promise<T> {
  if (tx) {
    return func(tx)
  }

  return db.transaction(async trx => {
    return func(trx)
  })
}
