# Trading Journal — Client

React SPA for the Trading Journal application. Provides authentication, multi-account management, trade logging, transaction tracking, and a performance dashboard with an equity curve.

## Stack

|                   |                                                |
| ----------------- | ---------------------------------------------- |
| **Framework**     | React 19 + TypeScript                          |
| **Build**         | Vite 7                                         |
| **Routing**       | React Router 7                                 |
| **Data fetching** | TanStack Query v5                              |
| **Forms**         | React Hook Form + Zod                          |
| **UI**            | shadcn/ui (Lyra style), Radix UI, Tailwind CSS |

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

The dev server proxies `/api/*` requests to the backend at `http://localhost:5000` (must be running separately).

Other scripts:

```bash
pnpm build        # type-check + production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm format       # prettier --write
```

## Architecture

The project follows **Feature-Sliced Design (FSD)**. Imports must only flow downward — a layer may only import from layers below it.

```
src/
├── pages/        # Thin route assemblers. No data fetching — compose widgets only.
├── widgets/      # Self-contained blocks. No cross-widget imports.
├── features/     # User actions (auth, account creation, log-record, etc.)
├── entities/     # Domain types + API call functions (account, trade, symbol, transaction, user)
└── shared/       # UI primitives, utility libs, hooks — zero domain knowledge
```

### Path aliases

```ts
@pages    → src/pages
@widgets  → src/widgets
@features → src/features
@entities → src/entities
@shared   → src/shared
```

Always use aliases — never relative `../../` imports across layer boundaries.

## Auth Flow

`AuthProvider` fires `getMeApi()` at module load time using React 19's `use()` + `Suspense`, blocking the initial render until the session resolves.

- Access token stored in `localStorage` via `localStorageManager`.
- Axios instance (`@shared/lib/api`) attaches the token as a `Bearer` header and handles silent refresh on 401 via a shared `refreshPromise` (deduplicates concurrent retries). Failed refresh hard-redirects to `/sign-in`.

## Key Conventions

- Monetary values are **integer cents** — use `formatCents(value, currency)` from `@shared/lib/format` for display.
- `risk` is stored in **basis points** (e.g. `152` = `1.52%`).
- Function declarations for components (not arrow functions); props accepted as an object, destructured in the body.
- Add new shadcn components via `npx shadcn@latest add <component>`.
