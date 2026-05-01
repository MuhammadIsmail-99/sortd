-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Notes Policies
CREATE POLICY "Users can only see their own notes"
ON notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own notes"
ON notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own notes"
ON notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own notes"
ON notes FOR DELETE
USING (auth.uid() = user_id);

-- Lists Policies
CREATE POLICY "Users can only see their own lists"
ON lists FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own lists"
ON lists FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own lists"
ON lists FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own lists"
ON lists FOR DELETE
USING (auth.uid() = user_id);

-- Jobs Policies
CREATE POLICY "Users can only see their own jobs"
ON jobs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own jobs"
ON jobs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own jobs"
ON jobs FOR UPDATE
USING (auth.uid() = user_id);

-- Ensure all current tables have user_id if not already there
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jobs' AND column_name='user_id') THEN
        ALTER TABLE jobs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;
