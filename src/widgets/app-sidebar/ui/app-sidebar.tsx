import { ChartLine, Gear, SquaresFour } from '@phosphor-icons/react'
import { NavLink, Outlet, useParams } from 'react-router'

import { AccountSwitcher } from '@features/account'
import { LogEntryButton } from '@features/log-entry'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@shared/ui/sidebar'

import { AccountHeader } from './account-header'
import { UserMenu } from './user-menu'

const platformItems = [
    { path: 'dashboard', label: 'Dashboard', icon: SquaresFour },
    { path: 'trades', label: 'Trades', icon: ChartLine },
]

const workspaceItems = [{ path: 'settings', label: 'Settings', icon: Gear }]

export function AppSidebar() {
    const { accountId } = useParams()

    function navTo(path: string) {
        return `/accounts/${accountId}/${path}`
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <AccountSwitcher />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Platform</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {platformItems.map(({ path, label, icon: Icon }) => (
                                    <SidebarMenuItem key={path}>
                                        <NavLink to={navTo(path)}>
                                            {({ isActive }) => (
                                                <SidebarMenuButton isActive={isActive}>
                                                    <Icon />
                                                    <span className="font-normal">{label}</span>
                                                </SidebarMenuButton>
                                            )}
                                        </NavLink>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {workspaceItems.map(({ path, label, icon: Icon }) => (
                                    <SidebarMenuItem key={path}>
                                        <NavLink to={navTo(path)}>
                                            {({ isActive }) => (
                                                <SidebarMenuButton isActive={isActive}>
                                                    <Icon />
                                                    <span className="font-normal">{label}</span>
                                                </SidebarMenuButton>
                                            )}
                                        </NavLink>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <UserMenu />
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex h-10 shrink-0 items-center gap-4 border-b px-3">
                    <SidebarTrigger />
                    <AccountHeader />
                    <div className="ml-auto">
                        <LogEntryButton />
                    </div>
                </header>
                <div className="p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
