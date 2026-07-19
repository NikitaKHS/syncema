# Video Together

Production-oriented monorepo for synchronized YouTube watch rooms on the web and native Android. The shipped vertical MVP supports guest sessions, room creation/joining, authoritative playback events, reconnect snapshots, participants, and chat. External Google/YouTube services have explicit credential-free fallbacks.

## Quick start

Requirements: Node.js 22+, Corepack, and optionally Docker Desktop.

```powershell
corepack enable
corepack prepare pnpm@10.13.1 --activate
Copy-Item .env.example .env
pnpm install
pnpm dev
```

If the Corepack bundled with Node rejects pnpm's current signing key, use `npx --yes pnpm@10.13.1 install` and `npx --yes pnpm@10.13.1 dev` instead.

Web: `http://localhost:3000` · API: `http://localhost:4000/api/v1` · Swagger: `http://localhost:4000/docs`

For containers: `docker compose up --build`. See [development](docs/DEVELOPMENT.md), [deployment](docs/DEPLOYMENT.md), and [testing](docs/TESTING.md).

## Applications

- `apps/web` — Next.js App Router, React, TanStack Query, Socket.IO, direct YouTube IFrame API adapter.
- `apps/api` — NestJS REST/Socket.IO API, Prisma schema, PostgreSQL/Redis production topology.
- `apps/android` — Kotlin, Jetpack Compose, Material 3, MVVM/StateFlow, Retrofit, Socket.IO, Credential Manager.

No deploy, remote push, Google Play upload, or production signing key is performed by repository scripts.
