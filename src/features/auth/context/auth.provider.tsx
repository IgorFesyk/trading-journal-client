import { type ReactNode, use, useState } from 'react'

import type { User } from '@entities/user'

import { getMeApi } from '../api/get-me.api'
import { AuthContext } from './auth.context'

const sessionPromise = getMeApi().catch(() => null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const initialUser = use(sessionPromise)

    const [user, setUser] = useState<User | null>(initialUser)

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}
