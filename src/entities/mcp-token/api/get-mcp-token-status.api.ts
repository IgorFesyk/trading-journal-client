import { api } from '@shared/lib/api'

import type { McpTokenStatus } from '../mcp-token.types'

export async function getMcpTokenStatusApi() {
    const response = await api.get<McpTokenStatus>('/mcp/token')
    return response.data
}
