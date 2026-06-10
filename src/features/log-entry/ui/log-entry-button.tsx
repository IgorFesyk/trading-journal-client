import { Plus } from '@phosphor-icons/react'
import { useState } from 'react'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'

import { TradeForm } from './trade-form'
import { TransactionForm } from './transaction-form'

export function LogEntryButton() {
    const [open, setOpen] = useState(false)

    function handleSuccess() {
        setOpen(false)
    }

    return (
        <>
            <Button size="sm" onClick={() => setOpen(true)}>
                <Plus weight="bold" />
                Log Trade
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Log Entry</DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="trade">
                        <TabsList>
                            <TabsTrigger value="trade">Trade</TabsTrigger>
                            <TabsTrigger value="transaction">Transaction</TabsTrigger>
                        </TabsList>

                        <TabsContent value="trade">
                            <TradeForm onSuccess={handleSuccess} />
                        </TabsContent>

                        <TabsContent value="transaction">
                            <TransactionForm onSuccess={handleSuccess} />
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    )
}
