import { useState } from 'react'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { Input } from '@shared/ui/input'

type GeneratedTokenDialogProps = {
    token: string | null
    onOpenChange: (open: boolean) => void
}

export function GeneratedTokenDialog(props: GeneratedTokenDialogProps) {
    const { token, onOpenChange } = props
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        if (!token) return
        await navigator.clipboard.writeText(token)
        setCopied(true)
    }

    function handleOpenChange(open: boolean) {
        if (!open) setCopied(false)
        onOpenChange(open)
    }

    return (
        <Dialog open={!!token} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Your AI tool token</DialogTitle>
                    <DialogDescription>
                        Copy this token now and paste it into your AI tool&apos;s configuration. For security, it won&apos;t
                        be shown again.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2">
                    <Input readOnly value={token ?? ''} className="font-mono" />
                    <Button type="button" variant="outline" onClick={handleCopy}>
                        {copied ? 'Copied' : 'Copy'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
