/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppRoutes } from '~/shared/router'
import type {
  Experience,
  ExperienceInput,
} from '~/shared/dto/cv/experience.dto'
import { useCvEntityEditor } from '~/client/composables/useCvEntityEditor'
import { CvExperienceApi } from '~/client/api/admin/cv/experience.api'

type LinkEditableField = keyof ExperienceInput

export function useCvExperienceEditor() {
  return useCvEntityEditor<Experience, LinkEditableField>({
    editableFields: [
      'company',
      'position',
      'location',
      'description',
      'order',
      'isCurrent',
      'profileId',
      'employmentTypeId',
      'startDate',
      'endDate',
    ],

    getLabel: (experience) => experience.company,

    createPageUrl: AppRoutes.admin.CvExperienceNew,

    api: {
      getListByProfileId(profileId) {
        return CvExperienceApi.getListByProfileId(profileId)
      },
      patch: () => {
        return null as any
      },
      reorder: () => {
        return null as any
      },

      // patch(id, body) {
      //   return CvExperienceApi.patch(
      //     id,
      //     body as PatchCvLinkDto,
      //   )
      // },

      // reorder(profileId, items) {
      //   return CvLinksApi.reorder({
      //     profileId,
      //     linksOrder: items,
      //   })
      // },
    },

    messages: {
      updated: 'Опыт изменен',
      updateError: 'Произошла ошибка при изменении опыта',
      reorderError:
        'Произошла ошибка при изменении порядка элементов опыта',
    },
  })
}
