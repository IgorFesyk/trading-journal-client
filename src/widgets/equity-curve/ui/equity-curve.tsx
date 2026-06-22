import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { getAccountStatsApi } from '@entities/account'
import { type Trade, tradeQueries } from '@entities/trade'

import { formatCents } from '@shared/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@shared/ui/chart'

const chartConfig = {
    equity: { label: 'Equity', color: '#4ade80' },
} satisfies ChartConfig

type EquityPoint = { label: string; equity: number }

function buildEquityCurve(trades: Trade[], startingEquity: number): EquityPoint[] {
    const closed = trades
        .filter((t): t is Trade & { pnl: number; closedAt: string } => t.pnl != null && t.closedAt != null)
        .sort((a, b) => new Date(a.closedAt).getTime() - new Date(b.closedAt).getTime())

    if (closed.length === 0) return []

    let running = startingEquity
    const points: EquityPoint[] = [{ label: 'Start', equity: startingEquity }]

    for (const trade of closed) {
        running += trade.pnl
        points.push({
            label: new Date(trade.closedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            equity: running,
        })
    }

    return points
}

export function EquityCurve() {
    const { accountId } = useParams()

    const { data: stats } = useQuery({
        queryKey: ['accountStats', accountId],
        queryFn: () => getAccountStatsApi(Number(accountId)),
        enabled: !!accountId,
    })

    const { data: trades = [], isLoading } = useQuery(tradeQueries.getTradesByAccountId(Number(accountId)))

    const startingEquity = stats?.startingEquity ?? 0
    const currency = stats?.currency ?? 'USD'
    const chartData = buildEquityCurve(trades, startingEquity)

    const equities = chartData.map((p) => p.equity)
    const minEquity = Math.min(...equities)
    const maxEquity = Math.max(...equities)
    const range = maxEquity - minEquity
    const pad = range > 0 ? range * 0.05 : Math.abs(minEquity) * 0.02
    const domainMin = Math.floor(minEquity - pad)
    const domainMax = Math.ceil(maxEquity + pad)

    function formatTick(cents: number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(cents / 100)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="h-48 animate-pulse bg-muted" />
                ) : chartData.length < 2 ? (
                    <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                        No closed trades yet
                    </div>
                ) : (
                    <div className="text-muted-foreground">
                        <ChartContainer config={chartConfig} className="h-48 w-full">
                            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-equity)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--color-equity)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="3 3"
                                    stroke="currentColor"
                                    strokeOpacity={0.2}
                                />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 10, fill: 'currentColor' }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 10, fill: 'currentColor' }}
                                    tickFormatter={formatTick}
                                    domain={[domainMin, domainMax]}
                                    width={60}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value) => (
                                                <span className="font-mono font-medium text-foreground tabular-nums">
                                                    {formatCents(Number(value), currency)}
                                                </span>
                                            )}
                                        />
                                    }
                                />
                                <Area
                                    type="monotone"
                                    dataKey="equity"
                                    stroke="var(--color-equity)"
                                    strokeWidth={1.5}
                                    fill="url(#equityFill)"
                                    dot={false}
                                    activeDot={{ r: 3, fill: 'var(--color-equity)', strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
