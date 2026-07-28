import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@shared/ui/dialog'

import { CreateAccountForm } from './create-account-form'

type CreateAccountDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateAccountDialog(props: CreateAccountDialogProps) {
    const { open, onOpenChange } = props

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New account</DialogTitle>
                    <DialogDescription>Set up a new trading account.</DialogDescription>
                </DialogHeader>
                <CreateAccountForm onCreated={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    )
}
