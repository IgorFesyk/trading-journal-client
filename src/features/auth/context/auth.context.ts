import { createContext } from 'react'

import type { User } from '@entities/user'

type AuthContextValue = {
    user: User | null
    setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
