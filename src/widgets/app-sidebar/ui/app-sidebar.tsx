import { ArrowsLeftRight, ChartLine, Gear, SquaresFour } from '@phosphor-icons/react'
import * as Sentry from '@sentry/react'
import { NavLink, Outlet, useParams } from 'react-router'

import { AccountSwitcher } from '@features/account'
import { LogRecordButton } from '@features/log-record'

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
    { path: 'transactions', label: 'Transactions', icon: ArrowsLeftRight },
]

const workspaceItems = [{ path: 'settings', label: 'Settings', icon: Gear }]

export function AppSidebar() {
    const { accountId } = useParams()

    function navTo(path: string) {
        return `/accounts/${accountId}/${path}`
    }

    return (
        <div className="h-svh overflow-hidden">
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
                                    <SidebarMenuItem key={'test-btn'}>
                                        <ErrorButton />
                                    </SidebarMenuItem>
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
                        <span className="px-2 text-xs text-muted-foreground">v{__APP_VERSION__}</span>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset>
                    <header className="flex shrink-0 items-center gap-4 border-b p-2">
                        <SidebarTrigger />
                        <AccountHeader />
                        <div className="ml-auto">
                            <LogRecordButton />
                        </div>
                    </header>
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

function ErrorButton() {
    return (
        <button
            onClick={() => {
                // Send a log before throwing the error
                Sentry.logger.info('User triggered test error', {
                    action: 'test_error_button_click',
                })
                // Send a test metric before throwing the error
                Sentry.metrics.count('test_counter', 1)
                throw new Error('This is your first error!')
            }}
        >
            Break the world
        </button>
    )
}
