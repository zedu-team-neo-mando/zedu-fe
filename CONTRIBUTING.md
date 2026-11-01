# Contributing to Zedu

Thank you for your interest in contributing to **Zedu** — a cross-platform collaboration workspace for messaging, channels, voice/video calls (Buzz), file sharing, search, notifications, and AI coworkers.

This guide is written against the **actual files and conventions in this repository**. If something here conflicts with another doc, treat this file and the code as the source of truth.

> **Naming note:** The npm package is named `zedu_fe` (see `package.json`). Infrastructure, Docker images, and some paths still use legacy **zedu** names. The user-facing product brand is **Zedu** (`zedu.chat`).

---

## Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Overview](#project-overview)
- [Repository Structure](#repository-structure)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Development Guidelines](#development-guidelines)
- [Common Development Tasks](#common-development-tasks)
- [Code Style and Quality](#code-style-and-quality)
- [Git Workflow](#git-workflow)
- [Testing](#testing)
- [Build and Deployment](#build-and-deployment)
- [Troubleshooting](#troubleshooting)
- [Additional Resources](#additional-resources)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

---

## Ways to Contribute

| Type              | How                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| **Bug reports**   | Open a GitHub issue with steps to reproduce, expected vs actual behavior, and screenshots or logs |
| **Feature ideas** | Open a GitHub issue describing the problem, proposed solution, and why it helps users             |
| **Documentation** | Improve `README.md`, this file, or `PRD.md`                                                       |
| **Code**          | Fix bugs, add features, improve performance, or refactor — follow the workflow below              |
| **Tests**         | Add or extend Cypress E2E specs under `cypress/e2e/`                                              |

Before starting significant work, check existing issues and coordinate with maintainers so effort is not duplicated.

---

## Prerequisites

| Tool                           | Version                                                    |
| ------------------------------ | ---------------------------------------------------------- |
| [Node.js](https://nodejs.org/) | `>= 20.0.0` (see `README.md`)                              |
| [pnpm](https://pnpm.io/)       | `>= 9.4.0` — project pins `pnpm@10.27.0` in `package.json` |
| [Git](https://git-scm.com/)    | Latest stable                                              |

Cypress is already a dev dependency (`pnpm cypress`). An editor with ESLint and Prettier support is recommended.

---

## Getting Started

### 1. Fork and clone

Fork [https://github.com/zeduapp/zedu_fe](https://github.com/zeduapp/zedu_fe), then clone **your fork**:

```sh
git clone git@github.com:<your-username>/zedu_fe.git
cd zedu_fe
```

Add upstream:

```sh
git remote add upstream git@github.com:zeduapp/zedu_fe.git
```

HTTPS clone:

```sh
git clone https://github.com/zeduapp/zedu_fe.git
```

### 2. Install dependencies

Use **pnpm** only:

```sh
pnpm install
```

### 3. Configure environment variables

There is **no committed `.env` or `.env.example`** in this repo. Request values from a team member.

Create `.env` in the project root. These variables are **referenced in the codebase today**:

**Required for most local development**

```env
# REST API (used by src/utils/new-request.ts and src/utils/request.ts)
NEXT_PUBLIC_BASE_URL=https://api.staging.zedu.chat/api/v1

# Public frontend URL (links, redirects, Centrifugo-related layout code)
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000

# Centrifugo WebSocket (src/components/layout/centrifugo/*.tsx)
NEXT_PUBLIC_CONNECT_URL=wss://<host>/connection/websocket

# OAuth (src/app/(auth)/layout.tsx, sign-up page, invitation layouts)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google-client-id>
NEXT_PUBLIC_APPLE_CLIENT_ID=<apple-client-id>

# Buzz / Agora client (src/lib/agora/config.ts)
NEXT_PUBLIC_AGORA_APP_ID=<agora-app-id>
```

**Optional / feature-specific**

```env
# Google Analytics (src/app/layout.tsx)
NEXT_PUBLIC_GA_ID=<google-analytics-id>

# OneSignal push (src/lib/onesignal/init.ts)
NEXT_PUBLIC_ONESIGNAL_APP_ID=<onesignal-app-id>

# Integration API — used by src/utils/request.ts Integration* helpers
NEXT_PUBLIC_INTEGRATION_URL=<integration-api-url>

# Analytics webhooks — src/utils/webhook-request.ts
NEXT_PUBLIC_REGISTER_WEBHOOK_URL=<url>
NEXT_PUBLIC_LOGIN_WEBHOOK_URL=<url>
NEXT_PUBLIC_PAGE_VISIT_WEBHOOK_URL=<url>
NEXT_PUBLIC_SUCCESS_WEBHOOK_URL=<url>
NEXT_PUBLIC_ERROR_WEBHOOK_URL=<url>
```

**Server-only (Next.js API route `src/app/api/agora/token/route.ts`)**

```env
AGORA_APP_ID=<agora-app-id>
AGORA_APP_CERTIFICATE=<agora-certificate>
```

Without `NEXT_PUBLIC_BASE_URL` and a valid auth token flow, login and org-scoped routes will not work.

### 4. Run the development server

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Verify your setup

Before opening a PR:

```sh
pnpm lint        # ESLint (package.json script)
pnpm format      # Prettier on src/**/*.{ts,tsx,scss,html}
pnpm build       # next build
```

---

## Project Overview

Zedu consolidates team and learning-community collaboration into one workspace:

- **Messaging** — channels, direct messages, threads
- **Buzz** — real-time voice and video calls
- **Files** — upload, preview, share, and organize documents
- **Colleagues / AI coworkers** — browse and interact with AI agents
- **Search and notifications**
- **Organization settings** — users, roles, billing, permissions

This repository is the **web frontend**: **Next.js 16** (App Router), **React 19**, **TypeScript 5** (see `package.json`).

For product context and architecture, see [`PRD.md`](./PRD.md).

---

## Repository Structure

Verified top-level layout:

```
frontend/
├── .github/
│   ├── pull_request_template.md
│   ├── release.yaml
│   └── workflows/              # CI/CD (see Build and Deployment)
├── cypress/
│   ├── e2e/                    # E2E specs
│   ├── fixtures/
│   └── support/
├── docker/development/         # Dockerfile + docker-compose.yml
├── public/                     # Static assets
├── scripts/dev_deploy.sh       # Docker-based dev deploy script
├── src/
│   ├── app/                    # Next.js App Router routes + API routes
│   ├── assets/images/          # Image assets
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives
│   │   ├── layout/             # sidebar, topbar, centrifugo, onesignal
│   │   ├── rbac/               # PermissionBoundary, withAuthGate HOCs
│   │   ├── auth/               # auth-session-setup.tsx
│   │   ├── modals/
│   │   ├── toast/              # Sonner helpers (sonner.tsx)
│   │   └── error-boundary/
│   ├── data/                   # Static/mock data
│   ├── hooks/                  # Custom hooks (incl. hooks/buzz/)
│   ├── lib/                    # agora/, buzz/, search/, onesignal/, utils.ts
│   ├── store/                  # GlobalState, Actions, Reducers, UploadContext
│   ├── types/                  # Shared TS types (incl. rbac.ts)
│   ├── utils/                  # HTTP clients, auth-session, rbac helpers
│   └── svgs/
├── components.json             # shadcn/ui config
├── commitlint.config.cjs       # Commit message rules
├── cypress.config.ts
├── next.config.mjs
├── package.json
├── PRD.md
├── README.md
├── sample.cypress.env.json     # Cypress env sample (repo root)
├── tailwind.config.ts
└── tsconfig.json               # path alias ~/ → src/*
```

---

## Architecture at a Glance

### Routing (Next.js App Router)

Routes live in `src/app/`. Parentheses are **route groups** — they do not appear in URLs.

| Route group                   | URL examples                                                              | Purpose               |
| ----------------------------- | ------------------------------------------------------------------------- | --------------------- |
| `(homepage)`                  | `/`, `/about`, `/pricing`, `/resources`, `/contact-sales`                 | Public marketing site |
| `(auth)`                      | `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`                   | Authentication        |
| `(client)/[org]`              | `/{orgSlug}/home/channels/[id]`, `/{orgSlug}/buzz`, `/{orgSlug}/settings` | Authenticated app     |
| `(accept_org_invitation)`     | `/accept_org_invitation`                                                  | Accept org invite     |
| `(accept_general_invitation)` | `/accept_general_invitation`                                              | Accept general invite |
| `(client)/billing`            | `/billing/invoice/[id]`                                                   | Invoice view          |

**Layouts (verified paths):**

| File                                | Role                                                    |
| ----------------------------------- | ------------------------------------------------------- |
| `src/app/layout.tsx`                | Root: `DataProvider`, analytics scripts, `ClientLayout` |
| `src/app/(homepage)/layout.tsx`     | Marketing header/footer                                 |
| `src/app/(client)/layout.tsx`       | Nested `DataProvider`, `ErrorBoundary`                  |
| `src/app/(client)/[org]/layout.tsx` | Wraps children in `AuthGuard` + `ClientLayout`          |

**Next.js API routes** (`src/app/api/**/route.ts` only):

| Route                     | File                                      |
| ------------------------- | ----------------------------------------- |
| `/api/agora/token`        | `src/app/api/agora/token/route.ts`        |
| `/api/link-preview`       | `src/app/api/link-preview/route.ts`       |
| `/api/save-subscription`  | `src/app/api/save-subscription/route.ts`  |
| `/api/search`             | `src/app/api/search/route.ts`             |
| `/api/search/user-search` | `src/app/api/search/user-search/route.ts` |

> `src/app/api/files/file/getFileDetails.ts` is a helper module, **not** a Next.js route handler.

There is **no `middleware.ts`** in this repo. Auth is client-side.

### Authentication

| Concern        | Location / behavior                                                                   |
| -------------- | ------------------------------------------------------------------------------------- |
| Token storage  | `localStorage` keys include `token`, `orgId`, `orgSlug`, `user`                       |
| Route guard    | `src/app/(client)/[org]/_components/auth/auth-guard.tsx`                              |
| Guard usage    | Imported in `src/app/(client)/[org]/layout.tsx`                                       |
| Session setup  | `src/components/auth/auth-session-setup.tsx` (Axios interceptor)                      |
| Session expiry | `src/utils/auth-session.ts` — clears storage, redirects to `/auth/login?redirect=...` |
| Guard boot     | Parallel `GetRequest('/profile')` and `GetRequest('/organisations/${orgId}')`         |
| OAuth env      | `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_APPLE_CLIENT_ID`                         |

### Authorization (RBAC)

| Resource      | Path                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| Types         | `src/types/rbac.ts`                                                                                        |
| Utilities     | `src/utils/rbac.ts`                                                                                        |
| Hook          | `src/hooks/useRBAC.ts`                                                                                     |
| Components    | `src/components/rbac/PermissionBoundary.tsx`                                                               |
| HOCs          | `src/components/rbac/withAuthGate.tsx` — exports `withAuthGate`, `withAllPermissions`, `withAnyPermission` |
| Barrel export | `src/components/rbac/index.ts`                                                                             |

Permissions are string keys such as `invite:members`, `manage:channels`, `manage:roles`. See the full list in `src/types/rbac.ts` (`PermissionKey`).

Org role/permissions come from `orgData` in global state after `AuthGuard` loads the organisation.

### State management

| File                          | Role                                  |
| ----------------------------- | ------------------------------------- |
| `src/store/GlobalState.tsx`   | Exports `DataProvider`, `DataContext` |
| `src/store/Actions.ts`        | Action type constants                 |
| `src/store/Reducers.ts`       | Reducer                               |
| `src/store/UploadContext.tsx` | Upload state                          |

Pattern: React Context + `useReducer`. No Redux or Zustand. The `use-context-selector` package is available but not required for new code.

### API requests

Central Axios helpers (both files warn **DO NOT TOUCH** at the top):

| Module                          | Use when                                                          |
| ------------------------------- | ----------------------------------------------------------------- |
| `src/utils/new-request.ts`      | **Preferred** — reads `token` from `localStorage`                 |
| `src/utils/request.ts`          | Legacy — pass `token` explicitly; includes `Integration*` helpers |
| `src/utils/patchRequestForm.ts` | Multipart uploads                                                 |
| `src/utils/webhook-request.ts`  | Analytics webhook GET requests                                    |

**Pattern used across the app:**

```typescript
import { GetRequest, PostRequest } from "~/utils/new-request";
import { showSuccess, showError } from "~/components/toast/sonner";

const res = await GetRequest("/your-endpoint");

if (res?.status === 200 || res?.status === 201) {
  // use res.data
}
```

- Base URL: `process.env.NEXT_PUBLIC_BASE_URL`
- Toasts: `~/components/toast/sonner.tsx`
- `401` handling: `handleUnauthorizedIfNeeded` in `src/utils/auth-session.ts`

There is no React Query or SWR.

### Real-time (Centrifugo)

Connection components in `src/components/layout/centrifugo/`:

- `channel-connection.tsx`
- `chat-connection.tsx`
- `reply-connection.tsx`
- `general-notification-connection.tsx`
- `status-connection.tsx`
- `agora-connection.tsx`
- `chat-agora-connection.tsx`
- `channel-agora-connection.tsx`

They use `NEXT_PUBLIC_CONNECT_URL` and token endpoints on `NEXT_PUBLIC_BASE_URL`:

- `/token/connection`
- `/token/subscription`

### Voice and video (Agora / Buzz)

| Area                 | Path                                                              |
| -------------------- | ----------------------------------------------------------------- |
| Agora config/types   | `src/lib/agora/`                                                  |
| Buzz session helpers | `src/lib/buzz/`                                                   |
| Buzz hooks           | `src/hooks/buzz/`                                                 |
| Server token route   | `src/app/api/agora/token/route.ts`                                |
| Buzz UI              | `src/app/(client)/[org]/_components/buzz-management/`             |
| Buzz routes          | `src/app/(client)/[org]/buzz/`, `buzz/[id]/`, `buzz-record/[id]/` |

Dependencies: `agora-rtc-sdk-ng`, `agora-rtm-sdk`, `agora-token` (see `package.json`).

---

## Development Guidelines

### Where to put new code

| What you're building           | Where it goes                                |
| ------------------------------ | -------------------------------------------- |
| shadcn/ui primitive            | `src/components/ui/`                         |
| Shared cross-feature component | `src/components/<name>/`                     |
| Feature-local component        | `src/app/.../_components/`                   |
| Custom hook                    | `src/hooks/` (or `src/hooks/buzz/` for Buzz) |
| Shared types                   | `src/types/`                                 |
| HTTP/formatting/RBAC helpers   | `src/utils/`                                 |
| Domain logic                   | `src/lib/`                                   |
| Static mock data               | `src/data/`                                  |
| New page                       | `src/app/<route-group>/.../page.tsx`         |
| New API route                  | `src/app/api/<name>/route.ts`                |

Use `_components/` for route-local components (Next.js private folder convention).

### UI components (shadcn/ui)

Configured in `components.json`. Primitives live in `src/components/ui/`.

Add a component:

```sh
pnpm dlx shadcn@latest add <component-name>
```

Prefer existing shadcn primitives (`button`, `dialog`, `form`, `input`, etc.) before custom UI.

Icons: prefer **Lucide React** (`lucide-react`). Some legacy code uses Font Awesome.

### Forms and validation

The codebase uses **React Hook Form**, **Zod**, and `@hookform/resolvers`:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
```

Pair with shadcn form primitives from `src/components/ui/form.tsx`, `input.tsx`, `label.tsx`, etc.

### Styling

- **Tailwind CSS** — primary approach
- `cn()` helper — `src/lib/utils.ts`
- Theme — `tailwind.config.ts`, CSS variables in `src/app/globals.css` (also `src/app/responsive.css`)
- Dark mode — `darkMode: ["class"]` in `tailwind.config.ts`

Production builds set `assetPrefix: "/mainapp"` in `next.config.mjs` (not in dev).

### Notifications and toasts

Use Sonner wrappers from `src/components/toast/sonner.tsx`:

```typescript
import { showSuccess, showError } from "~/components/toast/sonner";
```

Do not introduce CogoToast. `react-toastify` is a dependency but Sonner is the project standard for new code.

### Path aliases

`tsconfig.json` maps `~/` → `src/`:

```typescript
import { Button } from "~/components/ui/button";
import { GetRequest } from "~/utils/new-request";
import { useRBAC } from "~/hooks/useRBAC";
```

---

## Common Development Tasks

### Add a page in the authenticated app

1. Create `src/app/(client)/[org]/<feature>/page.tsx`
2. Add `"use client"` if the page uses hooks or browser APIs
3. Read org context from the URL (`[org]` param) or `DataContext`
4. Wire navigation in `src/components/layout/sidebar/` if needed

Example:

```
src/app/(client)/[org]/your-feature/
├── page.tsx
└── _components/
    └── feature-card.tsx
```

### Add a shared component

1. Create `src/components/<component-name>/`
2. Compose shadcn/ui + Tailwind
3. Add `"use client"` when using hooks or events

### Fetch data from the backend

```typescript
"use client";

import { useEffect, useState } from "react";
import { GetRequest } from "~/utils/new-request";

export function MyList() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await GetRequest("/items");
      if (res?.status === 200 || res?.status === 201) {
        setItems(res.data?.data ?? []);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return null;
  return null; // render items
}
```

### Gate UI behind permissions

Use a real `PermissionKey` from `src/types/rbac.ts`:

```typescript
import { PermissionBoundary } from "~/components/rbac";

<PermissionBoundary permission="invite:members">
  <InviteUserButton />
</PermissionBoundary>
```

For page-level gating, use HOCs from `src/components/rbac/withAuthGate.tsx`:

```typescript
import { withAuthGate } from "~/components/rbac";

export default withAuthGate(MyPage, {
  requiredPermission: "manage:roles",
});
```

---

## Code Style and Quality

### TypeScript and React

- Functional components and hooks
- `"use client"` on interactive components
- Strict TypeScript is enabled in `tsconfig.json`
- Note: `next.config.mjs` sets `typescript.ignoreBuildErrors: true` — still fix errors in files you touch

### Prettier (`.prettierrc`)

| Setting        | Value    |
| -------------- | -------- |
| Semicolons     | yes      |
| Quotes         | double   |
| Print width    | 80       |
| Tab width      | 2 spaces |
| Trailing comma | es5      |

```sh
pnpm format
```

### ESLint (`.eslintrc.json`)

Extends `eslint:recommended`, `next`, `next/core-web-vitals`, and `prettier`.

```sh
pnpm lint
pnpm lint:fix
```

### lint-staged

`package.json` runs lint + format on staged `src/**/*.{ts,tsx}` via `lint-staged`. Husky is listed in devDependencies but **there is no `.husky/` directory in this repo**, so hooks may not run automatically — run `pnpm lint` and `pnpm format` manually before pushing.

### Commit messages

Conventional Commits are defined in `commitlint.config.cjs` (and a minimal `commitlint.config.js`):

```
<type>(<optional-scope>): <subject>
```

**Allowed types:** `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`

**Rules:** lowercase type; subject lowercase; no trailing period; max 100 characters.

Examples:

```
feat(channels): add archive button to channel header
fix(buzz): resolve mute state after reconnect
docs: expand contributing guide
```

Commitlint is configured but not wired to git hooks in this repo unless you set that up locally.

---

## Git Workflow

### Branches in this repository

Verified remote branches include **`staging`** (default — `origin/HEAD` points here) and **`main`**. There is **no `dev` branch** on the remote at the time of this writing.

> `.github/pull_request_template.md` still says to open PRs against **`dev`**. Until that template is updated, **confirm the target branch with maintainers**. In practice, feature work is typically merged into **`staging`**.

### Branch naming

Create branches from the integration branch your team uses (usually `staging`):

| Prefix      | Use for                             |
| ----------- | ----------------------------------- |
| `feat/`     | New features                        |
| `fix/`      | Bug fixes                           |
| `refactor/` | Restructure without behavior change |
| `chore/`    | Tooling, deps, config               |
| `docs/`     | Documentation                       |
| `test/`     | Tests                               |
| `ci/`       | CI/CD                               |

```sh
git fetch upstream
git checkout staging
git pull upstream staging
git checkout -b feat/your-feature-name
```

### Submitting a pull request

1. Push to your fork:

   ```sh
   git push origin feat/your-feature-name
   ```

2. Open a PR using [`.github/pull_request_template.md`](.github/pull_request_template.md).

3. **Confirm base branch** with maintainers (`staging` vs `main` vs template’s `dev`).

4. Ensure `pnpm lint` and `pnpm build` pass locally.

5. Add screenshots or recordings for UI changes.

**Checklist:**

- [ ] Follows conventions in this guide
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes locally
- [ ] UI changes include screenshots/video
- [ ] Commit messages follow Conventional Commits
- [ ] Changes are scoped to the task

---

## Testing

### Cypress (E2E only)

No Jest/Vitest/React Testing Library setup exists.

**Run:**

```sh
pnpm cypress
```

**Spec layout** (actual paths under `cypress/e2e/`):

```
cypress/e2e/
├── auth/
│   ├── login.cy.js
│   ├── logout.cy.js
│   ├── forgot_password.cy.js
│   └── test_signup_dashboard.cy.js
├── profile/
│   ├── test_e2e_profile_update.cy.js
│   ├── test_e2e_change_password.cy.ts
│   └── ...
├── settings/
│   └── test_e2e_create_role.cy.js
├── faq/
│   └── test_zedu_faqpage.cy.js
├── blogs/
│   └── test_talex_blogpage.cy.js
├── test_zedu_homepage.cy.js
└── example.cy.ts
```

Configure base URL in `cypress.config.ts` or `cypress.env.json`. See `sample.cypress.env.json` at the repo root.

---

## Build and Deployment

### Local production build

```sh
pnpm build   # next build — standalone output
pnpm start   # next start
```

`next.config.mjs`: `output: "standalone"`, `reactStrictMode: false`, `typescript.ignoreBuildErrors: true`.

### GitHub Actions (`.github/workflows/`)

| Workflow                         | Trigger                     | Purpose                       |
| -------------------------------- | --------------------------- | ----------------------------- |
| `check-for-npm-build-errors.yml` | PR → `main`                 | `pnpm install` + `pnpm build` |
| `deploy-staging.yml`             | Push / dispatch → `staging` | Deploy staging                |
| `deploy-main.yml`                | Push / dispatch → `main`    | Deploy production             |
| `pr_preview.yaml`                | PR opened/sync/closed       | PR preview environments       |
| `create-release.yaml`            | Release published           | Upload release JSON to MinIO  |
| `test_deployment.yaml`           | Manual dispatch             | Test PR preview port logic    |

### Docker

- `docker/development/Dockerfile`
- `docker/development/docker-compose.yml`
- `scripts/dev_deploy.sh` — pulls `hngtechie/zedu:dev` and runs compose

> `scripts/dev_deploy.sh` runs `git pull origin dev`, but no `dev` branch exists on the current remote. Treat that script as legacy or confirm branch names with the team before using it.

---

## Troubleshooting

| Problem                           | What to check                                                               |
| --------------------------------- | --------------------------------------------------------------------------- |
| Login loops or immediate redirect | `NEXT_PUBLIC_BASE_URL`, OAuth client IDs, network tab on `/profile`         |
| Real-time not working             | `NEXT_PUBLIC_CONNECT_URL`, WebSocket in network tab                         |
| Buzz/calls fail                   | `NEXT_PUBLIC_AGORA_APP_ID`, server `AGORA_APP_ID` / `AGORA_APP_CERTIFICATE` |
| `pnpm install` fails              | Node 20+, pnpm 9.4+                                                         |
| `~/` imports fail in editor       | Restart TS server; file must be under `src/`                                |
| Build succeeds with TS errors     | `ignoreBuildErrors: true` — fix types in your changes anyway                |
| Lint fails                        | `pnpm lint:fix && pnpm format`                                              |

---

## Additional Resources

| Resource                                                     | Description                                    |
| ------------------------------------------------------------ | ---------------------------------------------- |
| [`README.md`](./README.md)                                   | Quick start                                    |
| [`PRD.md`](./PRD.md)                                         | Product requirements and frontend architecture |
| [`components.json`](./components.json)                       | shadcn/ui configuration                        |
| [shadcn/ui docs](https://ui.shadcn.com/docs/components)      | UI components                                  |
| [Next.js App Router](https://nextjs.org/docs/app)            | Routing and layouts                            |
| [Conventional Commits](https://www.conventionalcommits.org/) | Commit format                                  |

---

## Code of Conduct

By participating, you agree to uphold the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). Report unacceptable behavior to the project maintainers.

---

## License

There is **no `LICENSE` file** in this repository at present. Ask maintainers about licensing terms before contributing if that matters for your contribution.

---

Thank you for helping improve Zedu.
