import { ArrowLeft } from '@phosphor-icons/react'
import { Link } from 'react-router'

import { AccountsList } from '@widgets/accounts-list'

import { McpTokenField } from '@features/mcp-token'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'

export function Settings() {
    return (
        <div className="mx-auto flex h-svh max-w-5xl flex-col gap-6 overflow-y-auto p-6">
            <div className="flex items-center gap-4">
                <Link to="/accounts" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="size-5" />
                </Link>
                <div>
                    <h1 className="font-heading text-2xl font-semibold">Settings</h1>
                    <p className="text-xs text-muted-foreground">Manage your accounts and preferences</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>AI tool access</CardTitle>
                    <CardDescription>
                        Generate a long-lived token to connect an AI tool (MCP client) to your trading journal.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <McpTokenField />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Accounts</CardTitle>
                    <CardDescription>
                        Deleting an account also deletes all of its trades and transactions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AccountsList />
                </CardContent>
            </Card>
        </div>
    )
}
