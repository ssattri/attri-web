# AI Work Log

# 2026-09-25 - Consultation date validation
- Added server-side validation that rejects malformed or past consultation dates, complementing the frontend date picker and availability checks.

# 2026-09-25 - Consultation service structured data
- Added Service JSON-LD to the consultation booking page for Vastu, architecture, structural, and interior consultation offerings.

# 2026-09-25 - Public catalogue search
- Added `/shop/search` using the shop search API with responsive results and direct links to product and course detail pages.

# 2026-09-25 - CMS admin authorization alignment
- Replaced the hard-coded CMS owner email check with the signed admin session, allowing the configured admin account to manage pages securely.

# 2026-09-25 - CMS page creation workflow
- Added `/ss_attri/admin/pages/new` for creating draft pages with content and complete SEO metadata from the initial form.

# 2026-09-25 - Organization structured data
- Added site-wide Organization JSON-LD structured data with the configured public URL and logo for richer search understanding.

# 2026-09-25 - CMS page editor and SEO fields
- Added a dedicated admin page editor with content, publishing, slug, meta title, keywords, and description controls.
- Extended the CMS PATCH API to persist page content and SEO metadata.

# 2026-09-25 - Dynamic sitemap and robots
- Added database-backed sitemap generation for products, courses, and published CMS pages.
- Added robots rules that keep admin, API, client, consultant, and sign-out routes out of search indexing.

# 2026-09-25 - SEO audit editor links
- Added direct editor links to SEO audit issues for products, courses, and CMS-managed pages.

# 2026-09-25 - SEO audit workspace
- Added an authenticated SEO audit endpoint and admin panel that scans published products, courses, and CMS pages for missing or weak title, keyword, and description metadata.

# 2026-09-25 - CMS page SEO and public rendering
- Added CMS SEO keyword storage and public published-page API access.
- Added `/pages/[slug]` rendering with server-side metadata, canonical URLs, Open Graph data, and styled content presentation.

# 2026-09-25 - Academy course detail SEO
- Added slug-aware public course API queries and server-rendered course detail pages with metadata, canonical URLs, Open Graph data, and SEO keywords.

# 2026-09-25 - Per-product server SEO metadata
- Split product detail rendering into a server route and client view so product pages emit server-side title, description, keywords, canonical, and Open Graph metadata.

# 2026-09-25 - Dynamic global SEO metadata
- Wired admin SEO defaults into the public root metadata with dynamic title, description, keywords, Open Graph, and Twitter card values.

# 2026-09-25 - SEO metadata provisions
- Added global default SEO keyword storage to the admin growth settings API.
- Exposed product meta title, keywords, and description through the public shop API alongside existing product/course SEO editor fields.

# 2026-09-25 - Public product detail pages
- Added slug-aware shop API queries and responsive product detail pages with pricing, availability, GST, HSN, delivery, and specification details.

# 2026-09-25 - Client order history workspace
- Added an ownership-checked orders API with parsed line items and fulfillment events.
- Added a responsive client order-history page showing payment, GST, shipping, tracking, totals, and timeline updates.

# 2026-09-25 - Client profile and billing details
- Added protected profile GET/PATCH APIs and a responsive client profile page for contact, company, address, PIN, and GSTIN details.

# 2026-09-25 - Client booking route alias
- Added `/client/bookings` as a stable alias to the consultation management workspace for simpler navigation and future booking-related expansion.

# 2026-09-25 - Sliding admin session renewal
- Added a protected session refresh endpoint and a dashboard keep-alive that renews the HTTP-only admin cookie every 15 minutes while the panel is open.

# 2026-09-25 - Admin login cookie delivery hardening
- Replaced native redirect-only admin sign-in with a same-origin client submission that receives a JSON response carrying the HTTP-only session cookie before navigating to the dashboard.

# 2026-09-25 - Admin session host persistence fix
- Updated admin login redirects to stay on the exact host that issued the session cookie, avoiding apex/www or proxy-origin changes that caused refreshes to lose authentication.

# 2026-09-25 - Inventory alert UI
- Added low-stock warning, filter controls, and highlighted stock values to the admin product catalogue.

