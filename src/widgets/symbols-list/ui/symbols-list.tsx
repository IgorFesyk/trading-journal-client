import { useQuery } from '@tanstack/react-query'

import { CreateSymbolButton } from '@features/admin'

import { symbolQueries } from '@entities/symbol'

import { SymbolRow } from './symbol-row'

export function SymbolsList() {
    const { data: symbols = [], isLoading } = useQuery(symbolQueries.all())

    return (
        <div>
            <div className="mb-6 flex items-baseline gap-3">
                <h1 className="text-lg font-semibold">Symbols</h1>
                {!isLoading && <span className="text-sm text-muted-foreground">{symbols.length} total</span>}
                <div className="ml-auto">
                    <CreateSymbolButton />
                </div>
            </div>

            {isLoading ? (
                <Skeleton />
            ) : symbols.length === 0 ? (
                <div className="border py-16 text-center text-sm text-muted-foreground">No symbols yet</div>
            ) : (
                <div className="border">
                    <div className="flex items-center gap-6 border-b bg-muted/50 px-4 py-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                        <span className="w-32 shrink-0">Name</span>
                        <span className="flex-1">Category</span>
                        <span className="w-24 shrink-0">Trades</span>
                        <span className="w-32 shrink-0">Status</span>
                        <span className="w-20 shrink-0"></span>
                    </div>
                    {symbols.map((symbol) => (
                        <SymbolRow key={symbol.id} symbol={symbol} />
                    ))}
                </div>
            )}
        </div>
    )
}

function Skeleton() {
    return (
        <div className="divide-y border">
            <div className="flex items-center gap-6 border-b bg-muted/50 px-4 py-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                <span className="w-32 shrink-0">Name</span>
                <span className="flex-1">Category</span>
                <span className="w-24 shrink-0">Trades</span>
                <span className="w-32 shrink-0">Status</span>
                <span className="w-14 shrink-0"></span>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-6 px-4 py-4">
                    <div className="h-4 w-32 animate-pulse bg-muted" />
                    <div className="h-4 flex-1 animate-pulse bg-muted" />
                    <div className="h-4 w-24 animate-pulse bg-muted" />
                    <div className="h-4 w-32 animate-pulse bg-muted" />
                    <div className="h-4 w-20 animate-pulse bg-muted" />
                </div>
            ))}
        </div>
    )
}
