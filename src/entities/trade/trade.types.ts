export type TradeStatus = 'WIN' | 'LOSE' | 'BE' | 'IN_PROGRESS'
export type Direction = 'LONG' | 'SHORT'
export type Timeframe = 'M15' | 'H1' | 'H4' | 'D1' | 'W1'
export type ExecutionSetup = 'IDM' | 'SNR' | 'FVG' | 'MarketEntry'

export type Trade = {
    id: number
    accountId: number
    symbolId: number
    pnl: number | null
    risk: number
    commission: number | null
    status: TradeStatus
    direction: Direction
    entryTF: Timeframe
    setup: ExecutionSetup
    notes: string | null
    openedAt: string
    closedAt: string | null
    createdAt: string
    updatedAt: string
}
