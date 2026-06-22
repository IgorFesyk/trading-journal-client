import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { accountQueries } from '@entities/account'
import { tradeQueries } from '@entities/trade'

import { formatCents } from '@shared/lib'

type StatProps = { label: string; value: string; valueClassName?: string }

function Stat(props: StatProps) {
    const { label, value, valueClassName } = props

    return (
        <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className={`text-xs font-medium tabular-nums ${valueClassName ?? ''}`}>{value}</span>
        </div>
    )
}

export function AccountHeader() {
    const { accountId } = useParams()

    const { data: accounts = [] } = useQuery(accountQueries.all())
    const { data: trades = [] } = useQuery(tradeQueries.getTradesByAccountId(Number(accountId)))

    const account = accounts.find((a) => String(a.id) === accountId)
    if (!account) return null

    const closedPnl = trades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)
    const currentEquity = account.startingEquity + closedPnl

    return (
        <div className="flex h-full items-center gap-4">
            <Stat label="Equity" value={formatCents(currentEquity, account.currency)} />
            <div className="h-1/2 w-1 border-r-1" />
            {account.targetEquity !== null && (
                <>
                    <Stat label="Target" value={formatCents(account.targetEquity, account.currency)} />
                    <div className="h-1/2 w-1 border-r-1" />
                </>
            )}
            <Stat
                label="Net P&L"
                value={formatCents(currentEquity - account.startingEquity, account.currency)}
                valueClassName={
                    currentEquity > account.startingEquity
                        ? 'text-green-500'
                        : currentEquity < account.startingEquity
                          ? 'text-red-500'
                          : ''
                }
            />
            <div className="h-1/2 w-1 border-r-1" />
            <Stat label="Trades" value={String(trades.length)} />
        </div>
    )
}
