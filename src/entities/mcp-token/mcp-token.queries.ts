import { getMcpTokenStatusApi } from './api/get-mcp-token-status.api'

export const mcpTokenQueryKeys = {
    status: () => ['mcpTokenStatus'],
}

export const mcpTokenQueries = {
    status: () => ({
        queryKey: mcpTokenQueryKeys.status(),
        queryFn: getMcpTokenStatusApi,
    }),
}
