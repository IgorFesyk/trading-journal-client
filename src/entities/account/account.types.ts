export type AccountType = 'CAPITAL' | 'PROP'
export type Currency = 'USD' | 'EUR' | 'GBP'

export type Account = {
    id: number
    userId: number
    name: string
    type: AccountType
    currency: Currency
    startingEquity: number // cents
    targetEquity: number | null // cents
    createdAt: string
    updatedAt: string
}

export type AccountStats = {
    name: string
    startingEquity: number // cents
    currency: Currency
    totalTrades: number
    totalPnl: number // cents
    totalWinPnl: number // cents
    totalLosePnl: number // cents
    avgWinPnl: number | null // cents
    avgLosePnl: number | null // cents
    wins: number
    losses: number
    breakevens: number
    inProgress: number
}
