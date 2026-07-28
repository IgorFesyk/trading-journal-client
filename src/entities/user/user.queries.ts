import { getUsersApi } from './api/get-users.api'
import type { Role } from './user.types'

export const userQueryKeys = {
    all: (role?: Role) => ['users', role ?? null],
}

export const userQueries = {
    all: (role?: Role) => ({
        queryKey: userQueryKeys.all(role),
        queryFn: () => getUsersApi(role),
    }),
}
