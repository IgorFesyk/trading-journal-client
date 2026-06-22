import { getAccountStatsApi } from './api/get-account-stats.api'
import { getAccountsApi } from './api/get-accounts.api'

export const accountQueryKeys = {
    all: () => ['accounts'],
    stats: (accountId: number) => ['accountStats', accountId],
}

export const accountQueries = {
    all: () => ({
        queryKey: accountQueryKeys.all(),
        queryFn: getAccountsApi,
    }),
    getStats: (accountId: number) => ({
        queryKey: accountQueryKeys.stats(accountId),
        queryFn: () => getAccountStatsApi(accountId),
        enabled: !!accountId,
    }),
}
