import type { User } from '@entities/user'

import { api } from '@shared/lib/api'

import type { SuccessAuthResponse } from '../types/auth.types'

type SignUpRequest = Pick<User, 'email' | 'name'> & {
    password: string
}

export async function signUpApi(payload: SignUpRequest) {
    const response = await api.post<SuccessAuthResponse>('/auth/sign-up', payload)
    return response.data
}
