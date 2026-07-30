import { PencilSimple } from '@phosphor-icons/react'
import { useState } from 'react'

import type { Transaction } from '@entities/transaction'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog'

import { TransactionForm } from './transaction-form'

type EditTransactionButtonProps = { transaction: Transaction }

export function EditTransactionButton(props: EditTransactionButtonProps) {
    const { transaction } = props

    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Edit transaction"
                onClick={() => setOpen(true)}
            >
                <PencilSimple />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                    </DialogHeader>

                    <TransactionForm transaction={transaction} onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    )
}
