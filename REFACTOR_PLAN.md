# Refactor & Dockerization Plan — THODZ Builder

## 1. Current state

Next.js 16 (App Router) + React 19, Prisma 7 + Postgres, Supabase Auth/Storage, Zustand, Tailwind 4. About 6.7k lines of TS/TSX.

### Critical bugs: the core product doesn't work end to end

| # | Problem | Where |
|---|---------|-------|
| B1 | **The editor never loads the real website.** It shows hard-coded mock data (`modern-minimal` template, page id `page-1`) for every site. | `src/app/editor/[websiteId]/page.tsx:77-115` |
| B2 | Because of B1, auto-save sends `PUT /api/pages/page-1`, which returns 404. **No edits are ever saved.** | `AutoSaveManager.tsx` |
| B3 | `markAsSaved()` is never called, so `hasUnsavedChanges` stays `true` forever. | `AutoSaveManager.tsx` |
| B4 | New sections get a `section-<ts>` id, and the API treats any non-`temp-` id as existing. New sections would crash the save, or be duplicated on every save if renamed. | `editorStore.ts:221`, `api/pages/[id]/route.ts:58` |
| B5 | Deleted sections are removed only on the client and never deleted in the DB. | `editorStore.ts:249` |
| B6 | "Publish" does nothing. There is no public route that renders a published site, and `/preview/[id]` (linked from the dashboard) doesn't exist. | `EditorToolbar.tsx`, `dashboard/page.tsx:159` |
| B7 | Undo/redo snapshots `website`, but sections live in `currentPage`, so undo doesn't revert section edits. | `editorStore.ts` |

### Security issues

| # | Severity | Problem | Where |
|---|----------|---------|-------|
| S1 | **Critical** | `GET /api/dev/clear` is unauthenticated and **deletes every website in the DB**. Middleware doesn't cover `/api`, so anyone can call it. | `src/app/api/dev/clear/route.ts` |
| S2 | **High** | IDOR: `PUT /api/pages/:id` updates any section id in the body without checking that the section belongs to this page. A user can overwrite other users' sections. | `api/pages/[id]/route.ts:58` |
| S3 | High | Open redirect: `next` in the auth callback isn't validated (`?next=//evil.com`). | `auth/callback/route.ts` |
| S4 | Medium | Error responses leak `err.message`. Request bodies have no validation or size limits, and `content`/`style` accept arbitrary JSON. | API routes |
| S5 | Medium | When Supabase env vars are missing, middleware silently turns auth off. | `lib/supabase/middleware.ts` |
| S6 | Medium | Without Supabase, images are stored as base64 data URLs inside section JSON, which bloats the DB. | `ImageUploader.tsx:79` |
| S7 | Low | Postgres SSL is forced with `rejectUnauthorized:false`. That blocks a plain local Postgres (in Docker, for example) and also disables certificate checks. | `lib/prisma/client.ts` |

### Architecture and code quality

- **Business logic lives in route handlers.** Ownership checks are repeated four different ways, and every check is a separate query followed by the write (TOCTOU).
- **Section reorder (`PATCH`) isn't transactional.** It runs N parallel updates, so a crash halfway leaves duplicate `order` values.
- **The save model is chatty and lossy.** Every keystroke debounces into a full page-and-website PUT. There are no diffs and no concurrency control (last write wins across tabs).
- **Validation is ad hoc.** It's done with `typeof` checks, and `Section.content` has no per-type schema even though `lib/types` defines the shapes.
- **Dead and duplicate code:** `scripts/clear-db.{ts,js,mjs}`, the unused `Asset` model, TanStack Query installed but unused, a stray `startTransition` import, and `// Trigger restart` in `next.config.ts`.
- **Templates and section default content are defined in two places:** `templates/config.ts` and `getDefaultContent` in the store.
- **`any` is used throughout the API.** There are no tests, no CI, and no seed data. `prisma db push` is recommended even though migrations exist.
- **Docker blocker:** `NEXT_PUBLIC_SUPABASE_*` values are baked into the bundle at build time, so one image can't be reused across environments.

---

## 2. Target architecture

```
src/
├── app/
│   ├── (marketing)/            landing page
│   ├── (auth)/                 login / signup
│   ├── (dashboard)/            dashboard, templates
│   ├── editor/[websiteId]/     editor (server component loads data, then client editor)
│   ├── s/[slug]/               NEW: public rendering of published sites (SSR/ISR)
│   └── api/                    thin HTTP adapters only
│       └── health/             NEW: liveness/readiness for Docker
├── server/                     NEW: server-only code
│   ├── db.ts                   Prisma client (env-driven SSL)
│   ├── auth.ts                 session → user (one place)
│   ├── env.ts                  zod-validated env, fails fast at boot
│   ├── services/               websiteService, pageService, assetService
│   │                           (ownership enforced in the WHERE clause, transactions)
│   └── storage/                StorageDriver interface: local disk | S3/MinIO
├── features/                   co-located by domain
│   ├── editor/                 store, components, autosave hook
│   ├── sections/               registry: type → {schema, defaults, Component, Editor}
│   └── templates/
├── shared/
│   ├── schemas/                zod schemas shared by client + server
│   └── ui/                     design-system components
└── middleware.ts
```

Key design decisions:

