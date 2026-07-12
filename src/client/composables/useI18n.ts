import { useI18n } from 'vue-i18n'
import { plural } from '~/client/plugins/i18n'

export function UseI18n() {
  const { t: $t } = useI18n()
  return { $t, plural }
}
