# Attri Associates — Hostinger deployment

## Important compatibility note

This repository is the complete source for the live Attri Associates platform. It uses Next.js 16, React 19, TypeScript, Cloudflare Workers, D1 database, R2 storage, and platform-managed authentication.

It is **not** a PHP/Laravel archive and cannot be made fully operational by extracting it into `public_html`. The admin, client, consultant, authentication, database, uploads, shop, course, order, and notification features require the Cloudflare runtime bindings.

## Recommended production configuration

Keep the application on its existing cloud runtime and use Hostinger only for domain/DNS management. This preserves every working frontend and backend feature.

In Hostinger hPanel, open **Domains → attriassociates.com → DNS/Nameservers → Manage DNS records**. Remove only conflicting A/AAAA/CNAME records for `@` and `www`; retain MX, SPF, DKIM, DMARC, and other email records.

Create these records:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `162.159.143.30` | 300 |
| A | `@` | `172.66.3.26` | 300 |
| CNAME | `www` | `custom-domains.chatgpt.site` | 300 |
| TXT | `_openai-site-verification` | `openai-site-verification=vdvm0d1iccRrduI3J24RLH6pwmWc1l8-c3wsoCqD2Kc` | 300 |
| TXT | `_cf-custom-hostname` | `343b9bae-e225-432a-9227-8a9e4dd58a7e` | 300 |
| TXT | `_openai-site-verification.www` | `openai-site-verification=K4PWalGCN0jMGoBAIrpVMO0AkVPJVfD5rCqu5-c-51w` | 300 |
| TXT | `_cf-custom-hostname.www` | `a69fff7a-d9e3-41cb-bc08-b145aa3005b0` | 300 |

After DNS validation and SSL activation, these URLs use the same application:

- `https://attriassociates.com`
- `https://www.attriassociates.com`
- `https://attriassociates.com/admin`
- `https://attriassociates.com/client/login`
- `https://attriassociates.com/consultant`

## Source development

Requirements:

- Node.js 22.13 or newer
- npm
- Linux environment with Bash, curl, flock, and GNU timeout

Install and validate:

```bash
npm ci
npm test
```

Do not upload `node_modules`, `.git`, `.sites-runtime`, `.next`, or local environment files to a public server.

## Hostinger Node app deployment

If your Hostinger plan supports Node.js applications, you can deploy this repository as a generic Node app rather than a specialized vinext option.

1. Install dependencies and build the Hostinger artifact:

```bash
npm ci
npm run build:hostinger
```

2. Ensure the build output includes `dist/hostinger/server.js`.
3. Configure Hostinger to start the application with:

```bash
npm run start:hostinger
```

4. Set the required environment variables on Hostinger:

- `SUPABASE_DB_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `PORT` (if Hostinger does not set one automatically)

5. This app still requires a compatible database/storage backend and cannot be deployed as static HTML.

## Hostinger Next.js preset

If you choose `Framework preset = Next.js` in Hostinger, use these values:

- Build command: `npm run build`
- Start command: `npm run start`
- Package manager: `npm`
- Output directory: leave blank or `.next` if required
- Entry file: usually not needed for Next.js preset

This repository now supports standard Next.js build and start behavior via `next build` and `next start`.

## Hostinger VPS migration

A true Hostinger VPS deployment requires a separate migration project before launch:

1. Replace Cloudflare D1 with PostgreSQL or MySQL.
2. Replace R2 bindings with S3-compatible or local object storage.
3. Replace platform-managed authentication with an application-owned OAuth/JWT/OTP system.
4. Replace the Worker entry point with a supported Node.js HTTP server or container.
5. Migrate schema and production data.
6. Configure Nginx, process supervision, TLS, backups, firewall, and environment secrets.

Until that migration is completed, do not direct the domain to a VPS copy; it would disable secured and database-backed features.

