import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { DeleteAccountButton } from '@features/account'

import { accountQueries } from '@entities/account'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'

export function Settings() {
    const { accountId } = useParams()
    const { data: accounts = [] } = useQuery(accountQueries.all())

    const account = accounts.find((a) => String(a.id) === accountId)

    if (!account) return null

    return (
        <div className="flex h-full flex-col gap-6 overflow-hidden">
            <div>
                <h1 className="font-heading text-2xl font-semibold">Settings</h1>
                <p className="text-xs text-muted-foreground">Manage this account</p>
            </div>

            <Card className="border-destructive/40">
                <CardHeader>
                    <CardTitle>Danger zone</CardTitle>
                    <CardDescription>
                        Deleting this account also deletes all of its trades and transactions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DeleteAccountButton account={account} />
                </CardContent>
            </Card>
        </div>
    )
}
