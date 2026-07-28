import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, Navigate } from 'react-router'

import { CreateAccountDialog } from '@features/account'
import { useAuth } from '@features/auth'

import { accountQueries } from '@entities/account'

import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'

export function Accounts() {
    const { data: accounts = [], isLoading, isError } = useQuery(accountQueries.all())
    const [createOpen, setCreateOpen] = useState(false)
    const { user } = useAuth()

    if (isLoading) {
        return null
    } else if (isError) {
        // TODO: handle errors
        console.error('Error happened while fetching accounts')
    } else if (accounts.length > 0) {
        return <Navigate to={`/accounts/${accounts[0].id}/dashboard`} replace />
    }

    return (
        <div className="flex min-h-svh items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>No trading accounts yet</CardTitle>
                        <CardDescription>
                            Hi, {user?.name}, you don&apos;t have any trading accounts yet. Create one to start logging
                            trades.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button onClick={() => setCreateOpen(true)}>New account</Button>
                        {user?.role === 'ADMIN' && (
                            <Button variant="outline" asChild>
                                <Link to="/admin">Go to admin panel</Link>
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            <CreateAccountDialog open={createOpen} onOpenChange={setCreateOpen} />
        </div>
    )
}
