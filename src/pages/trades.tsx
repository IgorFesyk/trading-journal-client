import { logoutApi, useAuth } from '@features/auth'

import { localStorageManager } from '@shared/lib'

export const Trades = () => {
    const { setUser } = useAuth()

    const handleLogout = async () => {
        try {
            await logoutApi()
        } finally {
            setUser(null)
            localStorageManager.removeAccessToken()
        }
    }

    return (
        <div>
            Trades <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
