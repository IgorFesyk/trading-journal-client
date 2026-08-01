import { DeleteAccountButton } from '@features/account'

import type { Account } from '@entities/account'

import { formatCents } from '@shared/lib'

type AccountRowProps = {
    account: Account
}

export function AccountRow(props: AccountRowProps) {
    const { account } = props

    return (
        <div className="flex items-center gap-6 border-b px-4 py-4 last:border-b-0">
            <div className="w-48 shrink-0 text-sm font-medium">{account.name}</div>
            <div className="w-24 shrink-0 text-xs text-muted-foreground">{account.currency}</div>
            <div className="flex-1 text-sm text-muted-foreground">
                {formatCents(account.startingEquity, account.currency)}
            </div>
            <div className="w-40 shrink-0 text-right">
                <DeleteAccountButton account={account} />
            </div>
        </div>
    )
}
