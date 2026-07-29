import { api } from '@shared/lib/api'

export async function revokeMcpTokenApi() {
    await api.delete('/mcp/token')
}
