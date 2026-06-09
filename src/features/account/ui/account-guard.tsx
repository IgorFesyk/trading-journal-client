import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'

import { getAccountsApi } from '@entities/account'

export function AccountGuard() {
    const { data: accounts = [], isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: getAccountsApi,
    })

    if (isLoading) return null

    if (accounts.length > 0) {
        return <Navigate to={`/accounts/${accounts[0].id}/dashboard`} replace />
    }

    return null
}
