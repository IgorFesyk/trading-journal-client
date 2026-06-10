export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'ADJUSTMENT'

export type Transaction = {
    id: number
    accountId: number
    type: TransactionType
    amount: number
    note: string | null
    occurredAt: string
    createdAt: string
    updatedAt: string
}
