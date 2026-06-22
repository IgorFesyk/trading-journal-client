import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { accountQueries } from '@entities/account'
import { symbolQueries } from '@entities/symbol'
import { tradeQueries } from '@entities/trade'

import { TradeRow } from './trade-row'

export function TradesList() {
    const { accountId } = useParams()

    const { data: accounts = [] } = useQuery(accountQueries.all())
    const { data: symbols = [], isLoading: isSymbolsLoading } = useQuery(symbolQueries.all())
    const { data: trades = [], isLoading: isTradesLoading } = useQuery(
        tradeQueries.getTradesByAccountId(Number(accountId))
    )

    const account = accounts.find((a) => String(a.id) === accountId)
    const currency = account?.currency ?? 'USD'
    const symbolMap = new Map(symbols.map((s) => [s.id, s.name]))

    return (
        <div>
            <div className="mb-6 flex items-baseline gap-3">
                <h1 className="text-lg font-semibold">Trades</h1>
                {!isTradesLoading && <span className="text-sm text-muted-foreground">{trades.length} total</span>}
            </div>

            {isTradesLoading ? (
                <Skeleton />
            ) : trades.length === 0 ? (
                <div className="border py-16 text-center text-sm text-muted-foreground">No trades yet</div>
            ) : (
                <div className="border">
                    <div className="flex items-center gap-6 border-b bg-muted/50 px-4 py-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                        <span className="w-28 shrink-0">Symbol</span>
                        <span className="w-20 shrink-0">Dir</span>
                        <span className="w-32 shrink-0">Status</span>
                        <span className="w-36 shrink-0">P&amp;L</span>
                        <span className="flex-1">Opened</span>
                    </div>
                    {trades.map((trade) => (
                        <TradeRow
                            key={trade.id}
                            trade={trade}
                            symbolName={symbolMap.get(trade.symbolId) ?? `#${trade.symbolId}`}
                            symbolLoading={isSymbolsLoading}
                            currency={currency}
                        />
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
                <span className="w-28 shrink-0">Symbol</span>
                <span className="w-20 shrink-0">Dir</span>
                <span className="w-32 shrink-0">Status</span>
                <span className="w-36 shrink-0">P&amp;L</span>
                <span className="flex-1">Opened</span>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-6 px-4 py-4">
                    <div className="h-4 w-28 animate-pulse bg-muted" />
                    <div className="h-4 w-20 animate-pulse bg-muted" />
                    <div className="h-4 w-32 animate-pulse bg-muted" />
                    <div className="h-4 w-36 animate-pulse bg-muted" />
                    <div className="h-4 flex-1 animate-pulse bg-muted" />
                </div>
            ))}
        </div>
    )
}