# 2026-09-25 - Inventory safety signal
- Added a low-stock count to the admin commerce payload so catalog and dashboard surfaces can highlight active products at five units or fewer.

# 2026-09-25 - Commerce catalogue query support
- Added server-side shop filtering by search text and product category, preserving published course visibility and active product rules.

# 2026-09-25 - Client consultation cancellation workflow
- Added an authenticated client endpoint to cancel owned pending or confirmed consultation bookings.
- Cancellation updates the shared appointment record and creates a client portal notification without initiating refunds.

# 2026-09-25 - Academy enrollment progress management
- Added an admin enrollment workspace for updating learner status and 0-100% progress.
- Persisted progress in the enrollment API so client learning records can reflect operational updates.

# 2026-09-13 — Frontend email/password account authentication
- Replaced the public client login’s ChatGPT sign-in dependency with Supabase email/password sign-in and account creation.
- Added a secure HTTP-only session cookie, server-side Supabase user lookup, sign-out handling, and preserved user/consultant registration gates.
- Replaced the public header “Client login” text with an accessible person/account icon and documented required public Supabase Auth environment variables.

# 2026-09-13 — Store & Academy navigation modules
- Added dedicated backend navigation for Shipping Rules, GST & Tax, and Course Categories under Store & Academy.
- Added authenticated CRUD storage for these configuration records with matching admin forms, list views, validation, delete actions, and responsive styling.

# 2026-09-13 — Admin URL namespace
- Added `/ss_attri/admin` as the canonical admin entry path with rewrites to the existing protected admin implementation.
- Updated authentication redirects and protected-page return paths to use the new namespace while preserving existing API routes and session cookies.

# 2026-09-25 — Razorpay checkout foundation
- Added server-side Razorpay order creation using credentials stored in admin settings.
- Added HMAC-SHA256 payment signature verification and order/payment status updates.
- Added Razorpay checkout initialization support to the shop order flow while keeping existing offline payment options available.
- Added server-only `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` configuration with environment-first resolution and masked status in Admin settings.
- Wired configured Shipping Rules and product GST rates into server-side checkout totals, storing tax and shipping amounts on each order.
- Updated the public checkout drawer with GST/shipping breakdowns and a Razorpay payment choice that launches checkout and verifies the payment before confirmation.
- Added a signed Razorpay webhook endpoint for captured, failed, paid, and refund events, including order timeline entries and idempotent status reconciliation.
- Added admin payment timelines with GST, shipping, payment status, and webhook event visibility for each order.
- Applied the final-sale policy: checkout discloses that products, digital goods, courses, consultations, and services are non-returnable/non-refundable; refund status changes are rejected and refund webhooks are logged for manual review.
- Added customer-visible order timeline counts and secure event loading in the client portal, alongside the admin payment timeline.
- Added a public consultation availability endpoint that hides pending and confirmed time slots for a selected date from future booking integrations.
- Connected the availability selector to the public booking form and added server-side conflict protection for race-safe appointment booking.
- Added consultant-aware availability and conflict checks so preferred consultant slots are reconciled consistently on the frontend and backend.
- Bound the consultant selector to live availability refreshes in the public booking form.
- Added an admin consultation calendar workspace for consultant assignment, meeting links, notes, and booking status updates.
- Exposed assigned consultant and meeting-link readiness in the authenticated client consultation history data.
- Added secure client-facing Join meeting actions for confirmed bookings with an administrator-provided meeting URL.
- Added course seat-capacity enforcement and public enrolled/seat counts so full programmes cannot accept additional enrolments.
- Added public course seat availability and full-course states to prevent customers starting unavailable enrollment flows.
- Added automatic client-portal notifications when administrators update consultation status or details.
- Added targeted student notifications when administrators update course enrollment status.

This log records AI-assisted repository work. It complements `CHANGELOG.md`:
the changelog summarizes what changed, while this file preserves the request,
technical decisions, checks performed, and unresolved risks. Secrets and raw
environment values must never be recorded here.

## 2026-09-12 — Settings reference layout and sidebar hierarchy

