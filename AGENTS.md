# AGENTS.md

Guidance for AI coding agents working on Uocial Web, the frontend of a social
media platform for University of Crete students (anonymous posts, comments,
polls, hashtags, moderation).

## Stack

- React 19 + TypeScript (strict), built with Vite
- UI: Mantine v9 (`@mantine/*`) and `@tabler/icons-react`
- Routing: `react-router` v7 (declarative `<Routes>`, not data routers)
- Server state: TanStack Query v5; HTTP: `axios`
- Backend: Laravel (Sanctum cookie auth, API under `/api`). Vite proxies
  `/api` and `/sanctum/csrf-cookie` to `http://127.0.0.1:8000`.

## Commands

Run via `just <task>` or the npm script behind it.

| Task             | Command                               |
| ---------------- | ------------------------------------- |
| Dev server       | `just dev` (`npm run dev`)            |
| Lint             | `just lint` (`npm run lint`)          |
| Format           | `just format` (prettier --write)      |
| Type-check+build | `just build` (`tsc -b && vite build`) |

There is no test suite. Before finishing a change, run `npm run lint` and
`npm run build`, and format the files you touched with Prettier (default
config, `.prettierrc` is `{}`).

## Project layout (`src/`)

Layers mirror each other by path, e.g. `app/post/poll` exists in `api/`,
`queries/`, `models/`:

- `api/` – plain async functions wrapping `axios` calls. No React here.
- `queries/` – TanStack Query hooks (`useXxx`) that call `api/` functions;
  handle cache updates in `onSuccess`.
- `models/` – TypeScript `interface`s for server payloads (snake_case fields
  as returned by the API; `readonly id`).
- `components/` – reusable UI, grouped by feature (`app/posts`, `auth`,
  `notifications`, ...).
- `pages/` – route components, one `page.tsx` (default export `Page`) per
  route folder, plus `layout.tsx`. Folder path mirrors the URL.
- `guards/` – route guards rendering `<Outlet />` or `<Locked reason=... />`.
- `providers/` – React context providers, one folder each with `Context.ts`,
  `hook.ts` (`useXxx` using `use(Context)`), and `Provider.tsx`.
- `utils/` – pure helpers (`error.ts`, `response.ts`, `cache.ts`, ...).

Routes are declared in `src/App.tsx`, grouped by access level
(`getOpenRoutes`, `getLoggedInRoutes`, `getVerifiedRoutes`,
`getModeratorRoutes`) and nested in the matching guards. Add new routes to the
right group.

## Conventions

- **Imports**: use the `@/` alias for anything under `src/`. Use
  `import type` for type-only imports (`verbatimModuleSyntax` is on).
- **TypeScript**: strict plus `typescript-eslint` `strictTypeChecked` and
  `stylisticTypeChecked`. Notably: wrap non-string values in `String(...)` in
  template literals (e.g. `` `/api/app/posts/${String(id)}` ``), avoid
  non-null assertions, no `enum`s (`erasableSyntaxOnly`). Fix lint errors
  rather than disabling rules; a targeted `eslint-disable-next-line` is only
  acceptable with good reason.
- **Naming**: component files are PascalCase (`PostPoll.tsx`); non-component
  modules are lowercase / kebab-case (`post-report.ts`, `cache-utils.ts`).
  Component props are typed with an `interface` (or inline type), often
  exported as `XxxPropsType`.
- **Components**: function components with named exports (default exports only
  for `App` and route `Page`s). Small helper/sub-components live in the same
  file above the main one.
- **Data lists**: use `InfiniteScrolling` with a `useQuery` hook, and always
  provide a `Fallback` (empty state) and `loader` (skeleton).
- **Mutations**: put them in `queries/` and update affected caches through
  helpers in `queries/app/post/cache-utils.ts` (e.g.
  `updatePostInAllCachesWith`) rather than refetching everything.
- **Errors**: surface errors with `getErrorMessage` from `@/utils/error`
  (handles axios, `Retry-After`, plain errors). Laravel validation errors have
  the shape `LaravelValidationResponse`. Forms use `@mantine/form`;
  notifications use `@mantine/notifications`.
- **Styling**: use Mantine components and style props (`w`, `px`, `pos`, ...)
  and theme CSS variables (`var(--mantine-color-...)`). Support light and dark
  schemes (`defaultColorScheme="auto"`). Plain CSS only when necessary
  (per-page `style.css`).
- **Auth/axios setup** lives in `src/main.tsx` (credentials + XSRF); don't
  re-configure axios elsewhere.
- Keep the UI usable on mobile; the app is used heavily on phones.

## Git & commits

- Conventional Commits, lower-case, short imperative subject:
  `feat: ...`, `fix: ...`, `refactor: ...`, `chore(npm): update depedencies`,
  `chore(eslint): ...`, `style: ...`, `docs(readme): ...`, `build(deps): ...`.
- One logical change per commit.
- Do not commit, stage, stash, rebase or otherwise change git state unless the
  user explicitly asks; read-only commands (`git diff`, `git log`) are fine.

## Other notes

- Don't install packages globally; ask before adding new dependencies.
- Don't edit `dist/` (build output) or `package-lock.json` by hand.
- Don't use real user data in fixtures; `@faker-js/faker` is available.
