import type { User } from '@entities/user'

export type SuccessAuthResponse = {
    accessToken: string
    user: User
}