### Changes

- Reworked Settings into the reference-inspired Settings & integrations layout
  with Business Information and Keys & Integrations tabs.
- Added completion cards for identity/contact, addresses, hours/availability,
  and social profiles, with editable dynamic frontend fields.
- Reorganised the admin sidebar labels and groups to reflect Media Manager, SEO,
  and System & Administration responsibilities.

## 2026-09-12 — Dedicated course catalogue

### Changes

- Added a separate course catalogue workspace with search, category filtering,
  programme metrics, publishing control, and direct editing.
- Extended tabbed course forms with language, learner access period, available
  seats, short description, and featured-course controls.
- Updated the learning API to store the additional dynamic course attributes
  and use the environment-managed admin session.

## 2026-09-12 — Dedicated product catalogue

### Changes

- Replaced the embedded product list with a dedicated product catalogue
  workspace featuring search, category filtering, stock visibility, GST and
  HSN summaries, status control, and direct editing.
- Added database-backed product categories, including category creation,
  ordering, and safe deletion that prevents removal while products still use a
  category.
- Updated product create/edit forms to load the managed category taxonomy.
- Aligned the commerce API with the environment-managed admin session.

### Verification

- TypeScript validation passed. The production build compiled the application
  and completed its type-check phase; its server-side route phase waits on
  configured database runtime calls in this environment.

## 2026-09-12 — Categorised admin navigation

### Changes

- Organised every existing admin module into Workspace, Growth & content,
  Commerce & learning, Client operations, and System sidebar groups.
- Preserved the existing module routes, selected-state behavior, and compact
  icon-only mobile navigation.

## 2026-09-12 — Admin settings centre

### Request

- Add a professional, tabbed admin settings workspace for business details,
  Razorpay credentials, and team roles and permissions.

### Changes

- Added the Settings module with Business profile, Razorpay, and Team access tabs.
- Stored business details and Razorpay values in server-side `site_settings`.
  Razorpay secrets are never returned in full to the browser and are masked on
  subsequent reads.
- Added an editable administrative team roster backed by `staff_members`, with
  per-module permission selections and audit-log entries.
- Kept the existing environment-only owner authentication unchanged. Team
  roster permissions are intentionally labelled as pending enforcement until a
  dedicated multi-user admin sign-in flow is approved and implemented.

### Verification

- `next build` completed successfully, including TypeScript validation and all
  37 generated routes.

## 2026-09-12 — Settings resilience and admin session persistence

### Findings

- A failed settings-data request could leave the client settings view without
  actionable controls.
- The administrator session needed an explicit persistent expiration and a
  cookie domain that works consistently across the apex and `www` domains.

### Changes

- Settings now renders its complete tabbed form immediately using safe empty
  defaults, with a clear error message if saved values cannot be loaded.
- The session cookie now includes both `maxAge` and a concrete expiry date,
  and is shared across official site hostnames without affecting local hosts.

### Verification

- `next build` completed successfully after the resilience and session changes.

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

## 2026-08-21 — Local admin sign-in configuration

### Request

- Correct the development admin sign-in failure.

### Cause and resolution

- The local environment did not define any administrator credentials or a session
  secret. The application therefore relied on an undocumented legacy development
  password hash, leaving no usable local sign-in credential.
- Added explicit development-only administrator configuration in `.env.local`.
  The value is intentionally excluded from Git and is not recorded in this log.
- Restarting the development server is required after this change so Next.js loads
  the new environment values.
- Updated the local password format to avoid `.env` interpolation syntax and fixed
  development redirects so forwarded headers cannot send a localhost sign-in to the
  production domain.

## 2026-08-21 — Secure administrator password controls

### Request

- Add secure administrator password setup and password-reset provisions.

### Changes

- Added a first-time setup page protected by `ADMIN_SETUP_TOKEN`.
- Added a password-reset page supporting either an authenticated current-password
  change or recovery with `ADMIN_PASSWORD_RESET_TOKEN`.
- New passwords are stored as salted PBKDF2-SHA-256 hashes with 310,000 iterations.
- Password changes rotate the server-side session version, invalidating other
  existing administrator sessions.
