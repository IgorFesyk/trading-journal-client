import { api } from '@shared/lib/api'

import type { Direction, ExecutionSetup, Timeframe, Trade, TradeStatus } from '../trade.types'

type UpdateTradeInput = {
    accountId: number
    id: number
    direction?: Direction
    entryTF?: Timeframe
    setup?: ExecutionSetup
    status?: TradeStatus
    risk?: number
    openedAt?: string
    pnl?: number
    commission?: number
    notes?: string
    closedAt?: string
}

export async function updateTradeApi(input: UpdateTradeInput) {
    const { accountId, id, ...body } = input
    return api.put<Trade>(`/accounts/${accountId}/trades/${id}`, body).then((r) => r.data)
}
