import { getClientAvailableVersionsApi } from './api/get-client-available-versions.api'
import { getClientVersionApi } from './api/get-client-version.api'
import { getServerAvailableVersionsApi } from './api/get-server-available-versions.api'
import { getServerVersionApi } from './api/get-server-version.api'

export const versionQueryKeys = {
    server: () => ['version', 'server'],
    serverAvailable: () => ['version', 'server', 'available'],
    client: () => ['version', 'client'],
    clientAvailable: () => ['version', 'client', 'available'],
}

export const versionQueries = {
    server: () => ({
        queryKey: versionQueryKeys.server(),
        queryFn: getServerVersionApi,
    }),
    serverAvailable: () => ({
        queryKey: versionQueryKeys.serverAvailable(),
        queryFn: getServerAvailableVersionsApi,
    }),
    client: () => ({
        queryKey: versionQueryKeys.client(),
        queryFn: getClientVersionApi,
    }),
    clientAvailable: () => ({
        queryKey: versionQueryKeys.clientAvailable(),
        queryFn: getClientAvailableVersionsApi,
    }),
}
