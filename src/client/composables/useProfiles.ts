import { onBeforeMount, ref } from 'vue'
import type { SelectOption } from '~/client/components/shared/SelectInputUI.vue'
import { CvProfileApi } from '~/client/api/admin/cv/profile.api'
import { _ } from '~/shared/const'

export function useProfiles(
  options?: { setFirstAsSelect?: boolean },
  beforeMount?: () => void,
) {
  const profiles = ref<SelectOption[]>([])
  const selectedProfileId = ref<string>('')

  async function uploadProfiles(): Promise<SelectOption[]> {
    const profiles = await CvProfileApi.getAll()
    return profiles.map((p) => {
      return {
        label: p.title,
        value: p.id,
      }
    })
  }

  onBeforeMount(async () => {
    profiles.value = await uploadProfiles()
    if (options?.setFirstAsSelect) {
      selectedProfileId.value = profiles.value[0].value
    }
    beforeMount?.()
  })

  return {
    selectedProfileId,
    profiles,
  }
}
