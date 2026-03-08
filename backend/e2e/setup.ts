/**
 * Run before E2E tests. Ensures the app connects to PgBouncer (port 6432) and Redis on localhost
 * when running on the host (docker compose up -d). Without this, the app would use default Postgres
 * port 5432 and get ECONNREFUSED.
 */
if (!process.env.PGPORT) process.env.PGPORT = '6432';
if (!process.env.PGHOST) process.env.PGHOST = 'localhost';
if (!process.env.PGDATABASE) process.env.PGDATABASE = 'providend';
if (!process.env.PGUSER) process.env.PGUSER = 'postgres';
if (!process.env.PGPASSWORD) process.env.PGPASSWORD = 'postgres';
if (!process.env.REDIS_HOST) process.env.REDIS_HOST = 'localhost';
if (!process.env.REDIS_PORT) process.env.REDIS_PORT = '6379';
