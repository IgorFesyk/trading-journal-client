import * as Sentry from '@sentry/react'
import { Navigate, Route, Routes } from 'react-router'

import { Accounts } from '@pages/accounts'
import { AdminSymbols } from '@pages/admin-symbols'
import { AdminUsers } from '@pages/admin-users'
import { AdminVersions } from '@pages/admin-versions'
import { Dashboard } from '@pages/dashboard'
import { Settings } from '@pages/settings'
import { SignIn } from '@pages/sign-in'
import { SignUp } from '@pages/sign-up'
import { Trades } from '@pages/trades'
import { Transactions } from '@pages/transactions'

import { AdminSidebar } from '@widgets/admin-sidebar'
import { AppSidebar } from '@widgets/app-sidebar'

import { RequireAccount } from '@features/account'
import { ProtectedRoute, RequireAdmin } from '@features/auth'

const SentryRoutes = Sentry.wrapReactRouterRouting(Routes)

export function AppRoutes() {
    return (
        <SentryRoutes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/settings" element={<Settings />} />

                <Route element={<RequireAccount />}>
                    <Route path="/accounts/:accountId" element={<AppSidebar />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="trades" element={<Trades />} />
                        <Route path="transactions" element={<Transactions />} />
                    </Route>
                </Route>

                <Route element={<RequireAdmin />}>
                    <Route path="/admin" element={<AdminSidebar />}>
                        <Route index element={<Navigate to="/admin/users" replace />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="symbols" element={<AdminSymbols />} />
                        <Route path="versions" element={<AdminVersions />} />
                    </Route>
                </Route>
            </Route>

            <Route path="/" element={<Navigate to="/accounts" replace />} />
        </SentryRoutes>
    )
}
