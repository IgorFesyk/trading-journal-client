import { api } from '@shared/lib/api'

import type { Account } from '../account.type'

export function getAccountsApi() {
    return api.get<Account[]>('/accounts').then((r) => r.data)
}
