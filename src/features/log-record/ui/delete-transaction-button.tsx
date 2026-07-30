import { Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { accountQueryKeys } from '@entities/account'
import { deleteTransactionApi, transactionQueryKeys } from '@entities/transaction'
import type { Transaction } from '@entities/transaction'

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

type DeleteTransactionButtonProps = { transaction: Transaction }

export function DeleteTransactionButton(props: DeleteTransactionButtonProps) {
    const { transaction } = props

    const { accountId } = useParams()
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteTransactionApi(Number(accountId), transaction.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: transactionQueryKeys.transactionsByAccountId(Number(accountId)),
            })
            await queryClient.invalidateQueries({ queryKey: accountQueryKeys.stats(Number(accountId)) })
        },
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Delete transaction"
                    disabled={isPending}
                >
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes the transaction. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutate()} disabled={isPending}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
