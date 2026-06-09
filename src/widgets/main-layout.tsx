import { NavLink, Outlet, useParams } from 'react-router'

import { AccountSwitcher } from '@features/account'

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from '@shared/ui/sidebar'

const navItems = [
    { path: 'dashboard', label: 'Dashboard' },
    { path: 'trades', label: 'Trades' },
]

export function MainLayout() {
    const { accountId } = useParams()

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <AccountSwitcher />
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {navItems.map(({ path, label }) => (
                            <SidebarMenuItem key={path}>
                                <NavLink to={`/accounts/${accountId}/${path}`}>
                                    {({ isActive }) => (
                                        <SidebarMenuButton isActive={isActive}>{label}</SidebarMenuButton>
                                    )}
                                </NavLink>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>

            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}
