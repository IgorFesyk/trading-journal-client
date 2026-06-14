export type AccountType = 'CAPITAL' | 'PROP'
export type Currency = 'USD' | 'EUR' | 'GBP'

export type Account = {
    id: number
    userId: number
    name: string
    type: AccountType
    currency: Currency
    startingEquity: number
    targetEquity: number | null
    createdAt: string
    updatedAt: string
}

export type AccountStats = {
    name: string
    startingEquity: number
    currency: Currency
    totalTrades: number
    totalPnl: number
    totalWinPnl: number
    totalLosePnl: number
    avgWinPnl: number | null
    avgLosePnl: number | null
    wins: number
    losses: number
    breakevens: number
    inProgress: number
}
