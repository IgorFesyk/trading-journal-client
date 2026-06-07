import type { User } from '@entities/user'

export type SuccessAuthResponse = {
    user: User
    tokens: {
        accessToken: string
        refreshToken: string
    }
}
