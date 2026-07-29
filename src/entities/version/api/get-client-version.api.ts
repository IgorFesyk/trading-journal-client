import { api } from '@shared/lib/api'

import type { VersionInfo } from '../version.types'

export async function getClientVersionApi() {
    return api.get<VersionInfo>('/version/client').then((r) => r.data)
}
