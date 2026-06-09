import { Navigate } from 'react-router'

import { SignUpForm } from '@features/auth/ui/sign-up-form'

import { useAuth } from '../features/auth/lib/use-auth'

export const SignUp = () => {
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
