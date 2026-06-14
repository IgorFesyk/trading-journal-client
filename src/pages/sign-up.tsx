import { Navigate } from 'react-router'

import { SignUpForm, useAuth } from '@features/auth'

export function SignUp() {
    const { user } = useAuth()

    if (user) return <Navigate to="/accounts" />
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-1/3">
                <SignUpForm />
            </div>
        </div>
    )
}
