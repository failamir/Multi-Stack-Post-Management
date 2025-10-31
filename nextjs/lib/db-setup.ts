import { supabase } from './supabase';

export async function setupDatabase() {
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS posts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title text NOT NULL,
        content text NOT NULL,
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
      );

      ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Anyone can view posts" ON posts;
      CREATE POLICY "Anyone can view posts"
        ON posts
        FOR SELECT
        TO authenticated
        USING (true);

      DROP POLICY IF EXISTS "Users can insert own posts" ON posts;
      CREATE POLICY "Users can insert own posts"
        ON posts
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can update own posts" ON posts;
      CREATE POLICY "Users can update own posts"
        ON posts
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);

      DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
      CREATE POLICY "Users can delete own posts"
        ON posts
        FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id);

      CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
      CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
    `
  });

  if (error) {
    console.error('Database setup error:', error);
  }
}
