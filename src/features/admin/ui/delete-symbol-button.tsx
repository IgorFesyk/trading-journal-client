import { Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type Symbol, deleteSymbolApi, symbolQueryKeys } from '@entities/symbol'

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

type DeleteSymbolButtonProps = {
    symbol: Symbol
}

export function DeleteSymbolButton(props: DeleteSymbolButtonProps) {
    const { symbol } = props
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => deleteSymbolApi(symbol.id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: symbolQueryKeys.all() }),
    })

    const hasTrades = symbol.tradeCount > 0

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={hasTrades || isPending}
                    title={hasTrades ? `Cannot delete — ${symbol.tradeCount} trade(s) use this symbol` : undefined}
                >
                    <Trash />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {symbol.name}?</AlertDialogTitle>
                    <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
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
