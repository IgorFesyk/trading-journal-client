import { PencilSimple } from '@phosphor-icons/react'
import { useState } from 'react'

import type { Trade } from '@entities/trade'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog'

import { TradeForm } from './trade-form'

type EditTradeButtonProps = { trade: Trade }

export function EditTradeButton(props: EditTradeButtonProps) {
    const { trade } = props

    const [open, setOpen] = useState(false)

    return (
        <>
            <Button type="button" variant="ghost" size="icon-xs" aria-label="Edit trade" onClick={() => setOpen(true)}>
                <PencilSimple />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Trade</DialogTitle>
                    </DialogHeader>

                    <TradeForm trade={trade} onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    )
}
