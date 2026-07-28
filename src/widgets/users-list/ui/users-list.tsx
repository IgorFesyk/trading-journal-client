import { useQuery } from '@tanstack/react-query'

import { useAuth } from '@features/auth'

import { userQueries } from '@entities/user'

import { UserRow } from './user-row'

export function UsersList() {
    const { user: currentUser } = useAuth()
    const { data: users = [], isLoading } = useQuery(userQueries.all())

    return (
        <div>
            <div className="mb-6 flex items-baseline gap-3">
                <h1 className="text-lg font-semibold">Users</h1>
                {!isLoading && <span className="text-sm text-muted-foreground">{users.length} total</span>}
            </div>

            {isLoading ? (
                <Skeleton />
            ) : users.length === 0 ? (
                <div className="border py-16 text-center text-sm text-muted-foreground">No users yet</div>
            ) : (
                <div className="border">
                    <div className="flex items-center gap-6 border-b bg-muted/50 px-4 py-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                        <span className="w-48 shrink-0">Name</span>
                        <span className="flex-1">Email</span>
                        <span className="w-32 shrink-0">Joined</span>
                        <span className="w-28 shrink-0">Role</span>
                    </div>
                    {users.map((user) => (
                        <UserRow key={user.id} user={user} isCurrentUser={user.id === currentUser?.id} />
                    ))}
                </div>
            )}
        </div>
    )
}

function Skeleton() {
    return (
        <div className="divide-y border">
            <div className="flex items-center gap-6 border-b bg-muted/50 px-4 py-2 text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                <span className="w-48 shrink-0">Name</span>
                <span className="flex-1">Email</span>
                <span className="w-32 shrink-0">Joined</span>
                <span className="w-28 shrink-0">Role</span>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-6 px-4 py-4">
                    <div className="h-4 w-48 animate-pulse bg-muted" />
                    <div className="h-4 flex-1 animate-pulse bg-muted" />
                    <div className="h-4 w-32 animate-pulse bg-muted" />
                    <div className="h-4 w-28 animate-pulse bg-muted" />
                </div>
            ))}
        </div>
    )
}
