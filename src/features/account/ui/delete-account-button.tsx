import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { type Account, accountQueryKeys, deleteAccountApi } from '@entities/account'

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

type DeleteAccountButtonProps = {
    account: Account
}

export function DeleteAccountButton(props: DeleteAccountButtonProps) {
    const { account } = props

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteAccountApi(account.id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: accountQueryKeys.all() })
            navigate('/accounts')
        },
    })

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isPending}>
                    Delete account
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {account.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes the account and all of its trades and transactions. This cannot be
                        undone.
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
