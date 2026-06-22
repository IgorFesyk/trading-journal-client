import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { accountQueries } from '@entities/account'

import { formatCents } from '@shared/lib/format'

import { StatCard } from './stat-card'

export function AccountStats() {
    const { accountId } = useParams()

    const { data: stats, isLoading } = useQuery(accountQueries.getStats(Number(accountId)))

    if (isLoading) return <Skeleton />
    if (!stats) return null

    const {
        currency,
        startingEquity,
        totalPnl,
        totalWinPnl,
        totalLosePnl,
        avgWinPnl,
        avgLosePnl,
        wins,
        losses,
        breakevens,
    } = stats

    const netPnl = startingEquity + totalPnl
    const netPnlPct = ((totalPnl / startingEquity) * 100).toFixed(2)
    const netPnlPositive = totalPnl >= 0

    const profitFactor = totalLosePnl !== 0 ? (totalWinPnl / Math.abs(totalLosePnl)).toFixed(2) : null

    const rr =
        avgWinPnl != null && avgLosePnl != null && avgLosePnl !== 0
            ? (avgWinPnl / Math.abs(avgLosePnl)).toFixed(2)
            : null

    const closedTrades = wins + losses + breakevens
    const expectancy = closedTrades > 0 ? Math.round(totalPnl / closedTrades) : null
    const expectancyPositive = expectancy != null && expectancy >= 0

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Net P&L"
                value={
                    <span className={netPnlPositive ? 'text-green-400' : 'text-red-400'}>
                        {netPnlPositive ? '+' : ''}
                        {formatCents(netPnl, currency)}
                    </span>
                }
                sub={
                    <span className={netPnlPositive ? 'text-green-400' : 'text-red-400'}>
                        {netPnlPositive ? '+' : ''}
                        {netPnlPct}% since start
                    </span>
                }
            />

            <StatCard
                label="Avg Win / Loss"
                value={
                    <>
                        {avgWinPnl != null ? formatCents(avgWinPnl, currency) : '—'}
                        {' / '}
                        {avgLosePnl != null ? formatCents(Math.abs(avgLosePnl), currency) : '—'}
                    </>
                }
                sub={rr != null ? `${rr} RR` : 'No closed trades'}
            />

            <StatCard
                label="Profit Factor"
                value={profitFactor ?? '—'}
                sub={`${formatCents(totalWinPnl, currency)} won vs ${formatCents(Math.abs(totalLosePnl), currency)} lost`}
            />

            <StatCard
                label="Expectancy"
                value={
                    expectancy != null ? (
                        <span className={expectancyPositive ? 'text-green-400' : 'text-red-400'}>
                            {expectancyPositive ? '+' : ''}
                            {formatCents(expectancy, currency)}
                        </span>
                    ) : (
                        '—'
                    )
                }
                sub={closedTrades > 0 ? `per closed trade (${closedTrades} total)` : 'No closed trades'}
            />
        </div>
    )
}

function Skeleton() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3 p-4 ring-1 ring-foreground/10">
                    <div className="h-3 w-20 animate-pulse bg-muted" />
                    <div className="h-7 w-32 animate-pulse bg-muted" />
                    <div className="h-3 w-24 animate-pulse bg-muted" />
                </div>
            ))}
        </div>
    )
}
