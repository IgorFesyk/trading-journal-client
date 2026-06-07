import { api } from '@shared/lib/api'

export async function logoutApi() {
    return await api.post('/auth/logout')
}
