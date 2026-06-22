import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'

import { accountQueries } from '@entities/account'

export function AccountGuard() {
    const { data: accounts = [], isLoading, isError } = useQuery(accountQueries.all())

    if (isLoading) {
        return null
    } else if (isError) {
        // TODO: handle errors
        console.error('Error happened while fetching accounts')
    } else if (accounts.length <= 0) {
        return <Navigate to={`/accounts/new`} replace />
    } else {
        return <Navigate to={`/accounts/${accounts[0].id}/dashboard`} replace />
    }
}
