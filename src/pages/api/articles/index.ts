import type { APIRoute } from 'astro'
import { z } from 'zod'
import { ArticleService } from '~/server/services'

const createArticleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
})

export const prerender = false

export const GET: APIRoute = async () => {
  const articles = [
    {
      id: 'demo-id',
      slug: 'demo-slug',
      title: 'Demo title',
      content: '# Demo',
      createdAt: new Date().toISOString(),
    },
  ]

  return Response.json(articles)
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null)

  const parsed = createArticleSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      {
        message: 'Invalid request body',
        errors: z.treeifyError(parsed.error),
      },
      {
        status: 400,
      },
    )
  }
  const now = new Date().toISOString()

  const newArticle = await ArticleService.create({
    title: parsed.data.title,
    content: parsed.data.content,
    slug: parsed.data.slug,
    createdAt: now,
    updatedAt: now,
  })

  return Response.json(newArticle, {
    status: 201,
  })
}
