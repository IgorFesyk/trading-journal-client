import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getAccountsApi } from '@entities/account'
import { getTransactionsApi } from '@entities/transaction'

import { TransactionRow } from './transaction-row'

export function TransactionsList() {
    const { accountId } = useParams()

    const { data: accounts = [] } = useQuery({
        queryKey: ['accounts'],
        queryFn: getAccountsApi,
    })

    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ['transactions', accountId],
        queryFn: () => getTransactionsApi(Number(accountId)),
        enabled: !!accountId,
    })

    const account = accounts.find((a) => String(a.id) === accountId)
    const currency = account?.currency ?? 'USD'

    return (
        <div>
            <div className="mb-6 flex items-baseline gap-3">
                <h1 className="text-lg font-semibold">Transactions</h1>
                {!isLoading && <span className="text-sm text-muted-foreground">{transactions.length} total</span>}
            </div>

            {isLoading ? (
                <Skeleton />
            ) : transactions.length === 0 ? (
                <div className="border py-16 text-center text-sm text-muted-foreground">No transactions yet</div>
            ) : (
                <div className="border">
                    <div className="flex items-center gap-4 border-b bg-muted/50 px-4 py-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                        <span className="w-20 shrink-0">Type</span>
                        <span className="flex-1">Note</span>
                        <span className="w-28 shrink-0">Amount</span>
                        <span className="w-32 shrink-0">Date</span>
                    </div>
                    {transactions.map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} currency={currency} />
                    ))}
                </div>
            )}
        </div>
    )
}

function Skeleton() {
    return (
        <div className="divide-y border">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                    <div className="h-4 w-20 animate-pulse bg-muted" />
                    <div className="h-4 flex-1 animate-pulse bg-muted" />
                    <div className="h-4 w-28 animate-pulse bg-muted" />
                    <div className="h-4 w-32 animate-pulse bg-muted" />
                </div>
            ))}
        </div>
    )
}
