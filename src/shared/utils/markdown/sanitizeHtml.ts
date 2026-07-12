import sanitizeHtmlLib from 'sanitize-html'

export const sanitizeHtml = (html: string): string => {
  return sanitizeHtmlLib(html, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',

      'p',
      'br',
      'hr',

      'strong',
      'b',
      'em',
      'i',
      's',

      'blockquote',

      'ul',
      'ol',
      'li',

      'a',

      'code',
      'pre',

      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],

    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      code: ['class'],
      pre: ['class'],
    },

    allowedSchemes: ['http', 'https', 'mailto'],

    transformTags: {
      a: sanitizeHtmlLib.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    },

    disallowedTagsMode: 'discard',
  })
}
