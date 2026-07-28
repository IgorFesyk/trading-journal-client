import { api } from '@shared/lib/api'

export async function deleteSymbolApi(id: number) {
    await api.delete(`/symbols/${id}`)
}
