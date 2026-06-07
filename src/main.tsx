import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import { AuthProvider } from '@features/auth/index.ts'

import { ThemeProvider } from '@shared/ui/theme-provider.tsx'

import App from './app.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Suspense fallback={<div>Global Loading...</div>}>
                <AuthProvider>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </AuthProvider>
            </Suspense>
        </BrowserRouter>
    </StrictMode>
)
