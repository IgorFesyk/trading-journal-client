import { Navigate } from 'react-router'

import { SignInForm, useAuth } from '@features/auth'

export function SignIn() {
    const { user } = useAuth()

    if (user) return <Navigate to="/accounts" />
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-1/3">
                <SignInForm />
            </div>
        </div>
    )
}
