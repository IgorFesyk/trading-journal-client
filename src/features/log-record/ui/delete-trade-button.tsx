import { Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { accountQueryKeys } from '@entities/account'
import { deleteTradeApi, tradeQueryKeys } from '@entities/trade'
import type { Trade } from '@entities/trade'

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

type DeleteTradeButtonProps = { trade: Trade }

export function DeleteTradeButton(props: DeleteTradeButtonProps) {
    const { trade } = props

    const { accountId } = useParams()
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteTradeApi(Number(accountId), trade.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: tradeQueryKeys.tradesByAccountId(Number(accountId)) })
            await queryClient.invalidateQueries({ queryKey: accountQueryKeys.stats(Number(accountId)) })
        },
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button type="button" variant="ghost" size="icon-xs" aria-label="Delete trade" disabled={isPending}>
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this trade?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes the trade. This cannot be undone.
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
