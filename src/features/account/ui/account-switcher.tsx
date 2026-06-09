import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate, useParams } from 'react-router'

import { getAccountsApi } from '@entities/account'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

export function AccountSwitcher() {
    const { data: accounts = [] } = useQuery({
        queryKey: ['accounts'],
        queryFn: getAccountsApi,
    })

    const { accountId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    function handleChange(id: string) {
        navigate(location.pathname.replace(`/accounts/${accountId}/`, `/accounts/${id}/`))
    }

    if (accounts.length === 0) return null

    return (
        <Select value={accountId ?? ''} onValueChange={handleChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
                {accounts.map((account) => (
                    <SelectItem key={account.id} value={String(account.id)}>
                        <span>{account.name}</span>
                        <span className="ml-1 text-xs text-muted-foreground">
                            {account.type} · {account.currency}
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
