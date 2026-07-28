import { ArrowLeft, Tag, Users } from '@phosphor-icons/react'
import { Link, NavLink, Outlet } from 'react-router'

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

const navItems = [
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/symbols', label: 'Symbols', icon: Tag },
]

export function AdminSidebar() {
    return (
        <div className="h-svh overflow-hidden">
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>
                        <Link to="/accounts" className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium">
                            <ArrowLeft size={12} />
                            Back to app
                        </Link>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Admin</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navItems.map(({ path, label, icon: Icon }) => (
                                        <SidebarMenuItem key={path}>
                                            <NavLink to={path}>
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
                        <span className="px-2 text-xs text-muted-foreground">v{__APP_VERSION__}</span>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset>
                    <header className="flex shrink-0 items-center gap-4 border-b p-2">
                        <SidebarTrigger />
                    </header>
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
