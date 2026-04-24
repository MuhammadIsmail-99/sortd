-- Create tables
CREATE TABLE IF NOT EXISTS lists (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  emoji       TEXT DEFAULT '📋',
  color       TEXT DEFAULT '#0075de',
  sort_order  INTEGER DEFAULT 0,
  is_default  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id               TEXT PRIMARY KEY,
  title            TEXT,
  content          TEXT,
  raw_text         TEXT,
  source_type      TEXT CHECK(source_type IN ('url', 'screenshot', 'folder', 'manual')),
  source_url       TEXT,
  source_platform  TEXT,
  thumbnail        TEXT,
  list_id          TEXT DEFAULT 'inbox' REFERENCES lists(id) ON DELETE SET DEFAULT,
  starred          BOOLEAN DEFAULT FALSE,
  search_vector    tsvector,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tags (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS note_tags (
  note_id  TEXT NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id   TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

CREATE TABLE IF NOT EXISTS settings (
  key    TEXT PRIMARY KEY,
  value  TEXT
);

CREATE TABLE IF NOT EXISTS errors (
  id             SERIAL PRIMARY KEY,
  job_id         TEXT,
  error_message  TEXT,
  stack          TEXT,
  payload        JSONB,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notes_list    ON notes(list_id);
CREATE INDEX IF NOT EXISTS idx_notes_created ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_starred ON notes(starred);
CREATE INDEX IF NOT EXISTS idx_tags_name     ON tags(name);
CREATE INDEX IF NOT EXISTS idx_note_tags_tag  ON note_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_note ON note_tags(note_id);
CREATE INDEX IF NOT EXISTS idx_notes_search  ON notes USING GIN(search_vector);

-- Search Trigger
CREATE OR REPLACE FUNCTION notes_search_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.content, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.raw_text, '')), 'C');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notes_search_update BEFORE INSERT OR UPDATE
ON notes FOR EACH ROW EXECUTE FUNCTION notes_search_trigger();

-- List counts RPC
CREATE OR REPLACE FUNCTION get_list_counts()
RETURNS TABLE (list_id TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT n.list_id, COUNT(*)
  FROM notes n
  GROUP BY n.list_id;
END;
$$ LANGUAGE plpgsql;
