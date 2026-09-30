/*
  # Create learning_progress table

  1. New Tables
    - `learning_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `module_id` (text)
      - `completed` (boolean)
      - `score` (integer)
      - `completed_at` (timestamp)
      - `time_spent` (integer, in minutes)

  2. Security
    - Enable RLS on `learning_progress` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS learning_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id text NOT NULL,
  completed boolean DEFAULT false,
  score integer DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  time_spent integer DEFAULT 0,
  UNIQUE(user_id, module_id)
);

-- Enable Row Level Security
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own learning progress"
  ON learning_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress"
  ON learning_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress"
  ON learning_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own learning progress"
  ON learning_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);