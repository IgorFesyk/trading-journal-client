import { CaretUpDown } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate, useParams } from 'react-router'

import { getAccountsApi } from '@entities/account'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@shared/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@shared/ui/sidebar'

export function AccountSwitcher() {
    const { data: accounts = [] } = useQuery({
        queryKey: ['accounts'],
        queryFn: getAccountsApi,
    })

    const { accountId } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const currentAccount = accounts.find((a) => String(a.id) === accountId)

    function handleChange(id: string) {
        navigate(location.pathname.replace(`/accounts/${accountId}/`, `/accounts/${id}/`))
    }

    if (!currentAccount) return null

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg">
                            <div className="flex min-w-0 flex-col items-start">
                                <span className="truncate font-semibold">{currentAccount.name}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {currentAccount.type} · {currentAccount.currency}
                                </span>
                            </div>
                            <CaretUpDown className="ml-auto shrink-0" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="start" className="w-56">
                        {accounts.map((account) => (
                            <DropdownMenuItem key={account.id} onClick={() => handleChange(String(account.id))}>
                                <span className="min-w-0 truncate">{account.name}</span>
                                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                                    {account.type} · {account.currency}
                                </span>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
