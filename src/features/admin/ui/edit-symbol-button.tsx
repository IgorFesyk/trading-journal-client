import { PencilSimple } from '@phosphor-icons/react'
import { useState } from 'react'

import type { Symbol } from '@entities/symbol'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog'

import { EditSymbolForm } from './edit-symbol-form'

type EditSymbolButtonProps = { symbol: Symbol }

export function EditSymbolButton(props: EditSymbolButtonProps) {
    const { symbol } = props

    const [open, setOpen] = useState(false)

    return (
        <>
            <Button type="button" variant="ghost" size="icon-xs" aria-label="Edit symbol" onClick={() => setOpen(true)}>
                <PencilSimple />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit {symbol.name}</DialogTitle>
                    </DialogHeader>

                    <EditSymbolForm symbol={symbol} onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    )
}
