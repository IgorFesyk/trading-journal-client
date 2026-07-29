import { useQuery } from '@tanstack/react-query'

import { accountQueries } from '@entities/account'

import { AccountRow } from './account-row'

export function AccountsList() {
    const { data: accounts = [], isLoading } = useQuery(accountQueries.all())

    if (isLoading) {
        return <Skeleton />
    }

    if (accounts.length === 0) {
        return <div className="border py-16 text-center text-sm text-muted-foreground">No accounts yet</div>
    }

    return (
        <div className="border">
            <div className="flex items-center gap-6 border-b bg-muted/50 px-4 py-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                <span className="w-48 shrink-0">Name</span>
                <span className="w-24 shrink-0">Type</span>
                <span className="w-24 shrink-0">Currency</span>
                <span className="flex-1">Starting equity</span>
                <span className="w-40 shrink-0" />
            </div>
            {accounts.map((account) => (
                <AccountRow key={account.id} account={account} />
            ))}
        </div>
    )
}

function Skeleton() {
    return (
        <div className="divide-y border">
            <div className="flex items-center gap-6 border-b bg-muted/50 px-4 py-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                <span className="w-48 shrink-0">Name</span>
                <span className="w-24 shrink-0">Type</span>
                <span className="w-24 shrink-0">Currency</span>
                <span className="flex-1">Starting equity</span>
                <span className="w-40 shrink-0" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-6 px-4 py-4">
                    <div className="h-4 w-48 animate-pulse bg-muted" />
                    <div className="h-4 w-24 animate-pulse bg-muted" />
                    <div className="h-4 w-24 animate-pulse bg-muted" />
                    <div className="h-4 flex-1 animate-pulse bg-muted" />
                </div>
            ))}
        </div>
    )
}
