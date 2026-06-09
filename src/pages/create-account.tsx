import { CreateAccountForm } from '@features/account'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'

export function CreateAccount() {
    return (
        <div className="flex min-h-svh items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>Create your first account</CardTitle>
                        <CardDescription>Set up a trading account to get started.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreateAccountForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
