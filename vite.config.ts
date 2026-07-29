import { sentryVitePlugin } from '@sentry/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import path from 'path'
import { defineConfig } from 'vite'

const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, './package.json'), 'utf-8'))

export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
    plugins: [
        {
            name: 'serve-version-json',
            configureServer(server) {
                server.middlewares.use('/version.json', (_, res) => {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ version: packageJson.version }))
                })
            },
        },
        react(),
        tailwindcss(),
        sentryVitePlugin({
            org: 'ihor-fesyk',
            project: 'trading-journal-client',
            authToken: process.env.SENTRY_AUTH_TOKEN,
            sourcemaps: {
                filesToDeleteAfterUpload: ['./dist/**/*.map'],
            },
        }),
    ],
    define: {
        __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    build: {
        sourcemap: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@app': path.resolve(__dirname, './src/app'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@widgets': path.resolve(__dirname, './src/widgets'),
            '@features': path.resolve(__dirname, './src/features'),
            '@entities': path.resolve(__dirname, './src/entities'),
            '@shared': path.resolve(__dirname, './src/shared'),
        },
    },
})
