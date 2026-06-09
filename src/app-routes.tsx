import { Navigate, Route, Routes } from 'react-router'

import { CreateAccount } from '@pages/create-account'
import { Dashboard } from '@pages/dashboard'
import { SignIn } from '@pages/sign-in'
import { SignUp } from '@pages/sign-up'
import { Trades } from '@pages/trades'

import { MainLayout } from '@widgets/main-layout'

import { AccountGuard } from '@features/account'
import { ProtectedRoute } from '@features/auth'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/accounts" element={<AccountGuard />} />
                <Route path="/accounts/new" element={<CreateAccount />} />

                <Route path="/accounts/:accountId" element={<MainLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="trades" element={<Trades />} />
                </Route>
            </Route>

            <Route path="/" element={<Navigate to="/accounts" replace />} />
        </Routes>
    )
}
