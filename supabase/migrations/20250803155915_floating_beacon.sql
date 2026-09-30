/*
  # Create financial_data table

  1. New Tables
    - `financial_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `monthly_income` (numeric)
      - `expenses` (jsonb array)
      - `emergency_fund` (numeric)
      - `current_savings` (numeric)
      - `currency` (text, default 'INR')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `financial_data` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS financial_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  monthly_income numeric DEFAULT 0,
  expenses jsonb DEFAULT '[]'::jsonb,
  emergency_fund numeric DEFAULT 0,
  current_savings numeric DEFAULT 0,
  currency text DEFAULT 'INR',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE financial_data ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own financial data"
  ON financial_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial data"
  ON financial_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial data"
  ON financial_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial data"
  ON financial_data
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_data_updated_at
  BEFORE UPDATE ON financial_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();