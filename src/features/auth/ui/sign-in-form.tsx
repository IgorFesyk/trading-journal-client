import { useActionState, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'

import { localStorageManager } from '@shared/lib'
import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@shared/ui/field'
import { Input } from '@shared/ui/input'

import { signInApi } from '../api/sign-in.api'
import { useAuth } from '../lib/use-auth'
import { useGoogleSignIn } from '../lib/use-google-sign-in'

const SignInFormSchema = z.object({
    email: z.email('Email must be a valid email address'),
    password: z.string('Password is required').min(8, 'Password must be at least 8 characters'),
})

export function SignInForm() {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const googleButtonRef = useRef<HTMLDivElement>(null)
    useGoogleSignIn(googleButtonRef, { text: 'signin_with' })

    const [, action, isPending] = useActionState(async (_prev: unknown, formData: FormData) => {
        const result = SignInFormSchema.safeParse({
            email: formData.get('email'),
            password: formData.get('password'),
        })

        if (!result.success) {
            // TODO: handle error state
            console.log(result.error)
            return
        }

        try {
            const response = await signInApi(result.data)

            localStorageManager.setAccessToken(response.accessToken)
            setUser(response.user)
            navigate('/accounts')
        } catch (error: unknown) {
            // TODO: handle error state
            console.error(error)
        }
    }, null)

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>Login with your Google account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action}>
                        <FieldGroup>
                            <Field>
                                <div ref={googleButtonRef} />
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
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
                                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input disabled={isPending} name="password" id="password" type="password" required />
                            </Field>
                            <Field>
                                <Button disabled={isPending} type="submit">
                                    Sign In
                                </Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
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
