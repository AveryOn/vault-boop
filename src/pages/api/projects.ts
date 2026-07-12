import type { APIRoute } from 'astro'
import { db } from '~/server/database/client'
import { cvProjectTable } from '~/server/database/schema'

export const GET: APIRoute = async () => {
  const data = await db.select().from(cvProjectTable)

  return Response.json(data)
}
