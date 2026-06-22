import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { symbolQueries } from '@entities/symbol'
import { tradeQueries } from '@entities/trade'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@shared/ui/card'

export function OpenPositions() {
    const { accountId } = useParams()

    const { data: trades = [], isLoading } = useQuery(tradeQueries.getTradesByAccountId(Number(accountId)))

    const { data: symbols = [] } = useQuery(symbolQueries.all())

    const symbolMap = new Map(symbols.map((s) => [s.id, s.name]))
    const openPositions = trades.filter((t) => t.status === 'IN_PROGRESS')

    return (
        <Card className="flex h-full flex-col">
            <CardHeader>
                <CardTitle>Open Positions</CardTitle>
                <CardAction className="text-xs text-muted-foreground">{openPositions.length} active</CardAction>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                {isLoading ? (
                    <Skeleton />
                ) : openPositions.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center py-10 text-sm text-muted-foreground">
                        No open positions
                    </div>
                ) : (
                    openPositions.map((trade) => (
                        <div key={trade.id} className="border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-heading font-semibold">
                                        {symbolMap.get(trade.symbolId) ?? `#${trade.symbolId}`}
                                    </span>
                                    <span
                                        className={`text-xs font-medium ${trade.direction === 'LONG' ? 'text-green-400' : 'text-red-400'}`}
                                    >
                                        {trade.direction}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                                        Unrealized
                                    </p>
                                    <p className="font-heading font-semibold">—</p>
                                </div>
                            </div>

                            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                <span>
                                    Opened{' '}
                                    <span className="text-foreground">
                                        {new Date(trade.openedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </span>
                                <span>
                                    Risk <span className="text-foreground">{(trade.risk / 100).toFixed(2)}%</span>
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}

function Skeleton() {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 border-b pb-3">
                    <div className="flex justify-between">
                        <div className="h-4 w-20 animate-pulse bg-muted" />
                        <div className="h-4 w-16 animate-pulse bg-muted" />
                    </div>
                    <div className="flex justify-between">
                        <div className="h-3 w-24 animate-pulse bg-muted" />
                        <div className="h-3 w-16 animate-pulse bg-muted" />
                    </div>
                </div>
            ))}
        </div>
    )
}
