const ACCESS_TOKEN_KEY = 'trading-journal-access-token'

export const localStorageManager = {
    setAccessToken: (token: string) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, token)
    },
    getAccessToken: () => {
        return localStorage.getItem(ACCESS_TOKEN_KEY)
    },
    removeAccessToken: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
    },
}
