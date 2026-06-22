import axios, { AxiosError, type AxiosResponse } from 'axios'

import { localStorageManager } from './local-storage-manager'

declare module 'axios' {
    interface InternalAxiosRequestConfig {
        _retry?: boolean
    }
}

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
})

// Attach the access token to every outgoing request
api.interceptors.request.use((request) => {
    const token = localStorageManager.getAccessToken()
    if (token) {
        request.headers.Authorization = `Bearer ${token}`
    }

    return request
})

// Shared in-flight refresh - all concurrent 401s await the same promise instead of each triggering their own refresh
let refreshPromise: Promise<void> | null = null
const UNPROTECTED_URLS = ['/auth/sign-in', '/auth/sign-up', '/auth/refresh']

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const config = error.config

        // Pass through non-401 errors and requests that have already been retried once
        if (
            error.response?.status !== 401 ||
            !config ||
            config._retry ||
            !localStorageManager.getAccessToken() ||
            UNPROTECTED_URLS.some((url) => config?.url?.endsWith(url))
        ) {
            throw error
        }

        // Mark so the retried request doesn't trigger another refresh cycle on a subsequent 401
        config._retry = true

        if (!refreshPromise) {
            refreshPromise = (async () => {
                try {
                    const { data } = await api.post<{ accessToken: string }>('/auth/refresh')
                    localStorageManager.setAccessToken(data.accessToken)
                } catch (err) {
                    // Refresh failed - clear the token and send the user to sign-in
                    localStorageManager.removeAccessToken()

                    // TODO: find a better way
                    window.location.href = '/sign-in'

                    throw err
                } finally {
                    // Reset so the next expiry starts a fresh refresh
                    refreshPromise = null
                }
            })()
        }

        try {
            await refreshPromise
        } catch {
            throw error // original 401 error, not the refresh error
        }

        return api(config)
    }
)
