import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type Role, type User, updateUserRoleApi, userQueryKeys } from '@entities/user'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

type UserRoleSelectProps = {
    user: User
    disabled?: boolean
}

export function UserRoleSelect(props: UserRoleSelectProps) {
    const { user, disabled } = props
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: (role: Role) => updateUserRoleApi(user.id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userQueryKeys.all() })
        },
    })

    function handleChange(value: string) {
        if (value === 'ADMIN' || value === 'USER') {
            mutate(value)
        }
    }

    return (
        <Select value={user.role} onValueChange={handleChange} disabled={disabled || isPending}>
            <SelectTrigger className="w-28">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
        </Select>
    )
}
