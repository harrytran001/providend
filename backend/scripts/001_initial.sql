-- Clients and notes (real DB). Run once, e.g. psql or node script.
-- In production you’d use a proper migration runner.

-- UUIDv7: time-ordered, better for index write performance than random v4.
CREATE EXTENSION IF NOT EXISTS pg_uuidv7;

CREATE TABLE IF NOT EXISTS clients (
  id   UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL,
  content   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_client_id ON notes(client_id);

-- Who is "assigned" to which client (mock auth: only assigned users can list/add notes).
CREATE TABLE IF NOT EXISTS client_assignments (
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id   TEXT NOT NULL,
  PRIMARY KEY (client_id, user_id)
);

-- Seed: a few clients and assignments so we can test.
INSERT INTO clients (id, name) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Acme Corp'),
  ('a0000000-0000-0000-0000-000000000002', 'Beta Inc')
ON CONFLICT DO NOTHING;

INSERT INTO client_assignments (client_id, user_id) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'user-1'),
  ('a0000000-0000-0000-0000-000000000001', 'user-2'),
  ('a0000000-0000-0000-0000-000000000002', 'user-1')
ON CONFLICT DO NOTHING;
