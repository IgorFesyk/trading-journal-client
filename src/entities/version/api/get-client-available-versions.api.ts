import { api } from '@shared/lib/api'

import type { AvailableVersionsInfo } from '../version.types'

export async function getClientAvailableVersionsApi() {
    return api.get<AvailableVersionsInfo>('/version/client/available').then((r) => r.data)
}
