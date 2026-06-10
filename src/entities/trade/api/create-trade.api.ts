import { api } from '@shared/lib/api'

import type { Direction, ExecutionSetup, Timeframe, Trade, TradeStatus } from '../trade.types'

type CreateTradeInput = {
    accountId: number
    symbolId: number
    direction: Direction
    entryTF: Timeframe
    setup: ExecutionSetup
    status: TradeStatus
    risk: number
    openedAt: string
    pnl?: number
    commission?: number
    notes?: string
    closedAt?: string
}

export async function createTradeApi(input: CreateTradeInput) {
    const { accountId, ...body } = input
    return api.post<Trade>(`/accounts/${accountId}/trades`, body).then((r) => r.data)
}
