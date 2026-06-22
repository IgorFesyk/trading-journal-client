import { getTransactionsApi } from './api/get-transactions.api'

export const transactionQueryKeys = {
    transactionsByAccountId: (accountId: number) => ['transactions', accountId],
}

export const transactionQueries = {
    transactionsByAccountId: (accountId: number) => ({
        queryKey: transactionQueryKeys.transactionsByAccountId(accountId),
        queryFn: () => getTransactionsApi(accountId),
        enabled: !!accountId,
    }),
}
