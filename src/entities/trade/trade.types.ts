export type TradeStatus = 'WIN' | 'LOSE' | 'BE' | 'IN_PROGRESS'
export type Direction = 'LONG' | 'SHORT'

export type Trade = {
    id: number
    accountId: number
    symbolId: number
    pnl: number | null
    risk: number
    commission: number | null
    status: TradeStatus
    direction: Direction
    notes: string | null
    openedAt: string
    closedAt: string | null
    createdAt: string
    updatedAt: string
}
