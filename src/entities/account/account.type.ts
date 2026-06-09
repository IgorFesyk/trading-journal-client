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
