import { getSymbolsApi } from './api/get-symbols.api'

export const symbolQueryKeys = {
    all: () => ['symbols'],
}

export const symbolQueries = {
    all: () => ({
        queryKey: symbolQueryKeys.all(),
        queryFn: getSymbolsApi,
    }),
}
