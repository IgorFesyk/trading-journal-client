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

function formatDuration(from: string, to: string) {
    const totalMinutes = Math.floor((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60))
    const days = Math.floor(totalMinutes / (60 * 24))
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
    const minutes = totalMinutes % 60
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
}

const STATUS_BADGE: Record<Trade['status'], string> = {
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
    symbolLoading: boolean
    currency: Currency
}

export function TradeRow(props: TradeRowProps) {
    const { trade, symbolName, symbolLoading, currency } = props

    const [expanded, setExpanded] = useState(false)

    const pnlFormatted = trade.pnl !== null ? formatCents(trade.pnl, currency) : '—'
    const pnlColor =
        trade.pnl === null
            ? 'text-muted-foreground'
            : trade.pnl > 0
              ? 'text-green-500'
              : trade.pnl < 0
                ? 'text-red-500'
                : 'text-muted-foreground'

    const directionColor = trade.direction === 'LONG' ? 'text-green-500' : 'text-red-500'

    return (
        <div className="border-b last:border-b-0">
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex w-full items-center gap-6 px-4 py-4 text-left transition-colors hover:bg-muted/30"
            >
                <div className="w-28 shrink-0">
                    {symbolLoading ? (
                        <div className="h-4 w-16 animate-pulse bg-muted" />
                    ) : (
                        <span className="font-mono text-sm font-bold">{symbolName}</span>
                    )}
                </div>

                <div className="w-20 shrink-0">
                    <span className={`text-xs font-medium ${directionColor}`}>{trade.direction}</span>
                </div>

                <div className="w-32 shrink-0">
                    <span
                        className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase ${STATUS_BADGE[trade.status]}`}
                    >
                        {STATUS_LABELS[trade.status]}
                    </span>
                </div>

                <div className="w-36 shrink-0">
                    <span className={`font-mono text-sm font-semibold tabular-nums ${pnlColor}`}>
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
                <div className="grid grid-cols-3 divide-x border-t bg-muted/20">
                    <Panel label="Execution">
                        <PanelRow label="Setup" value={trade.setup} />
                        <PanelRow label="Entry TF" value={trade.entryTF} />
                        <PanelRow label="Opened" value={formatDateTime(trade.openedAt)} />
                        {trade.closedAt && (
                            <>
                                <PanelRow label="Closed" value={formatDateTime(trade.closedAt)} />
                                <PanelRow label="Held" value={formatDuration(trade.openedAt, trade.closedAt)} />
                            </>
                        )}
                    </Panel>

                    <Panel label="Risk & Result">
                        <PanelRow label="Risk" value={`${(trade.risk / 100).toFixed(2)}%`} />
                        {trade.commission !== null && (
                            <PanelRow label="Commission" value={formatCents(trade.commission, currency)} />
                        )}
                        {trade.pnl !== null && (
                            <PanelRow
                                label="Realized"
                                value={`${trade.pnl > 0 ? '+' : ''}${formatCents(trade.pnl, currency)}`}
                                valueClassName={pnlColor}
                            />
                        )}
                    </Panel>

                    <Panel label="Notes">
                        {trade.notes ? (
                            <p className="text-xs leading-relaxed text-muted-foreground">{trade.notes}</p>
                        ) : (
                            <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                    </Panel>
                </div>
            )}
        </div>
    )
}

type PanelProps = { label: string; children: React.ReactNode }

function Panel(props: PanelProps) {
    const { label, children } = props

    return (
        <div className="flex flex-col gap-3 p-4">
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">{label}</span>
            <div className="flex flex-col gap-2">{children}</div>
        </div>
    )
}

type PanelRowProps = { label: string; value: string; valueClassName?: string }

function PanelRow(props: PanelRowProps) {
    const { label, value, valueClassName } = props

    return (
        <div className="flex items-baseline justify-between gap-4">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className={`font-mono text-xs tabular-nums ${valueClassName ?? ''}`}>{value}</span>
        </div>
    )
}
