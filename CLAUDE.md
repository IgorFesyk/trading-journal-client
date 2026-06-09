# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Type-check + Vite production build
npm run typecheck    # Run tsc without emitting
npm run lint         # ESLint
npm run format       # Prettier write
npm run format:check # Prettier check (CI)
```

No test runner is configured yet.

## Architecture

This is a React 19 + TypeScript SPA following **Feature-Sliced Design (FSD)** layering. Import direction is strict: lower layers cannot import from higher ones.

```
pages → widgets → features → entities → shared
```

### Path aliases

Each layer has a matching alias defined in `vite.config.ts` and `tsconfig.app.json`:

| Alias       | Path           |
| ----------- | -------------- |
| `@pages`    | `src/pages`    |
| `@widgets`  | `src/widgets`  |
| `@features` | `src/features` |
| `@entities` | `src/entities` |
| `@shared`   | `src/shared`   |

Always use these aliases — never relative `../../` imports across layer boundaries.

### Auth flow

`AuthProvider` (`src/features/auth/context/auth.provider.tsx`) fires a single `getMeApi()` call at module load time (outside the component) using React 19's `use()` + `Suspense`. The app wraps everything in `<Suspense>` at `main.tsx`, so auth resolution blocks the initial render.

- Access token is persisted in `localStorage` via `localStorageManager` (`src/shared/lib/local-storage-manager.ts`).
- The Axios instance (`src/shared/lib/api.ts`) attaches the token as a `Bearer` header on every request and handles silent refresh on 401s via a shared `refreshPromise` (deduplicates concurrent retries). After a failed refresh it hard-redirects to `/sign-in`.
- `ProtectedRoute` reads `useAuth()` and redirects unauthenticated users to `/sign-in`.

### API

All requests go through `src/shared/lib/api.ts` (Axios, `baseURL: '/api'`). In dev, Vite proxies `/api/*` to `http://localhost:5000` (backend must be running separately).

### UI components

shadcn/ui components are added via `npx shadcn@latest add <component>` and land in `src/shared/ui/`. The `components.json` config maps the shadcn aliases to the FSD `@shared/*` paths. Icon library is **Phosphor** (`@phosphor-icons/react`). Styling is Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, no `tailwind.config.*` file).

### Style

This project uses the **shadcn/ui Lyra style** (`"style": "radix-lyra"` in `components.json`). Lyra is sharp and boxy — zero border radius, monospace font throughout.

Rules to follow:
- Never use `rounded-full`, `rounded-lg`, `rounded-md`, or any other `rounded-*` class. Use `rounded-none` instead, or omit rounding entirely.
- `--radius` is set to `0rem`. Do not change it.
- When adding new shadcn components run `npx shadcn@latest add <component>` — the Lyra style is applied automatically via `components.json`.

### Conventions

- Use function declarations for React components and all other functions — not arrow functions assigned to variables.
