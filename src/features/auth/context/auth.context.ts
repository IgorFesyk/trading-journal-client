import type { User } from '@entities/user'
import { createContext } from 'react'

type AuthContextValue = {
    user: User | null
    setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
