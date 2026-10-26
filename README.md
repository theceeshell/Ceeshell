# Cee-Shell

Marketing site for Cee-Shell (branding, packaging, photography, print, corporate gifts) with a built-in CMS at `/admin`.

- **Stack:** Next.js 16 (App Router), Prisma 7 + PostgreSQL, Tailwind 4, TipTap
- **Hosting:** Vercel project `ceeshell` (region `sin1`), auto-deploys from `main`
- **Database & files:** Supabase project `yjeljgkofeexvfauebof` (ap-southeast-1), Postgres + Storage

## How it works

- Public pages are **statically rendered and cached (ISR)**. Saving anything in the admin calls `revalidateSite()`, which refreshes the cached pages, and there's also a daily time-based revalidation as a safety net. Public visitors almost never hit the database.
- Page layouts are built from **sections** (`src/lib/cms/section-types.ts`). Services, projects, posts and similar items are separate tables that sections reference by id.
- **Uploads** go to Supabase Storage:
  - `media` is a public bucket for the Media Library. The browser uploads to it directly through a signed URL.
  - `inquiry-attachments` is a private bucket for contact-form files. Admins download them through short-lived signed URLs.
- **Auth:** email + password, with a JWT cookie that is re-checked against the DB on every request.
  - Bumping `User.sessionVersion` signs the user out everywhere. This happens on logout, password, role or active changes.
  - Roles: `ADMIN` (everything), `EDITOR` (content only; no settings, SEO, navigation, footer or users).
- The Supabase **Data API is locked down**: every table has RLS enabled and no grants for `anon` or `authenticated`. The app connects only through Prisma as the table owner. Never add `grant … to anon` to a migration.

## Environment variables

| Name | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | Vercel + local | Supabase **transaction pooler** (port 6543) |
| `MIGRATE_DATABASE_URL` | local only | Supabase **session pooler** (port 5432), used by Prisma migrate/seed |
| `AUTH_SECRET` | Vercel + local | 32+ random characters, used to sign session cookies |
| `SUPABASE_URL` | Vercel + local | `https://<project-ref>.supabase.co` |
| `SUPABASE_SECRET_KEY` | Vercel + local | Supabase secret key (server-only; never prefix with `NEXT_PUBLIC_`) |
| `NEXT_PUBLIC_SITE_URL` | optional | Canonical site URL. Defaults to the Vercel production domain. Set it when a custom domain goes live. |
| `RESEND_API_KEY`, `INQUIRY_NOTIFY_EMAIL`, `MAIL_FROM` | optional | Email notification for new inquiries |

## Development

```bash
npm install
npm run dev               # http://localhost:3000, admin at /admin
npm run lint
npx prisma migrate dev    # create a migration after editing prisma/schema.prisma
npx prisma migrate deploy # apply pending migrations to the database in .env
```

`npm run db:seed` fills an **empty** database with starter content. It refuses to run when content already exists, because it would wipe CMS edits. It needs `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.

## Deploying

1. If `prisma/migrations` changed, run `npx prisma migrate deploy` first.
2. Push to `main`. Vercel builds and deploys automatically.

## Free-tier notes

- **Vercel Hobby** is for non-commercial use only. Move to Pro once the site is used commercially.
  - Image optimization is limited to the hosts in `src/lib/image-hosts.ts`, serves WebP only and caches for 31 days. This keeps transformations within the quota.
- **Supabase Free:** 500 MB database and 1 GB storage.
  - The project **pauses after 7 days without activity**. Because pages are cached, visitors alone may not keep it awake.
  - Open the admin panel at least weekly, or upgrade.
