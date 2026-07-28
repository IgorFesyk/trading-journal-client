import js from '@eslint/js'
import boundaries from 'eslint-plugin-boundaries'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
    {
        files: [
            'src/app/**/*.{ts,tsx}',
            'src/pages/**/*.{ts,tsx}',
            'src/widgets/**/*.{ts,tsx}',
            'src/features/**/*.{ts,tsx}',
            'src/entities/**/*.{ts,tsx}',
            'src/shared/**/*.{ts,tsx}',
        ],
        plugins: { boundaries },
        settings: {
            'import/resolver': {
                typescript: {
                    project: './tsconfig.app.json',
                },
            },
            'boundaries/elements': [
                { type: 'app', pattern: 'src/app/**' },
                { type: 'pages', pattern: 'src/pages/**' },
                { type: 'widgets', pattern: 'src/widgets/*', capture: ['slice'] },
                { type: 'features', pattern: 'src/features/*', capture: ['slice'] },
                { type: 'entities', pattern: 'src/entities/*', capture: ['slice'] },
                { type: 'shared', pattern: 'src/shared/*', capture: ['segment'] },
            ],
        },
        rules: {
            'boundaries/no-unknown-files': 'error',
            'boundaries/dependencies': [
                'error',
                {
                    default: 'disallow',
                    policies: [
                        {
                            from: { element: { type: 'app' } },
                            allow: {
                                element: { types: { anyOf: ['pages', 'widgets', 'features', 'entities', 'shared'] } },
                            },
                        },
                        {
                            from: { element: { type: 'pages' } },
                            allow: { element: { types: { anyOf: ['widgets', 'features', 'entities', 'shared'] } } },
                        },
                        {
                            from: { element: { type: 'widgets' } },
                            allow: { element: { types: { anyOf: ['features', 'entities', 'shared'] } } },
                        },
                        {
                            from: { element: { type: 'features' } },
                            allow: { element: { types: { anyOf: ['entities', 'shared'] } } },
                        },
                        {
                            from: { element: { type: 'entities' } },
                            allow: { element: { type: 'shared' } },
                        },
                        {
                            from: { element: { type: 'shared' } },
                            allow: { element: { type: 'shared' } },
                        },
                        // Public API: cross-slice imports into widgets/features/entities must go through their index.ts barrel
                        {
                            disallow: {
                                to: {
                                    element: {
                                        types: { anyOf: ['widgets', 'features', 'entities'] },
                                        fileInternalPath: '!index.ts',
                                    },
                                },
                            },
                            message:
                                'Import from the slice\'s public API (index.ts) instead of reaching into its internals.',
                        },
                    ],
                },
            ],
        },
    },
])
