import { UserRoleSelect } from '@features/admin'

import type { User } from '@entities/user'

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

type UserRowProps = {
    user: User
    isCurrentUser: boolean
}

export function UserRow(props: UserRowProps) {
    const { user, isCurrentUser } = props

    return (
        <div className="flex items-center gap-6 border-b px-4 py-4 last:border-b-0">
            <div className="w-48 shrink-0">
                <span className="text-sm font-medium">{user.name}</span>
                {isCurrentUser && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
            </div>
            <div className="flex-1 text-sm text-muted-foreground">{user.email}</div>
            <div className="w-32 shrink-0 text-xs text-muted-foreground">{formatDate(user.createdAt)}</div>
            <div className="w-28 shrink-0">
                <UserRoleSelect user={user} disabled={isCurrentUser} />
            </div>
        </div>
    )
}
