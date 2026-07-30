import { api } from '@shared/lib/api'

export async function deleteTransactionApi(accountId: number, id: number) {
    await api.delete(`/accounts/${accountId}/transactions/${id}`)
}
