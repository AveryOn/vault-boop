import { adminRoutes } from '~/shared/router/admin.routes'
import { apiRoutes } from '~/shared/router/api.routes'
import { clientRoutes } from '~/shared/router/client.routes'

export const AppRoutes = {
  client: clientRoutes,
  admin: adminRoutes,
  api: apiRoutes,
}
