import { CvLinksApi } from '~/client/api/admin/cv/links.api'
import { AppRoutes } from '~/shared/router'
import type {
  Link,
  LinkInput,
  PatchCvLinkDto,
} from '~/shared/dto/cv/link.dto'
import { useCvEntityEditor } from './useCvEntityEditor'

type LinkEditableField = keyof LinkInput

export function useCvLinksEditor() {
  return useCvEntityEditor<Link, LinkEditableField>({
    editableFields: [
      'profileId',
      'type',
      'label',
      'url',
      'isVisible',
      'order',
    ],

    getLabel: (link) => link.label,

    createPageUrl: AppRoutes.admin.CvLinksNew,

    api: {
      getListByProfileId(profileId) {
        return CvLinksApi.getListByProfileId(profileId)
      },

      patch(id, body) {
        return CvLinksApi.patch(id, body as PatchCvLinkDto)
      },

      reorder(profileId, items) {
        return CvLinksApi.reorder({
          profileId,
          linksOrder: items,
        })
      },
    },

    messages: {
      updated: 'Ссылка изменена',
      updateError: 'Произошла ошибка при изменении ссылки',
      reorderError: 'Произошла ошибка при изменении порядка ссылок',
    },
  })
}
