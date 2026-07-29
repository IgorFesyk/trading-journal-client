import { House } from '@phosphor-icons/react'
import { Link } from 'react-router'

import { Button } from '@shared/ui/button'

export function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
            <p className="font-heading text-6xl font-semibold text-muted-foreground">404</p>
            <div>
                <h1 className="font-heading text-xl font-semibold">Page not found</h1>
                <p className="text-sm text-muted-foreground">This page doesn't exist or was moved.</p>
            </div>
            <Button asChild>
                <Link to="/">
                    <House />
                    Back home
                </Link>
            </Button>
        </div>
    )
}
