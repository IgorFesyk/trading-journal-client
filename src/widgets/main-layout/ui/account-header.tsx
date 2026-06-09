import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { type Currency, getAccountsApi } from '@entities/account'
import { getTradesApi } from '@entities/trade'

function formatCents(cents: number, currency: Currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(cents / 100)
}

type StatProps = { label: string; value: string }

function Stat({ label, value }: StatProps) {
    return (
        <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-medium tabular-nums">{value}</span>
        </div>
    )
}

export function AccountHeader() {
    const { accountId } = useParams()

    const { data: accounts = [] } = useQuery({
        queryKey: ['accounts'],
        queryFn: getAccountsApi,
    })

    const { data: trades = [] } = useQuery({
        queryKey: ['trades', accountId],
        queryFn: () => getTradesApi({ accountId: Number(accountId) }),
        enabled: !!accountId,
    })

    const account = accounts.find((a) => String(a.id) === accountId)

    if (!account) return null

    const closedPnl = trades.reduce((sum, t) => sum + (t.pnl ?? 0), 0)
    const currentEquity = account.startingEquity + closedPnl

    return (
        <div className="flex items-center gap-6">
            <Stat label="Equity" value={formatCents(currentEquity, account.currency)} />
            {account.targetEquity !== null && (
                <Stat label="Target" value={formatCents(account.targetEquity, account.currency)} />
            )}
            <Stat label="Trades" value={String(trades.length)} />
        </div>
    )
}
