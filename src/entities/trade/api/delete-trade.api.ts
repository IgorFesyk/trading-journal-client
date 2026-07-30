import { api } from '@shared/lib/api'

export async function deleteTradeApi(accountId: number, id: number) {
    await api.delete(`/accounts/${accountId}/trades/${id}`)
}
