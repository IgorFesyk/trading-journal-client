import { api } from '@shared/lib/api'
import { toCents } from '@shared/lib/format'

import type { Account, AccountType, Currency } from '../account.types'

type CreateAccountRequest = {
    name: string
    type: AccountType
    currency: Currency
    startingEquity: number
    targetEquity?: number
}

export async function createAccountApi(data: CreateAccountRequest) {
    const response = await api.post<Account>('/accounts', {
        ...data,
        startingEquity: toCents(data.startingEquity),
        targetEquity: data.targetEquity ? toCents(data.targetEquity) : undefined,
    })

    return response.data
}
