import { Navigate, Outlet } from 'react-router'

import { useAuth } from '../lib/use-auth'

export function RequireAdmin() {
    const { user } = useAuth()

    if (user?.role !== 'ADMIN') return <Navigate to="/" replace />
    return <Outlet />
}
