import { Navigate, Outlet, useLocation } from 'react-router'

import { useAuth } from '../lib/use-auth'

export function ProtectedRoute() {
    const { user } = useAuth()
    const location = useLocation()

    if (!user) return <Navigate to="/sign-in" state={{ from: location }} replace />
    return <Outlet />
}
