import { AccountStats } from '@widgets/account-stats'
import { EquityCurve } from '@widgets/equity-curve'
import { OpenPositions } from '@widgets/open-positions'

export function Dashboard() {
    return (
        <div className="flex h-full flex-col gap-6 overflow-hidden">
            <div>
                <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
                <p className="text-xs text-muted-foreground">Performance overview</p>
            </div>

            <AccountStats />

            <div className="grid min-h-0 flex-1 grid-cols-3 gap-4">
                <div className="col-span-2">
                    <EquityCurve />
                </div>
                <OpenPositions />
            </div>
        </div>
    )
}