- Retained legacy SHA-256 verification only for existing deployments until their
  password is changed through the new flow.
- Added development-only setup and recovery tokens in the ignored local environment
  file so the new screens can be exercised locally without being committed.

## 2026-08-21 — Admin UI refinement

### Request

- Improve the login page and admin-panel structure, design, and usability.

### Changes

- Reworked the sign-in hierarchy and recovery affordance without changing the
  server-side authentication contract.
- Added semantic labels, useful invalid-field state, touch-friendly controls,
  visible keyboard focus, and small-screen layout refinements.
- Added an Account security entry point and session context to the admin header.

## 2026-08-21 — Live admin incident investigation

### Finding

- The main domain serves an independently maintained Sites source history rather
  than the current local repository history. Its admin flow uses the provisioned
  D1 database and `attri_session` cookie, not the local Supabase-backed admin
  flow.
- A fresh request to `/admin` correctly redirects to the live sign-in page and
  the sign-in page responds successfully. The reported failure is therefore
  associated with an existing authenticated browser session or its dashboard
  render path, not anonymous admin routing.

### Safety decision

- Production runtime configuration was applied and the existing release was
  restarted. The separately maintained deployed source was not overwritten,
  because its history contains substantial independent functionality and cannot
  be safely replaced by the local branch without a deliberate source-of-truth
  decision.

## 2026-09-06 — One-time administrator login

### Changes

- Added a server-only `ADMIN_ONE_TIME_PASSWORD` flow for first access.
- The one-time password is consumed after successful authentication and redirects
  the administrator to create a permanent password before dashboard access.
- First-login password setup rotates the session version and invalidates the
  temporary session.

## 2026-09-06 — One-time administrator login

### Request

- Provide a clear place to enter the administrator one-time password and explain the first-login flow.

### Changes

- Added first-login OTP authentication and one-time consumption in `app/admin-auth.ts`.
- Added a signed setup-session marker so successful OTP login redirects to permanent password creation.
- Added first-login handling to the admin session, password, setup, and password form routes.
- Updated the login form to label the field as accepting a password or OTP, prefill the configured owner email, and explain the next step.

### Security notes

- The OTP is read from the server-only `ADMIN_ONE_TIME_PASSWORD` environment variable and is never logged or rendered.
- The OTP is invalidated after successful use; administrators must then create a permanent password.

### Verification

- Pending TypeScript, lint, and production build checks after the UI patch.

## 2026-09-06 — Recovery database error handling

### Finding

- Live recovery returned `ENOTFOUND` for the PostgreSQL host, indicating an invalid or unavailable production database connection rather than an invalid recovery token.

### Change

- Password recovery now returns a safe 503 configuration message for database connection failures instead of exposing raw infrastructure details.

## 2026-09-06 — Recovery token validation

### Changes

- Normalized surrounding whitespace on supplied and configured recovery tokens
  while retaining exact, case-sensitive comparison.
- Copy/paste whitespace no longer causes a false invalid-token error; an
  incorrect token remains rejected.

## 2026-09-06 — Admin login resilience

### Changes

- Hardened admin session and sign-in handling so invalid cookies or missing
  runtime configuration do not produce an unhandled server error.
- Added a dedicated admin error boundary with safe retry, sign-in, and recovery
  actions. Administrator authentication remains required.

## 2026-08-21 — Live administrator recovery deployed

### Changes

- Added and deployed a token-protected password recovery page to the active
  D1-based production source.
- Recovery requires a 14-character password with uppercase, lowercase, number,
  and symbol characters, and invalidates all existing administrator sessions.
# 2026-09-12 — Settings module blank-page fix
- Diagnosed the empty Settings & Integrations view: the admin CSS hides all module sections by default (`.admin-main>section{display:none}`), but the settings module had no corresponding visibility selector.
- Added `.admin-module-settings #settings{display:block}` and updated the module header to `SYSTEM / CONFIGURATION` / `Settings & integrations`.
- Verified the settings component is mounted by `AdminDashboard` and its reference-layout markup remains intact.

