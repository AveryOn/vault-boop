import { marked } from 'marked'
import { sanitizeHtml } from '~/shared/utils/markdown/sanitizeHtml'

export const renderMarkdown = async (
  markdown: string,
): Promise<string> => {
  const rawHtml = await marked.parse(markdown, {
    async: true,
    gfm: true,
    breaks: false,
  })

  return sanitizeHtml(rawHtml)
}