1. **Section registry as the single source of truth.** Each section type exports `{ type, zodSchema, defaultContent, Renderer, EditorPanel }`. Templates, store defaults, API validation and the public renderer all read from it. Adding a section type means adding one file.
2. **Service layer with ownership in the query.** For example, `prisma.section.updateMany({ where: { id, page: { website: { userId } } } })`. This removes TOCTOU and makes IDOR impossible by construction.
3. **A single editor save endpoint.** `PUT /api/websites/:id/draft` accepts `{ version, theme, pages: [{ id, sections: [...] }] }`. It runs in one transaction that upserts, deletes missing sections and returns server ids. An optimistic `version` column returns 409 on concurrent edits. Client ids become UUIDs generated with `crypto.randomUUID()`, so there's no temp-id mapping.
4. **Server components for data loading.** The editor page fetches the website on the server and hydrates the Zustand store. TanStack Query is used for the dashboard, or removed.
5. **Publishing writes a snapshot.** Publishing copies the draft JSON into `publishedSnapshot`. `/s/[slug]` renders that snapshot, so later draft edits don't change the live site. Custom domains can come later through middleware host routing.
6. **Runtime config, not build-time config.** Remove `NEXT_PUBLIC_*` secrets so one Docker image runs anywhere.

---

## 3. Docker: making it "just run"

**Decision needed: auth and storage provider.** Supabase is a hosted dependency, so `docker compose up` alone can't provide auth.

- **Option A (recommended): fully self-contained.** Replace Supabase Auth with **Better Auth** (or Auth.js), which stores users and sessions in the same Postgres through Prisma and supports email/password plus optional Google/GitHub OAuth. Replace Supabase Storage with a `StorageDriver`: local volume by default, S3/MinIO optional.
  Result: `docker compose up` works with zero accounts, and only `AUTH_SECRET` is needed.
- **Option B: keep Supabase.** Compose runs the app and Postgres, and the user still needs a Supabase project and keys. It's less work, but it's not "runs on every machine".

### Files to add

- **`Dockerfile`** — multi-stage build on `node:22-alpine`:
  1. `deps`: `npm ci`
  2. `build`: `prisma generate` and `next build` with `output: 'standalone'`
  3. `runner`: non-root user. It copies only `.next/standalone`, `.next/static`, `public` and `prisma`. The final image should be about 200 MB.
  4. `entrypoint.sh`: runs `prisma migrate deploy` (waiting for the DB), then `node server.js`. It also has a `HEALTHCHECK` against `/api/health`.
- **`docker-compose.yml`**:
  - `db`: `postgres:17-alpine` with a named volume and a healthcheck.
  - `app`: build `.`, port `3000`, depends on a healthy `db`, an `uploads` volume, and env from `.env`.
  - Optional profile `s3`: MinIO.
- **`docker-compose.dev.yml`**: the source tree bind-mounted with `next dev` hot reload, so local development needs no Node either.
- **`.dockerignore`** and **`.env.example`** containing `DATABASE_URL`, `AUTH_SECRET`, `APP_URL`, `DATABASE_SSL=false`, `STORAGE_DRIVER=local`.
- `next.config.ts`: add `output: 'standalone'`.

Final user experience:
```
cp .env.example .env
docker compose up -d
# → http://localhost:3000
```

---

## 4. Execution phases (each phase is one PR)

| Phase | Scope | Outcome |
|-------|-------|---------|
| **0. Safety** | Delete `/api/dev/clear` and the `scripts/clear-db.*` files. Fix the IDOR (S2) and the open redirect (S3). Stop leaking error messages. | No critical vulnerabilities. Small and urgent. |
| **1. Docker + env** | Dockerfile, compose files, `.env.example`, `env.ts` validation, env-driven DB SSL, `/api/health`, standalone output. Switch to `prisma migrate deploy` and add a seed script. | One-command run (with Supabase until Phase 2 if Option A). |
| **2. Auth/storage** (Option A) | Better Auth with Prisma, a new migration, login/signup rewired, middleware session check, `StorageDriver` (local/S3), and the `Asset` model actually used. | Fully self-contained image. |
| **3. Server layer** | `src/server/` services, zod schemas, the `draft` save endpoint with a `version` column, and thin route handlers with no `any`. | Secure, transactional backend. |
| **4. Editor fixes** | Server-loaded editor, UUID client ids, a fixed autosave (dirty tracking, `markAsSaved`, retries, a "Saved/Saving/Error" indicator, `beforeunload` guard), and undo/redo across sections. | Fixes B1–B5 and B7. Edits persist. |
| **5. Section registry + publish** | Section registry refactor, deduplicated templates, `publishedSnapshot`, `/s/[slug]` public renderer, and preview route. | Fixes B6. The product works end to end. |
| **6. Quality** | Vitest for services and schemas, Playwright smoke test (signup → create → edit → publish), GitHub Actions (lint, typecheck, test, Docker build and push to GHCR), and an updated README. | Regressions get caught. Image published to `ghcr.io/tellihatem/custom`. |

---

## 5. Notes
- I couldn't run `npm ci`, the typecheck or lint yet, because installing dependencies from the cloned repo was blocked pending permission. The baseline build health is still unverified.
- Docker isn't installed on this machine (`sudo apt install docker.io docker-compose-v2`). It's needed to build and test the image locally.
