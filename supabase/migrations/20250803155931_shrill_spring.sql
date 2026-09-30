/*
  # Create user_badges table

  1. New Tables
    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `badge_id` (text)
      - `unlocked_at` (timestamp)
      - `category` (text)

  2. Security
    - Enable RLS on `user_badges` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  category text NOT NULL,
  UNIQUE(user_id, badge_id)
);

-- Enable Row Level Security
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own badges"
  ON user_badges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own badges"
  ON user_badges
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);