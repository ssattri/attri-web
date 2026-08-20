# Attri Associates Website

Production website and operating portals for Attri Associates & Vastu
Consultants. The application covers public service pages, consultation booking,
products and courses, customer and consultant workspaces, and a protected admin
control centre.

## Technology

- Next.js 16 and React 19 with TypeScript
- Tailwind CSS 4 and the shared design system in `app/globals.css`
- PostgreSQL hosted by Supabase and accessed server-side through prepared statements
- Cloudflare-compatible Vinext output for OpenAI Sites hosting
- R2-compatible object storage for protected client and consultant files

## Local setup

Use Node.js 22.13 or newer. Copy `.env.example` to `.env.local`, replace every
placeholder, and then install and start the application:

```sh
npm ci
npm run dev
```

Required production values:

- `SUPABASE_DB_URL`: server-only Supabase transaction-pooler URL
- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS website URL
- `ADMIN_EMAIL`: administrator email address
- `ADMIN_PASSWORD`: strong administrator password
- `ADMIN_SESSION_SECRET`: random value of at least 32 characters

Production admin access intentionally fails closed when its credentials or
session secret are missing. Never expose database credentials or admin secrets
through a `NEXT_PUBLIC_` variable.

## Quality checks

```sh
npm run lint
npm run build
npm test
```

The Windows workspace path contains `&`. If `npx` misinterprets that path, use
the package scripts above or execute the installed tool from `node_modules`.

## Database changes

The application schema lives in `db/schema.ts`. Generate and review a Drizzle
migration after every schema change and keep the Supabase migration in sync.
Do not place schema-altering SQL in browser code or expose the Supabase service
role to clients. Review grants and row-level security whenever a table is made
available through the Supabase Data API.

## Project records

- `CHANGELOG.md` records notable changes under `Unreleased`.
- `AI_LOG.md` records AI-assisted decisions, checks, and follow-up items without
  secrets or private customer data.
- `HOSTINGER-DEPLOYMENT.md` contains the alternate Hostinger deployment path.
