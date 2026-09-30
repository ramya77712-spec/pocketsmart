/*
  # Create user_profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `persona_id` (text)
      - `level` (integer)
      - `experience` (integer)
      - `streak_days` (integer)
      - `total_saved` (numeric)
      - `preferences` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name text NOT NULL,
  persona_id text DEFAULT 'student',
  level integer DEFAULT 1,
  experience integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  total_saved numeric DEFAULT 0,
  preferences jsonb DEFAULT '{
    "currency": "INR",
    "notifications": true,
    "theme": "light",
    "riskTolerance": "moderate",
    "coachingStyle": "motivational",
    "language": "en",
    "accessibility": {
      "highContrast": false,
      "reducedMotion": false,
      "screenReader": false,
      "fontSize": "medium"
    },
    "privacy": {
      "shareProgress": true,
      "allowTeamInvites": true,
      "dataRetention": 365
    }
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();