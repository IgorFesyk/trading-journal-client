import { Route, Routes } from 'react-router'

import { Dashboard } from '@pages/dashboard'
import { SignIn } from '@pages/sign-in'
import { SignUp } from '@pages/sign-up'
import { Trades } from '@pages/trades'

import { ProtectedRoute } from '@features/auth'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/trades" element={<Trades />} />
            </Route>
        </Routes>
    )
}
