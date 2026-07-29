import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { generateMcpTokenApi, mcpTokenQueries, mcpTokenQueryKeys, revokeMcpTokenApi } from '@entities/mcp-token'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@shared/ui/alert-dialog'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'

import { GeneratedTokenDialog } from './generated-token-dialog'

const MASKED_TOKEN = '*'.repeat(48)

export function McpTokenField() {
    const queryClient = useQueryClient()
    const { data, isLoading } = useQuery(mcpTokenQueries.status())
    const [generatedToken, setGeneratedToken] = useState<string | null>(null)

    const generateMutation = useMutation({
        mutationFn: generateMcpTokenApi,
        onSuccess: async (result) => {
            setGeneratedToken(result.token)
            await queryClient.invalidateQueries({ queryKey: mcpTokenQueryKeys.status() })
        },
    })

    const revokeMutation = useMutation({
        mutationFn: revokeMcpTokenApi,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: mcpTokenQueryKeys.status() })
        },
    })

    if (isLoading) return null

    return (
        <>
            <div className="flex items-end gap-2">
                <Input readOnly value={data?.hasToken ? MASKED_TOKEN : ''} placeholder="No token generated yet" />

                {data?.hasToken ? (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={revokeMutation.isPending}>
                                Revoke
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Revoke AI tool access?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Any AI tool currently using this token will immediately lose access to your trading
                                    journal. You can generate a new token at any time.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => revokeMutation.mutate()}
                                    disabled={revokeMutation.isPending}
                                >
                                    Revoke
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : (
                    <Button onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
                        Generate token
                    </Button>
                )}
            </div>

            <GeneratedTokenDialog token={generatedToken} onOpenChange={(open) => !open && setGeneratedToken(null)} />
        </>
    )
}
