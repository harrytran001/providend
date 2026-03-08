# Backend – folder structure

How the backend is split and where to put new code.

```
backend/
├── src/
│   ├── index.ts              # Server entry: imports app, calls listen
│   ├── app.ts                # Express app (routes, middleware). Used by index and E2E.
│   ├── config/               # Env and app config (single source of truth)
│   ├── routes/               # HTTP layer: define routes and call services
│   ├── services/             # Business logic (reusable, no req/res)
│   ├── repositories/         # Data access: all DB/Redis queries live here
│   ├── lib/                  # Raw clients only (Pool, Redis instance). No queries.
│   ├── middleware/           # Express middleware (auth, logging, error handling)
│   └── types/                # Shared TypeScript types / DTOs
├── e2e/                      # E2E tests (real DB/Redis). Run with pnpm test:e2e
├── package.json
├── tsconfig.json
├── jest.config.js
└── jest.e2e.config.js
```

| Folder | Purpose | Examples |
|--------|---------|----------|
| **`config/`** | Environment and configuration. Export things like `dbConfig`, `redisConfig`, `port`. | `config/index.ts` reading `process.env` |
| **`routes/`** | Define URL paths and HTTP methods. Parse request, call a service, send response. Keep handlers thin. | `health.ts`, `hello.ts`, `users.ts` |
| **`services/`** | Business logic. No Express `req`/`res`; receive plain data, return data or throw. Call repositories, not lib. | `userService.create()`, `healthService.getHealth()` |
| **`repositories/`** | Data access layer. All DB queries and Redis get/set go here. One repo per “data surface” or entity (e.g. `dbRepository`, `redisRepository`, `userRepository`). Uses clients from `lib/`. | `dbRepository.ping()`, `userRepository.findById()` |
| **`lib/`** | Raw connections (Postgres pool, Redis client) and shared utilities (e.g. logger). | `db.ts`, `redis.ts`, `logger.ts` |
| **`middleware/`** | Reusable Express middleware: auth, request ID, error handler, rate limit. | `auth.ts`, `errorHandler.ts` |
| **`types/`** | Shared types, request/response shapes, DTOs. | `User.ts`, `api.ts` |

**Flow:** `Request` → **route** (parse input) → **service** (business logic) → **repository** (queries / data access) → **lib** (raw client) → **repository** (return data) → **service** (shape result) → **route** (send response).

Put new endpoints in `routes/`, new business logic in `services/`, and all DB/Redis access in `repositories/` (e.g. `userRepository.ts` for user table queries). Use **`log`** from `@/lib/logger` (or `../lib/logger`) for logging: `log.info()`, `log.warn()`, `log.error()`, `log.debug()`. Set `LOG_LEVEL=debug` (or `info`/`warn`/`error`) to filter by level.

---

## Testing

| Kind | What it tests | Where | Example |
|------|----------------|--------|---------|
| **Route / API integration** | HTTP contract: status, body shape. Route + service (repos mocked or real). | Next to the route, e.g. `routes/health.test.ts` | `request(app).get('/api/health')` with supertest |
| **Unit** | One function or module in isolation; dependencies mocked. | Next to the code, e.g. `services/healthService.test.ts` | `getHealth()` with mocked repositories |
| **E2E** | Full stack with real DB/Redis. No mocks. | `e2e/*.e2e.ts` | Real app + real DB + Redis |

**Run tests**
- `pnpm test` — unit + route integration (mocked repos). Fast, no infra needed.
- `pnpm test:e2e` — E2E only. **Requires Postgres and Redis to be up** (e.g. `docker compose up -d`). Uses real connections.

The current tests in `routes/*.test.ts` are **route-level integration tests**: they mount the router, send HTTP requests (supertest), and assert on the response. For health we mock the repositories so the test doesn’t need a real DB/Redis. For more coverage, add **unit tests** for services (e.g. `services/healthService.test.ts`) that call the service and mock the repositories.
