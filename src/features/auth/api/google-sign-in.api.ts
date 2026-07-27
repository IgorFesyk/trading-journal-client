import { api } from '@shared/lib/api'

import type { SuccessAuthResponse } from '../types/auth.types'

export async function googleSignInApi(credential: string) {
    const response = await api.post<SuccessAuthResponse>('/auth/google', { credential })
    return response.data
}
