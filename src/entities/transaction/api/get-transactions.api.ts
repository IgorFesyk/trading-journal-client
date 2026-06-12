import { api } from '@shared/lib/api'

import type { Transaction } from '../transaction.types'

export async function getTransactionsApi(accountId: number) {
    return api.get<Transaction[]>(`/accounts/${accountId}/transactions`).then((r) => r.data)
}
