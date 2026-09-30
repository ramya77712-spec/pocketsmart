/*
  # Create challenges table

  1. New Tables
    - `challenges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `challenge_id` (text)
      - `is_active` (boolean)
      - `progress` (integer)
      - `started_at` (timestamp)
      - `completed_at` (timestamp, nullable)
      - `target` (integer)

  2. Security
    - Enable RLS on `challenges` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id text NOT NULL,
  is_active boolean DEFAULT true,
  progress integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz NULL,
  target integer NOT NULL,
  UNIQUE(user_id, challenge_id)
);

-- Enable Row Level Security
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own challenges"
  ON challenges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges"
  ON challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges"
  ON challenges
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges"
  ON challenges
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);