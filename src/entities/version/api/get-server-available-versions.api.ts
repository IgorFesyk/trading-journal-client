import { api } from '@shared/lib/api'

import type { AvailableVersionsInfo } from '../version.types'

export async function getServerAvailableVersionsApi() {
    return api.get<AvailableVersionsInfo>('/version/server/available').then((r) => r.data)
}
