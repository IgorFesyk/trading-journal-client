import type { User } from '@entities/user'

import { api } from '@shared/lib/api'

import type { SuccessAuthResponse } from '../types/auth.types'

type SignInRequest = Pick<User, 'email'> & {
    password: string
}

export async function signInApi(payload: SignInRequest) {
    const response = await api.post<SuccessAuthResponse>('/auth/sign-in', payload)
    return response.data
}
