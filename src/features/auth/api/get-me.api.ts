import type { User } from '@entities/user'

import { api } from '@shared/lib/api'

export async function getMeApi() {
    const response = await api.get<User>('/users/me')
    return response.data
}
