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
npm install
npm run dev        # http://localhost:3000
```

The dev server proxies `/api/*` requests to the backend at `http://localhost:5000` (must be running separately).

Other scripts:

```bash
npm run build       # type-check + production build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run format      # prettier --write
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

## Admin

Users with the `ADMIN` role get an additional section at `/admin` (redirects to `/admin/users`), with its own sidebar (`widgets/admin-sidebar`):

- **Users** (`/admin/users`) — view all users, promote/demote between `USER` and `ADMIN`.
- **Symbols** (`/admin/symbols`) — add/remove trading symbols. A symbol can't be deleted while any trade references it, and names must be unique.

Access is enforced by `RequireAdmin` alongside the existing `ProtectedRoute`. This is a role-gated part of the same SPA and the same API — not a separate admin app or deployment. That's a deliberate simplification for this pet project; a real product with a support/ops team would run admin as its own app or subdomain, isolated from the customer-facing bundle.

## Key Conventions

- Monetary values are **integer cents** — use `formatCents(value, currency)` from `@shared/lib/format` for display.
- `risk` is stored in **basis points** (e.g. `152` = `1.52%`).
- Function declarations for components (not arrow functions); props accepted as an object, destructured in the body.
- Add new shadcn components via `npx shadcn@latest add <component>`.
