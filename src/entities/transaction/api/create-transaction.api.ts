import { api } from '@shared/lib/api'

import type { Transaction, TransactionType } from '../transaction.types'

type CreateTransactionInput = {
    accountId: number
    type: TransactionType
    amount: number
    occurredAt: string
    note?: string
}

export async function createTransactionApi(input: CreateTransactionInput) {
    const { accountId, ...body } = input
    return api.post<Transaction>(`/accounts/${accountId}/transactions`, body).then((r) => r.data)
}
