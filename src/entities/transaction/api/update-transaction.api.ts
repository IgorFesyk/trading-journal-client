import { api } from '@shared/lib/api'

import type { Transaction, TransactionType } from '../transaction.types'

type UpdateTransactionInput = {
    accountId: number
    id: number
    type?: TransactionType
    amount?: number
    occurredAt?: string
    note?: string
}

export async function updateTransactionApi(input: UpdateTransactionInput) {
    const { accountId, id, ...body } = input
    return api.put<Transaction>(`/accounts/${accountId}/transactions/${id}`, body).then((r) => r.data)
}
