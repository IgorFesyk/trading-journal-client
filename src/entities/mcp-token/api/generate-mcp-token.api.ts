import { api } from '@shared/lib/api'

export async function generateMcpTokenApi() {
    const response = await api.post<{ token: string }>('/mcp/token')
    return response.data
}
