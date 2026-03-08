# Providend – Full Stack Local Dev

Local setup for the technical assessment: **Node.js Express (TS)**, **React + Vite (TS)**, **PostgreSQL** (with PgBouncer), **Redis**, all orchestrated with **Docker Compose**. One sample endpoint connects backend → frontend for a quick sanity check.

## Prerequisites

- **Node.js** 20+
- **Docker** and **Docker Compose**
- **pnpm**

## Quick start

From the repo root, install all dependencies once:

```bash
pnpm install
```

### 1. Start infrastructure (Postgres, PgBouncer, Redis, Backend)

```bash
docker compose up -d --build
```

- **PostgreSQL**: Postgres 17 with [pg_uuidv7](https://github.com/fboulnois/pg_uuidv7) (time-ordered UUIDv7 for primary keys); data in volume `pgdata`
- **PgBouncer**: port `6432` (app connects here)
- **Redis**: port `6379`, data in volume `redisdata`
- **Backend**: http://localhost:4000

### 2. Run DB migration (for Notes feature)

Start Docker first (step 1). When running the migration **on your machine**, the app connects via PgBouncer (Postgres is not exposed to the host). Set DB env then run:

```bash
PGHOST=localhost PGPORT=6432 PGDATABASE=providend PGUSER=postgres PGPASSWORD=postgres pnpm migrate
```

Or from `backend/`: same env vars, then `pnpm migrate`. This creates `clients`, `notes`, `client_assignments` and seeds two clients + assignments. If you previously used the default Postgres image, remove the `pgdata` volume and run again so the new image (Postgres 17 + pg_uuidv7) starts clean.

### 3. Run the frontend (and test BE → FE)

From the repo root:

```bash
pnpm dev:frontend
```

Or from the frontend folder: `cd frontend && pnpm dev`.

Open **http://localhost:5173**. The app shows **Notes**: pick a client, list/add notes. Mock auth: switch “Logged in as” to **user-1** (assigned to both clients) or **user-2** (Acme only) to test the assignment check.

### 4. Run backend tests (optional)

From the repo root:

```bash
pnpm test:backend
```

Or from the backend folder: `cd backend && pnpm test`.

## Project layout

| Path | Description |
|------|-------------|
| `package.json` | Root workspace; run `pnpm install` once, then `pnpm dev:frontend`, `pnpm test:backend`, etc. |
| `pnpm-workspace.yaml` | pnpm workspace: `backend`, `frontend` |
| `backend/` | Express + TypeScript API, tests (Jest), DB (pg) + Redis (ioredis). See [backend/README.md](backend/README.md) for folder split. |
| `frontend/` | React + TypeScript + Vite, proxy `/api` → backend |
| `docker/` | PgBouncer config |
| `docker-compose.yml` | Postgres, PgBouncer, Redis, backend |

## Notes feature (assignment + real DB)

- **Data model**: Client (id, name), Note (id, clientId, authorId, content, createdAt). “Assignment” (who can act on which client) is in `client_assignments`.
- **API**: `GET /api/clients` (list), `GET /api/clients/:clientId/notes` (list notes; requires `X-Author-Id` and assignment), `POST /api/clients/:clientId/notes` (body `{ content }`; same auth).
- **Mock auth**: Backend reads `X-Author-Id` (default `user-1`). Frontend sends it and lets you switch user to test 403 when not assigned.
- **Run migration once**: `pnpm --filter providend-backend migrate` (after DB is up).

## Env (backend in Docker)

Backend container uses:

- `PGHOST=pgbouncer`, `PGPORT=6432`, `PGDATABASE=providend`, `PGUSER` / `PGPASSWORD`
- `REDIS_HOST=redis`, `REDIS_PORT=6379`
- `FRONTEND_ORIGIN=http://localhost:5173` (CORS)

## Running backend locally (no Docker)

```bash
# From repo root (after pnpm install)
pnpm build:backend   # or pnpm dev:backend
# Ensure Postgres (or PgBouncer) and Redis are up and reachable
export PGHOST=localhost PGPORT=6432 PGDATABASE=providend PGUSER=postgres PGPASSWORD=postgres
export REDIS_HOST=localhost REDIS_PORT=6379
pnpm start:backend
```

Then run the frontend with `pnpm dev:frontend`; the Vite proxy will still target the backend (e.g. `http://localhost:4000`).
