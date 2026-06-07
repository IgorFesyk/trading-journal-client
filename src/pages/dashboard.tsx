import { logoutApi, useAuth } from '@features/auth'

import { localStorageManager } from '@shared/lib'

export const Dashboard = () => {
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
            Dashboard <button onClick={handleLogout}>Logout</button>
        </div>
    )
}
