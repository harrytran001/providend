# E2E tests

These tests run against the **real app** with **real Postgres and Redis**. No mocks.

**Before running:** start infrastructure from the repo root:

```bash
docker compose up -d
```

(That brings up Postgres, PgBouncer, and Redis. The tests run the Node app in-process and connect to them.)

**Run E2E:**

```bash
# From repo root
pnpm test:e2e

# Or from backend/
pnpm test:e2e
```

Env (defaults work if Docker is on localhost): `PGHOST=localhost`, `PGPORT=6432`, `PGDATABASE=providend`, `PGUSER`, `PGPASSWORD`, `REDIS_HOST=localhost`, `REDIS_PORT=6379`.
