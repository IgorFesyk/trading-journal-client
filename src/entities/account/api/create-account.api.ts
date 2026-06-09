import { api } from '@shared/lib/api'

import type { Account, AccountType, Currency } from '../account.type'

type CreateAccountRequest = {
    name: string
    type: AccountType
    currency: Currency
    startingEquity: number
    targetEquity?: number
}

export function createAccountApi(data: CreateAccountRequest) {
    return api
        .post<Account>('/accounts', {
            ...data,
            startingEquity: Math.round(data.startingEquity * 100),
            targetEquity: data.targetEquity ? Math.round(data.targetEquity * 100) : undefined,
        })
        .then((r) => r.data)
}
