import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { AuthProvider } from '@features/auth'

import { ThemeProvider } from '@shared/ui/theme-provider'

import App from './app.tsx'
import './index.css'

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
