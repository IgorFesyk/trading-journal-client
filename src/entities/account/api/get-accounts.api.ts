import { api } from '@shared/lib/api'

import type { Account } from '../account.types'

export async function getAccountsApi() {
    const response = await api.get<Account[]>('/accounts')
    return response.data
}
