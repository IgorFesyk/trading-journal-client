import { api } from '@shared/lib/api'

export async function deleteAccountApi(id: number) {
    await api.delete(`/accounts/${id}`)
}
