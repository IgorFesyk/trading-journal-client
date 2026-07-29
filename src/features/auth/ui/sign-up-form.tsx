import { type FormEvent, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import * as z from 'zod'

import { getErrorMessage, localStorageManager } from '@shared/lib'
import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@shared/ui/field'
import { Input } from '@shared/ui/input'

import { signUpApi } from '../api/sign-up.api'
import { useAuth } from '../lib/use-auth'
import { useGoogleSignIn } from '../lib/use-google-sign-in'

const SignUpFormSchema = z.object({
    name: z.string('Name must be a string').nonempty('Name is required').max(50, 'Name must be at most 50 characters'),
    email: z.email('Email must be a valid email address'),
    password: z.string('Password is required').min(8, 'Password must be at least 8 characters'),
})

export function SignUpForm() {
    const navigate = useNavigate()
    const { setUser } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const [isPending, setIsPending] = useState(false)

    const googleButtonRef = useRef<HTMLDivElement>(null)
    useGoogleSignIn(googleButtonRef, { text: 'signup_with', onError: setError })

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)

        const formData = new FormData(event.currentTarget)
        const result = SignUpFormSchema.safeParse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
        })

        if (!result.success) {
            setError(result.error.issues[0]?.message ?? 'Please check the form and try again.')
            return
        }

        setIsPending(true)
        try {
            const response = await signUpApi(result.data)
            localStorageManager.setAccessToken(response.accessToken)
            setUser(response.user)
            navigate('/accounts')
        } catch (err: unknown) {
            setError(getErrorMessage(err) ?? 'Failed to sign up. Please try again.')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Login with your Google account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} onChange={() => setError(null)}>
                        <FieldGroup>
                            <Field>
                                <div ref={googleButtonRef} />
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <Field>
                                <FieldLabel htmlFor="name">Username</FieldLabel>
                                <Input
                                    disabled={isPending}
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="JohnDoe"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    disabled={isPending}
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a href="#" className="ml-auto text-xs underline-offset-4 hover:underline">
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input disabled={isPending} id="password" name="password" type="password" required />
                            </Field>
                            {error && <p className="text-center text-xs text-destructive">{error}</p>}
                            <Field>
                                <Button disabled={isPending} type="submit">
                                    Sign Up
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <Link to="/sign-in">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    )
}
