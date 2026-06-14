import { api } from '@shared/lib/api'

import type { Account } from '../account.type'

export async function getAccountsApi() {
    const response = await api.get<Account[]>('/accounts')
    return response.data
}
