# Product Management Dashboard

A product management dashboard for viewing, searching, filtering, adding, editing, and
deleting products. Built to handle large datasets with URL-driven state, optimistic
mutations, and targeted cache updates.

## Tech Stack

| Concern | Choice |
| --- | --- |
| Build | Vite + React + TypeScript |
| UI | MUI v6 |
| Data / cache | TanStack Query v5 |
| Routing | React Router v6 (data router) |
| Forms | react-hook-form + Zod |
| Long lists | react-virtuoso |
| Mock API | MSW |

## Getting Started

Requires Node 18+.
```bash
npm install
npm run dev      # http://localhost:5173

Other scripts:

bash
npm run build     # type-check + production build
npm run preview   # serve the production build
npm run test      # unit tests (Vitest)
npm run lint      # ESLint

No backend setup needed. MSW intercepts requests in the browser and seeds a large
in-memory product dataset on start.

## Folder Structure


src/
├── app/            # Router, providers, theme, root layout
├── features/
│   └── products/
│       ├── api/        # Query/mutation hooks, query keys, HTTP client
│       ├── components/ # Table, filter bar, product form, dialogs
│       ├── schemas/    # Zod schemas (shared by form and API layer)
│       └── types/
├── mocks/          # MSW handlers, seed data, latency/error simulation
├── shared/         # Reusable UI, hooks, utils
└── main.tsx

Code is grouped by feature rather than by file type, so everything a product screen needs
lives in one place. `shared/` holds only genuinely cross-feature code.

## Architectural Decisions

**URL as the source of truth for list state.** Search term, status, category, and page live
in query parameters. Filters are shareable and reload-safe, the back button works as users
expect, and TanStack Query keys derive directly from the URL, so navigation and caching stay
in sync without a separate state store.

**Data router with route-driven dialogs.** `createBrowserRouter` lets `/products/new` and
`/products/:id/edit` be real routes rendered as dialogs. The edit route's `loader` calls
`ensureQueryData`, so the product is fetched before the dialog mounts, avoiding a
render-then-fetch waterfall and making both forms deep-linkable.

**Targeted cache writes over refetching.** Mutations use `setQueryData` to patch the single
changed item in the cached list and its detail entry. Optimistic updates snapshot the
previous cache in `onMutate` and restore it in `onError`, so a failed edit or delete rolls
back cleanly. The list is not refetched after a successful write.

**Zod schemas shared between form and validation layer.** One schema drives
react-hook-form resolution and typed API payloads. Cross-field rules (Electronics requ an async check against the
mock API, debounced SKU uniqueness is an async check against the
mock API, debounced and run on blur so it does not fire on every keystroke.

**Virtualized rows.** The table renders through react-virtuoso, keeping the DOM node count
flat regardless of dataset size. Pagination sits on top for predictable, linkable page state.

**Debounced search.** Input updates render immediately but the URL and query key update on a
trailing debounce, so typing does not spam the API.

## What I'd Improve With More Time

- **Bulk actions** — multi-select with a single optimistic batch mutation and partial-failure handling.
- **Broader test coverage** — currently focused on schema validation and cache-update logic; integration tests for the full optimistic-rollback path would add the most confidence.
- **Server-driven sorting and column visibility**, persisted per user.
- **Accessibility pass** — full keyboard and screen-reader audit of the virtualized table, which is the hardest part to get right.
- **Error boundaries per route segment** plus retry affordances, instead of the current app-level fallback.
- **Real API contract** — generate types from an OpenAPI spec to remove hand-written duplication between Zod schemas and server types.