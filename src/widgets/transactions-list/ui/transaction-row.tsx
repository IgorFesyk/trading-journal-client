import type { Currency } from '@entities/account'
import type { Transaction } from '@entities/transaction'

import { formatCents } from '@shared/lib'

const TYPE_STYLES: Record<Transaction['type'], string> = {
    DEPOSIT: 'bg-green-500/10 text-green-600 dark:text-green-400',
    WITHDRAWAL: 'bg-red-500/10 text-red-600 dark:text-red-400',
    ADJUSTMENT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
}

const TYPE_LABELS: Record<Transaction['type'], string> = {
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal',
    ADJUSTMENT: 'Adjustment',
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

type TransactionRowProps = {
    transaction: Transaction
    currency: Currency
}

export function TransactionRow(props: TransactionRowProps) {
    const { transaction, currency } = props

    const isNegative = transaction.type === 'WITHDRAWAL'
    const amountFormatted = formatCents(transaction.amount, currency)
    const amountColor = isNegative ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'

    return (
        <div className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0">
            <div className="w-20 shrink-0">
                <span
                    className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${TYPE_STYLES[transaction.type]}`}
                >
                    {TYPE_LABELS[transaction.type]}
                </span>
            </div>

            <div className="flex-1 truncate text-xs text-muted-foreground">{transaction.note ?? '—'}</div>

            <div className="w-28 shrink-0">
                <span className={`font-mono text-sm tabular-nums ${amountColor}`}>
                    {isNegative ? '-' : '+'}
                    {amountFormatted}
                </span>
            </div>

            <div className="w-32 shrink-0 text-xs text-muted-foreground">{formatDate(transaction.occurredAt)}</div>
        </div>
    )
}
