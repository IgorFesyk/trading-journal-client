import { api } from '@shared/lib/api'

import type { VersionInfo } from '../version.types'

export async function getServerVersionApi() {
    return api.get<VersionInfo>('/version/server').then((r) => r.data)
}
