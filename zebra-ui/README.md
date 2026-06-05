# zebra-ui

Next.js 15 admin portal for Houseclay. Used by internal staff to moderate listings, manage users, review leads, and perform platform administration at `zebra.houseclay.com`.

---

## Tech Stack

| Concern | Library |
|---------|---------|
| Framework | Next.js 15.3 (App Router) |
| UI | React 19, TypeScript 5.7 |
| Styling | Tailwind CSS 3.4 |
| State | Redux Toolkit 2.6 + redux-persist |
| API / Cache | RTK Query + TanStack React Query 5 |
| Forms | Formik 2 + Yup |
| HTTP | Axios 1.8 |
| Animation | Motion 12 (Framer) + Lottie |
| Maps | @vis.gl/react-google-maps |
| Tables | @heroui/table |
| E2E Testing | Playwright 1.54 |

---

## Folder Structure

```
zebra-ui/src/
├── app/                      # Next.js App Router pages
│
├── base-components/          # UI atoms (Button, TextField, Select…)
├── form-components/          # Formik-wired form fields
├── components/               # Domain feature components
├── layout-components/        # Header, Sidebar, Footer
├── dialogs/                  # Modal overlays
├── utility-components/       # Gallery, Maps, Tabs, Icons
├── hoc/                      # Higher-order components
│
├── store/
│   ├── store.ts
│   ├── adminAuthSlice.ts
│   ├── apiSlice.ts
│   ├── editPropertySlice.ts
│   ├── listPropertySlice.ts
│   └── [others]
│
├── providers/
│   ├── AuthProvider.tsx
│   ├── DeviceContextProvider.tsx
│   ├── DialogContextProvider.tsx
│   ├── SidebarContext.tsx
│   ├── QueryProvider.tsx
│   └── ReduxProvider.tsx
│
├── services/                 # Axios instances + API helpers
├── hooks/
│   ├── useAdminLogout.ts
│   ├── useGoogleMapsAPI.ts
│   ├── useS3Uploader.tsx
│   └── useS3Deleter.tsx
├── interfaces/
├── common/
├── utils/
└── middleware.ts             # Auth route protection

tests/
├── e2e/                      # Playwright end-to-end tests
└── fixtures/                 # Auth state & test data
```

---

## Architecture

### Relationship to `hc-frontend`

`zebra-ui` and `hc-frontend` share the same architectural DNA — both are Next.js 15 App Router apps with identical state management, provider patterns, and component organisation conventions. They are **separate deployments** with separate auth contexts.

Key differences:

| | zebra-ui | hc-frontend |
|-|----------|-------------|
| Auth | Admin token (`adminAuthSlice`) | User token (`authSlice`) |
| Navigation | Sidebar-based | Header-based |
| Tables | @heroui/table for data-heavy views | Not used |
| Testing | Playwright E2E | Storybook component stories |
| Extra context | `SidebarContext` | `StickyNavbarVisibilityProvider` |

### Auth Flow

Admins log in with credentials (no OTP). The admin token is persisted via redux-persist. `middleware.ts` guards all admin routes — unauthenticated requests redirect to the admin login page.

---

## Testing

`zebra-ui` uses **Playwright for E2E testing only** (no unit tests). Tests run against a live local stack.

### Configuration

- Base URL: `http://localhost:3001`
- Retries: 2 on CI, 0 locally
- Traces + videos retained on failure
- `global-setup.ts` — seeds auth state via API before tests
- `global-teardown.ts` — cleans up test data after suite

### Test ID Naming Convention

```
[scope]-[element]-[action/type]

Examples:
  property-list-table
  property-edit-button
  user-status-badge
```

### Running Tests

```bash
# All E2E tests
npx playwright test

# With Playwright UI
npx playwright test --ui

# Show last HTML report
npx playwright show-report
```

---

## Running Locally

### Docker

```bash
# From monorepo root
docker compose --profile zebra up
# → http://localhost:3001
```

### Local Node

```bash
cd zebra-ui
npm install

npm run dev:local    # HTTP (Docker backend)
npm run dev:hosted   # HTTPS with custom domain
```

### Environment Variables

| Variable | Dev default | Description |
|----------|-------------|-------------|
| `NEXT_PUBLIC_HOUSECLAY_API_BASE_URL` | `http://localhost:8080/api` | Backend base URL |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | — | Google Maps key |
| `USE_HTTPS` | `false` | Enable HTTPS server mode |

---

## Coding Guidelines

`zebra-ui` follows the same component organisation, responsive breakpoints, Tailwind conventions, Formik + Yup form pattern, and RTK Query data-fetching rules as `hc-frontend`. See the [hc-frontend coding guidelines](../hc-frontend/README.md#coding-guidelines) for the full reference.

Admin-specific additions:

- **Tables**: use `@heroui/table` for all data-heavy admin views. Do not roll custom table markup.
- **Sidebar state**: read and update sidebar open/collapse via `SidebarContext` — do not manage it locally in individual components.
- **Auth guard**: all protected routes are guarded by `middleware.ts`. Do not add manual auth redirects inside page components.
- **Test IDs**: every interactive element in a page must carry a `data-testid` following the `[scope]-[element]-[action]` convention so Playwright tests can target it reliably.

---

## License

© 2024–2026 Houseclay. All Rights Reserved.

This repository is shared publicly for transparency and portfolio purposes. The source code, design, architecture, and all associated assets remain the exclusive intellectual property of their authors. **Copying, reproduction, redistribution, or derivative use — in whole or in part — is strictly prohibited without prior written consent.**
