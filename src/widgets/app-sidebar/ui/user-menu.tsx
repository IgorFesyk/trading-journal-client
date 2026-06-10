import { useNavigate, useParams } from 'react-router'

import { logoutApi, useAuth } from '@features/auth'

import { localStorageManager } from '@shared/lib'
import { Avatar, AvatarFallback } from '@shared/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@shared/ui/sidebar'

export function UserMenu() {
    const { user, setUser } = useAuth()
    const { accountId } = useParams()
    const navigate = useNavigate()

    const initials = user?.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    async function handleLogout() {
        try {
            await logoutApi()
        } finally {
            setUser(null)
            localStorageManager.removeAccessToken()
        }
    }

    function handleSettings() {
        navigate(`/accounts/${accountId}/settings`)
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg">
                            <Avatar className="size-8 rounded-none">
                                <AvatarFallback className="rounded-none bg-primary text-xs text-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-xs font-semibold">{user?.name}</span>
                                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="w-56">
                        <DropdownMenuItem onClick={handleSettings}>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
