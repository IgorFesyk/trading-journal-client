import { api } from '@shared/lib/api'

import type { Role, User } from '../user.types'

export async function getUsersApi(role?: Role) {
    const response = await api.get<User[]>('/users', { params: { role } })
    return response.data
}
