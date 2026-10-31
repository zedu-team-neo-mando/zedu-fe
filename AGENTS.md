# AGENTS.md

Instructions for AI coding agents working in `zedu-fe` (Next.js 16 App Router, React 19, TypeScript, pnpm).

**Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) first.** It is the source of truth for the workflow: tickets, branches, commits, testing, CI, PRs and secrets. This file adds only what an agent needs on top of it. Where the two disagree, `CONTRIBUTING.md` wins.

## Hard rules

- Work only on a ticket branch in the contributor's fork. Never push to `dev`, `central-staging`, `staging` or `main`, and never target `zeduchat` directly. PRs go into `zedu-hng/zedu-fe:dev`.
- Keep the change to what the ticket asks. No drive-by refactors, renames or dependency bumps.
- One logical change per PR, at most ~400 lines of meaningful code (lockfiles and generated files like `*.tsbuildinfo` don't count). The app must still work after it merges — nothing half-finished visible to users.
- Don't edit protected files (`.github/`, `AGENTS.md`, `CONTRIBUTING.md`, tooling config; full list in `CONTRIBUTING.md`). The **Protected files** check fails the PR unless a reviewer has approved the change and added the `config-change-approved` label.
- One author per PR: commit only as the contributor, never mix in other people's commits.
- Never commit `.env` or any `.env.*` file, `.pem` files, credential or service-account JSON, or files over 1 MB. CI's file policy and secret scan reject them.
- Never hardcode public URLs or client-side identifiers. Read public config from `process.env.NEXT_PUBLIC_*`; keep secrets in server-only environment variables.
- Never create `* copy.*` files. Edit the original.

## Commands

The package manager is **pnpm** (`pnpm install`, `pnpm <script>`). Never use npm or yarn, and don't regenerate `package-lock.json` or `yarn.lock`.

```sh
pnpm install         # also installs husky hooks
pnpm dev             # next dev
pnpm check-format    # Prettier
pnpm check-lint      # ESLint
pnpm check-types     # tsc --noEmit
pnpm build           # next build
pnpm test-all        # format + lint + types + build
pnpm cypress         # Cypress (E2E)
```

Run format, lint, types and build before declaring a change done. `pnpm format` and `pnpm lint:fix` fix most style issues. Husky runs the same gates on commit — fix failures, don't bypass with `--no-verify`.

## Layout

`src/` is the application. Put new code in the matching layer:

| Path                                                       | Holds                                                                                           |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `src/app/`                                                 | Next.js App Router routes (`page.tsx`, `layout.tsx`, `route.ts`) and route-local `_components/` |
| `src/app/api/**/route.ts`                                  | Next.js API routes (only `route.ts` is a handler)                                               |
| `src/components/ui/`                                       | shadcn/ui primitives                                                                            |
| `src/components/layout/`                                   | Sidebar, topbar, centrifugo and onesignal providers                                             |
| `src/components/rbac/`                                     | `PermissionBoundary`, `withAuthGate` HOCs                                                       |
| `src/components/toast/`                                    | Sonner wrappers                                                                                 |
| `src/components/modals/`, `src/components/error-boundary/` | Shared modals and error boundary                                                                |
| `src/hooks/`                                               | Custom hooks (`src/hooks/buzz/` for calls)                                                      |
| `src/lib/`                                                 | Domain logic (`agora/`, `buzz/`, `search/`, `onesignal/`, `utils.ts`)                           |
| `src/store/`                                               | Global state: Context + `useReducer`                                                            |
| `src/utils/`                                               | HTTP clients, auth-session, RBAC helpers                                                        |
| `src/types/`, `src/data/`, `src/svgs/`                     | Shared types, static data, SVGs                                                                 |

The PR review bot only accepts new files under the paths in `.github/pr-review.config.json`. Use `_components/` for route-local components.

## Conventions

- **Reuse shared components** instead of writing new ones. The PR review bot enforces this:
  - `src/components/ui/button.tsx`
  - `src/components/ui/dialog.tsx`
  - `src/components/ui/alert-dialog.tsx`
  - `src/app/(client)/[org]/_components/user-management/invite-modal.tsx`
- **Imports:** use the `~/` alias (maps to `src/`). `@/` is deprecated.
- **State:** global state lives in `src/store` (`DataProvider` / `DataContext`, `Actions`, `Reducers`). New code uses Context + `useReducer`. Don't add Redux or Zustand.
- **Networking:** use the axios helpers in `src/utils/new-request.ts` (`GetRequest`, `PostRequest`, …). They read the token and return a response you check by `status`. `src/utils/request.ts` needs the token passed explicitly; `patchRequestForm.ts` handles multipart. Don't scatter raw axios calls.
- **Toasts:** use the Sonner wrappers in `src/components/toast/sonner.tsx` (`showSuccess`, `showError`), not `react-toastify` or CogoToast.
- **Forms:** React Hook Form + Zod + `@hookform/resolvers`, paired with shadcn form primitives.
- **Styling:** Tailwind, with the `cn()` helper from `src/lib/utils.ts`. Prefer classes over inline `style`.
- **Permissions:** gate UI with `PermissionBoundary` and page-level access with `withAuthGate` / `withAllPermissions` / `withAnyPermission` from `src/components/rbac/`. Use real `PermissionKey` values from `src/types/rbac.ts`.
- **Icons:** prefer `lucide-react`.
- **Naming:** keep kebab-case file names where the folder already does; PascalCase components; `useX` hooks.
- **Lint:** unused imports and variables are errors. Prettier uses double quotes, semicolons and an 80-column width.

## Tests

There is no unit-test runner. The required gates are format, lint, types and a successful production build; Cypress (`cypress/e2e/`) covers critical end-to-end flows. Follow the test-scope rules in `CONTRIBUTING.md`: tests for what the ticket changed, never retroactive coverage of unrelated code.

## Notes

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so the build won't fail on types — still fix type errors in files you touch. Production builds set `assetPrefix: "/mainapp"`.
- Auth is client-side (`localStorage` token, `auth-guard.tsx`); there is no `middleware.ts`.
- Real-time uses Centrifugo components under `src/components/layout/centrifugo/`; calls use Agora under `src/lib/agora/` and `src/hooks/buzz/`.

## Commits and PRs

Conventional Commits, enforced by commitlint on every commit and on the PR title. The PR title becomes the squashed commit on `dev`, so make it describe the change. Fill in every section of the PR template.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
