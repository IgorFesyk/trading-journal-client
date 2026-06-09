import { api } from '@shared/lib/api'

import type { Direction, Trade, TradeStatus } from '../trade.types'

type GetTradesParams = {
    accountId: number
    status?: TradeStatus
    direction?: Direction
}

export async function getTradesApi({ accountId, status, direction }: GetTradesParams) {
    return await api
        .get<Trade[]>(`/accounts/${accountId}/trades`, { params: { status, direction } })
        .then((r) => r.data)
}
