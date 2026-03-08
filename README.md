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

- **PostgreSQL**: data in volume `pgdata`
- **PgBouncer**: port `6432` (app connects here)
- **Redis**: port `6379`, data in volume `redisdata`
- **Backend**: http://localhost:4000

### 2. Run the frontend (and test BE → FE)

From the repo root:

```bash
pnpm dev:frontend
```

Or from the frontend folder: `cd frontend && pnpm dev`.

Open **http://localhost:5173**. The page calls `GET /api/hello` (proxied to the backend). If you see JSON with `"Hello from Providend API"`, the stack is working.

### 3. Run backend tests (optional)

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

## Sample endpoint (BE → FE)

- **Backend**: `GET http://localhost:4000/api/hello`  
  Response: `{ message, timestamp, environment }`
- **Frontend**: Vite dev server proxies `/api` to the backend; the app fetches `/api/hello` and displays the JSON.

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
