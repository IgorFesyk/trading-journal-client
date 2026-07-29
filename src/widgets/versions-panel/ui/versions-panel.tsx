import { useQuery } from '@tanstack/react-query'

import { versionQueries } from '@entities/version'

import { Separator } from '@shared/ui/separator'

import { VersionColumn } from './version-column'

export function VersionsPanel() {
    const server = useQuery(versionQueries.server())
    const serverAvailable = useQuery(versionQueries.serverAvailable())

    const client = useQuery(versionQueries.client())
    const clientAvailable = useQuery(versionQueries.clientAvailable())

    const isProd = import.meta.env.PROD

    return (
        <div>
            <h1 className="mb-6 text-lg font-semibold">Versions</h1>

            <div className="flex items-start gap-8">
                <VersionColumn
                    title="Server"
                    currentVersion={server.data?.version}
                    isCurrentLoading={server.isLoading}
                    availableVersions={serverAvailable.data?.versions ?? []}
                    isAvailableLoading={serverAvailable.isLoading}
                    deployJobLink={isProd ? import.meta.env.VITE_SERVER_DEPLOY_JOB : undefined}
                />

                <Separator orientation="vertical" className="self-stretch" />

                <VersionColumn
                    title="Client"
                    currentVersion={client.data?.version}
                    isCurrentLoading={client.isLoading}
                    availableVersions={clientAvailable.data?.versions ?? []}
                    isAvailableLoading={clientAvailable.isLoading}
                    deployJobLink={isProd ? import.meta.env.VITE_CLIENT_DEPLOY_JOB : undefined}
                />
            </div>
        </div>
    )
}
