# AI Work Log

This log records AI-assisted repository work. It complements `CHANGELOG.md`:
the changelog summarizes what changed, while this file preserves the request,
technical decisions, checks performed, and unresolved risks. Secrets and raw
environment values must never be recorded here.

## 2026-08-20 — Repository baseline and logging setup

### Request

- Analyze the existing codebase before continuing feature changes.
- Maintain a changelog and an AI work log from this point forward.

### Repository baseline

- Branch: `main`, tracking `origin/main`.
- Working tree before this task: clean.
- Stack: Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, Drizzle ORM,
  PostgreSQL via the `postgres` client, plus Vinext/Cloudflare deployment tooling.
- Product surfaces: public marketing pages, shop and courses, bookings, client and
  consultant portals, admin modules, API routes, notifications, reports, and file
  delivery.
- Data path: application routes use a D1-like prepared-statement adapter backed by
  a Supabase PostgreSQL transaction-pooler connection.

### Changes made

- Created `CHANGELOG.md` using an Unreleased-first structure.
- Created this AI work log and established the logging rules above.
- No application behavior, database schema, dependencies, or environment values
  were changed.

### Verification

- `node .\\node_modules\\typescript\\bin\\tsc --noEmit --pretty false`: passed.
- `node .\\node_modules\\next\\dist\\bin\\next build`: passed; 35 static/dynamic
  application routes were generated successfully.
- ESLint baseline: failed with 94 findings (83 errors and 11 warnings). The largest
  groups are internal navigation using `<a>` instead of Next.js `Link`, synchronous
  state updates initiated from effects, and unoptimized `<img>` elements.
- The normal `npx` launcher is unreliable in the current Windows workspace path
  because the path contains `&`; direct local package executables work correctly.

### Findings to guide future changes

- High priority: production admin authentication has built-in email, password-hash,
  and session-secret fallbacks. Production should fail closed when explicit secrets
  are absent, and the stored password scheme should be upgraded from unsalted
  SHA-256 to a password hashing function.
- High priority: many API routes create or alter tables at request time. Consolidate
  schema ownership into reviewed migrations to reduce race conditions, drift, and
  deployment surprises.
- High priority: confirm the Supabase `public` schema is not exposed through the Data
  API without appropriate grants and row-level security. The app currently accesses
  PostgreSQL server-side, so public Data API exposure may be unnecessary.
- Medium priority: `db/index.ts` translates SQLite/D1-flavored SQL to PostgreSQL with
  regular expressions. This compatibility layer is fragile for complex SQL and
  should be reduced in favor of native PostgreSQL queries or a consistent ORM path.
- Medium priority: numerous source files are compressed into very long lines, which
  makes review, lint output, testing, and safe modification harder.
- Medium priority: the README still describes the original Vinext starter rather
  than the current Attri Associates application, architecture, setup, and operating
  requirements.
- Medium priority: automated coverage is minimal; the existing test checks rendered
  HTML metadata but does not cover authentication, authorization, API validation,
  database migrations, or core commerce workflows.

### Logging convention for subsequent work

- Add every notable user-visible or technical change under `Unreleased` in
  `CHANGELOG.md`.
- Append a dated entry here for each AI-assisted work session, including the request,
  files or behavior changed, material decisions, verification performed, and any
  known follow-up work.
- Never copy credentials, tokens, private customer data, or `.env.local` values into
  either log.

## 2026-08-20 — Full stabilization and UI/UX quality pass

### Request

- Correct all identified issues to a professional development and UI/UX standard.

### Changes made

- Converted internal navigation across the application to Next.js `Link`.
- Converted content imagery to `next/image` with explicit dimensions and retained
  unoptimized delivery for administrator-configured external sources.
- Removed cascading render patterns from initial data loads and added request
  cancellation to consultant workspaces.
- Added explicit models for database JSON results, reports, findings, remedies,
  subscriptions, notifications, and local cart values.
- Hardened production admin configuration, shortened sessions to eight hours, and
  corrected sign-in security messaging.
- Limited notification actions to same-site paths to prevent unsafe stored links.
- Added keyboard focus visibility, reduced-motion support, touch interaction
  defaults, and consistent selection styling.
- Removed temporary starter metadata, added complete Open Graph and X metadata,
  and added the project social card at `public/og.png`.
- Rewrote the README for the real product and replaced the starter metadata test
  with production brand assertions.

### Decisions

- Preserved the existing Next.js/Vinext/Supabase architecture and package lock.
- Kept administrator-supplied image URLs unoptimized so arbitrary approved image
  hosts continue to work without maintaining a permissive remote-host allowlist.
- Preserved local development fallbacks for admin access, but production now fails
  closed when required values are missing.
- Left schema definitions and the committed Supabase migration unchanged because
  this pass introduced no schema changes. Request-time compatibility initializers
  remain for the current D1-style adapter and should be removed only in a dedicated,
  tested database migration rollout.

### Verification

- ESLint with zero warnings: passed.
- TypeScript strict no-emit check: passed.
- Next.js production build: passed; 35 routes generated.
- Vinext/Sites deployment build: passed.
- Rendered production metadata test: passed.
- `git diff --check`: passed.

### Generated asset

- `public/og.png` was generated with the built-in image generation tool as a
  landscape brand card using the existing aubergine, saffron, ivory, architecture,
  and compass visual language. Required text was verified in the result.
