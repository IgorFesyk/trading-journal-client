import * as Sentry from '@sentry/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode, Suspense, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router'

import { AuthProvider } from '@features/auth'
import { ThemeProvider } from '@features/theme'

import App from './app.tsx'
import './index.css'

Sentry.init({
    dsn: 'https://4a93a4b30e1d936a3da804b773c5e150@o4511789637042176.ingest.us.sentry.io/4511789650542592',
    release: __APP_VERSION__,
    environment: import.meta.env.MODE,
    integrations: [
        Sentry.reactRouterBrowserTracingIntegration({
            useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
        }),
    ],
    tracePropagationTargets: ['https://trading-journal.site/'],
    tracesSampleRate: 1.0,
    dataCollection: {
        // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
        // https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#dataCollection
        // userInfo: false,
        // httpBodies: []
    },
    // Enable logs to be sent to Sentry
    enableLogs: true,
})

const queryClient = new QueryClient()

queryClient.setQueryDefaults(['symbols'], { staleTime: Infinity })
queryClient.setQueryDefaults(['accounts'], { staleTime: 5 * 60 * 1000 })

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={<div>Global Loading...</div>}>
                    <AuthProvider>
                        <ThemeProvider>
                            <App />
                        </ThemeProvider>
                    </AuthProvider>
                </Suspense>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
)
