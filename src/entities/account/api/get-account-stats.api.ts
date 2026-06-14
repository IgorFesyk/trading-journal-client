import { api } from '@shared/lib/api'

import type { AccountStats } from '../account.type'

export async function getAccountStatsApi(id: number) {
    const response = await api.get<AccountStats>(`/accounts/${id}/stats`)
    return response.data
}
