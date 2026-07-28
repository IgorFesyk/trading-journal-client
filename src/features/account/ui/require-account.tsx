import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useParams } from 'react-router'

import { accountQueries } from '@entities/account'

export function RequireAccount() {
    const { accountId } = useParams()
    const { data: accounts = [], isLoading } = useQuery(accountQueries.all())

    if (isLoading) return null

    const accountExists = accounts.some((account) => String(account.id) === accountId)
    if (!accountExists) return <Navigate to="/accounts" replace />

    return <Outlet />
}
