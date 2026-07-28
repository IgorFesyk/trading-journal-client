import { api } from '@shared/lib/api'

import type { Role, User } from '../user.types'

export async function updateUserRoleApi(id: string, role: Role) {
    const response = await api.patch<User>(`/users/${id}/role`, { role })
    return response.data
}
