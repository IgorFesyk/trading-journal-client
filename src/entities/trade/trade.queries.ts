import { getTradesApi } from './api/get-trades.api'

export const tradeQueryKeys = {
    tradesByAccountId: (accountId: number) => ['trades', accountId],
}

export const tradeQueries = {
    getTradesByAccountId: (accountId: number) => ({
        queryKey: tradeQueryKeys.tradesByAccountId(accountId),
        queryFn: () => getTradesApi({ accountId }),
        enabled: !!accountId,
    }),
}
