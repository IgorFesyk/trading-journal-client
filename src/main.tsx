import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { AuthProvider } from '@features/auth/index.ts'

import { ThemeProvider } from '@shared/ui/theme-provider.tsx'

import App from './app.tsx'
import './index.css'

const queryClient = new QueryClient()

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
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
)
