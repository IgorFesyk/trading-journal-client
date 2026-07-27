import { type RefObject, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { localStorageManager } from '@shared/lib'

import { googleSignInApi } from '../api/google-sign-in.api'
import { loadGoogleScript } from './load-google-script'
import { useAuth } from './use-auth'

type UseGoogleSignInOptions = {
    text: 'signin_with' | 'signup_with'
}

export function useGoogleSignIn(buttonRef: RefObject<HTMLDivElement | null>, options: UseGoogleSignInOptions) {
    const navigate = useNavigate()
    const { setUser } = useAuth()
    const { text } = options

    useEffect(() => {
        let cancelled = false

        loadGoogleScript().then(() => {
            if (cancelled || !buttonRef.current || !window.google) return

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    try {
                        const data = await googleSignInApi(response.credential)

                        localStorageManager.setAccessToken(data.accessToken)
                        setUser(data.user)
                        navigate('/accounts')
                    } catch (error: unknown) {
                        console.error(error)
                    }
                },
            })

            window.google.accounts.id.renderButton(buttonRef.current, {
                theme: 'outline',
                size: 'large',
                shape: 'rectangular',
                text,
                locale: 'en',
            })
        })

        return () => {
            cancelled = true
        }
    }, [buttonRef, navigate, setUser, text])
}
