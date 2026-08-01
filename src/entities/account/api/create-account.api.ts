import { api } from '@shared/lib/api'
import { toCents } from '@shared/lib/format'

import type { Account, Currency } from '../account.types'

type CreateAccountRequest = {
    name: string
    currency: Currency
    startingEquity: number
}

export async function createAccountApi(data: CreateAccountRequest) {
    const response = await api.post<Account>('/accounts', {
        ...data,
        startingEquity: toCents(data.startingEquity),
    })

    return response.data
}
