import { sql } from 'drizzle-orm'
import { integer, text } from 'drizzle-orm/sqlite-core'

export const id = () =>
  text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID())

export const timestamp = (field: string, defaultNow: boolean = false) =>
  defaultNow ? text(field).default(sql`CURRENT_TIMESTAMP`) : text(field)

export const boolean = (field: string) =>
  integer(field, { mode: 'boolean' })
