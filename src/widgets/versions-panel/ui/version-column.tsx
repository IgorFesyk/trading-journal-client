import { GithubLogoIcon } from '@phosphor-icons/react'

import { Button } from '@shared/ui/button'
import { Separator } from '@shared/ui/separator'

type VersionColumnProps = {
    title: string
    currentVersion: string | undefined
    isCurrentLoading: boolean
    availableVersions: string[]
    isAvailableLoading: boolean

    deployJobLink?: string
}

export function VersionColumn(props: VersionColumnProps) {
    const { title, currentVersion, isCurrentLoading, availableVersions, isAvailableLoading, deployJobLink } = props

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex justify-between">
                <h2 className="mb-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">{title}</h2>
                {deployJobLink ? (
                    <Button variant="outline" size="icon-sm" title="Deploy job" asChild>
                        <a href={deployJobLink} target="_blank" rel="noopener noreferrer">
                            <GithubLogoIcon />
                        </a>
                    </Button>
                ) : (
                    <></>
                )}
            </div>

            <div className="border px-4 py-6 text-center">
                {isCurrentLoading ? (
                    <div className="mx-auto h-7 w-28 animate-pulse bg-muted" />
                ) : (
                    <span className="font-mono text-2xl font-bold">{currentVersion ?? '—'}</span>
                )}
                <p className="mt-1 text-xs text-muted-foreground">Currently deployed</p>
            </div>

            <Separator className="my-6" />

            <div className="min-h-0 flex-1 border">
                <div className="border-b bg-muted/50 px-4 py-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                    All available versions
                </div>
                {isAvailableLoading ? (
                    <div className="divide-y">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="px-4 py-3">
                                <div className="h-4 w-20 animate-pulse bg-muted" />
                            </div>
                        ))}
                    </div>
                ) : availableVersions.length === 0 ? (
                    <div className="py-16 text-center text-sm text-muted-foreground">No versions found</div>
                ) : (
                    <ul className="max-h-96 divide-y overflow-y-auto">
                        {availableVersions.map((v) => (
                            <li key={v} className="flex items-center justify-between px-4 py-2">
                                <span className="font-mono text-sm">{v}</span>
                                {v === currentVersion && (
                                    <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                                        current
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