# 2026-09-13 — Unified typography and admin session hardening
- Switched the shared font import to Poppins and added a final typography layer so public pages, admin pages, headings, controls, and forms use one consistent type system.
- Added responsive admin spacing, card surfaces, focus-visible states, and mobile grid refinements.
- Confirmed the refresh-safe admin cookie implementation remains type-safe after the auth response-cookie changes.

# 2026-09-13 — Reference-aligned admin login
- Inspected the supplied deployed login page and matched its two-column secure-administration composition, deep blue architectural panel, trust badges, centered white login article, field styling, and responsive breakpoints.
- Kept the existing environment-only credential validation and direct response cookie session flow intact.

# 2026-09-13 — Account security and sign-out centre
- Added `/admin/security` with the supplied security-centre layout: account summary, active-session information, password form, environment-managed credential notice, and responsive styling.
- Added server-side current-password verification at `/api/admin/security`; incorrect passwords are rejected without changing session state.
- Added working Security and Sign out actions to the admin header/sidebar. Sign-out clears the signed admin cookie through a direct redirect response.
- Preserved the ENV-only password model: actual password changes require updating `ADMIN_PASSWORD` and redeploying.

# 2026-09-13 — Reference-aligned product catalogue
- Reworked the admin product listing into the supplied catalogue layout with a clean heading/action bar, search and category filters, dynamic product rows, status controls, edit links, and delete confirmation.
- Added a dedicated Product Categories module with reusable name, description, icon URL, display order, status, edit, and delete functionality.
- Extended the commerce schema/API to persist category descriptions and icon URLs while preserving existing products, pricing, inventory, HSN, GST, media, SEO, course, and service fields.

# 2026-09-13 — Admin platform authorization audit
- Audited admin modules against the ENV-based signed admin session and found legacy ChatGPT identity checks in leads, projects, appointments, finance, permissions, data managers, database, growth, notifications, operations, and support APIs.
- Replaced those checks with `getAdminUser()` so one authenticated admin session consistently powers every backend module.
- Preserved audit logging with the signed admin email and verified the complete TypeScript surface after the authorization migration.

# 2026-09-13 — Consultancy booking workflow fields
- Extended appointment persistence with consultant preference, booking type (`now` or `scheduled`), meeting URL, and admin notes.
- Added public booking choices for phone, chat, and video modes plus consultant preference and immediate/scheduled requests.
- Kept existing appointment references, validation, confirmation statuses, and legacy records compatible through additive schema migration.

# 2026-09-13 — Admin refresh-session redirect fix
- Fixed preview/staging authentication persistence: login redirects now remain on the host that issued the session cookie instead of forcing a canonical production host.
- Canonical redirects remain active for the real `attriassociates.com` / `www.attriassociates.com` hosts, while review hosts keep host-only cookies and survive refresh.

# 2026-09-13 — Frontend account-flow alignment
- Reviewed the previous-domain account flow and retained the secure split between verified sign-in, user/consultant registration, and role-based dashboard routing.
- Confirmed `/client/login`, onboarding, `/client`, and `/consultant` use the shared Attri visual system and preserve the registration gate before dashboard access.
- Added the host-preserving auth redirect fix so this same frontend account flow remains stable on the supplied review domain.

# 2026-09-13 — Admin breadcrumb cleanup
- Removed duplicate page-level breadcrumb/eyebrow labels from admin module panels while retaining the single breadcrumb in the sticky admin header.
- Applied the cleanup to catalogue, categories, settings, and standard admin panel titles for consistent navigation hierarchy.

# 2026-09-12 — Admin refresh session persistence
- Changed admin login and logout redirects to attach the session cookie directly to the returned `NextResponse`.
- Kept the signed, 8-hour, HTTP-only cookie and apex-domain coverage for both `attriassociates.com` and `www.attriassociates.com`.
- This prevents hosting/proxy response handling from dropping the cookie between the login POST and dashboard redirect.
- Cookie domain detection now honors `x-forwarded-host`, covering reverse-proxy deployments where the app process sees an internal host.
