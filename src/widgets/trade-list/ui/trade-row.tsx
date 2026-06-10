import { CaretDown, CaretUp } from '@phosphor-icons/react'
import { useState } from 'react'

import type { Currency } from '@entities/account'
import type { Trade } from '@entities/trade'

import { formatCents } from '@shared/lib'

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const STATUS_STYLES: Record<Trade['status'], string> = {
    WIN: 'bg-green-500/10 text-green-600 dark:text-green-400',
    LOSE: 'bg-red-500/10 text-red-600 dark:text-red-400',
    BE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    IN_PROGRESS: 'bg-muted text-muted-foreground',
}

const STATUS_LABELS: Record<Trade['status'], string> = {
    WIN: 'Win',
    LOSE: 'Loss',
    BE: 'Break Even',
    IN_PROGRESS: 'Open',
}

type TradeRowProps = {
    trade: Trade
    symbolName: string
    currency: Currency
}

export function TradeRow(props: TradeRowProps) {
    const { trade, symbolName, currency } = props

    const [expanded, setExpanded] = useState(false)

    const pnlFormatted = trade.pnl !== null ? formatCents(trade.pnl, currency) : '—'
    const pnlColor =
        trade.pnl === null
            ? 'text-muted-foreground'
            : trade.pnl > 0
              ? 'text-green-600 dark:text-green-400'
              : trade.pnl < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-muted-foreground'

    const directionColor =
        trade.direction === 'LONG' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

    return (
        <div className="border-b last:border-b-0">
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/50"
            >
                <div className="w-20 shrink-0">
                    <span className="font-mono text-sm font-semibold">{symbolName}</span>
                </div>

                <div className="w-14 shrink-0">
                    <span className={`text-xs font-medium ${directionColor}`}>{trade.direction}</span>
                </div>

                <div className="w-24 shrink-0">
                    <span
                        className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${STATUS_STYLES[trade.status]}`}
                    >
                        {STATUS_LABELS[trade.status]}
                    </span>
                </div>

                <div className="w-28 shrink-0">
                    <span className={`font-mono text-sm tabular-nums ${pnlColor}`}>
                        {trade.pnl !== null && trade.pnl > 0 ? '+' : ''}
                        {pnlFormatted}
                    </span>
                </div>

                <div className="flex-1 text-xs text-muted-foreground">{formatDate(trade.openedAt)}</div>

                <div className="shrink-0 text-muted-foreground">
                    {expanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
                </div>
            </button>

            {expanded && (
                <div className="bg-muted/30 px-4 pt-4 pb-4">
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
                        <DetailItem label="Risk" value={`${(trade.risk / 100).toFixed(2)}%`} />
                        <DetailItem label="Entry TF" value={trade.entryTF} />
                        <DetailItem label="Setup" value={trade.setup} />
                        {trade.commission !== null && (
                            <DetailItem label="Commission" value={formatCents(trade.commission, currency)} />
                        )}
                        {trade.closedAt && <DetailItem label="Closed" value={formatDateTime(trade.closedAt)} />}
                    </div>
                    {trade.notes && <p className="mt-2 border-t pt-2 text-xs text-muted-foreground">{trade.notes}</p>}
                </div>
            )}
        </div>
    )
}

type DetailItemProps = { label: string; value: string }

function DetailItem(props: DetailItemProps) {
    const { label, value } = props

    return (
        <div className="flex items-baseline gap-1.5">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono font-medium">{value}</span>
        </div>
    )
}
