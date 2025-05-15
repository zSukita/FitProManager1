/*
  # Create clients table

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `trainer_id` (uuid, foreign key to auth.users)
      - `name` (text)
      - `email` (text, unique per trainer)
      - `phone` (text)
      - `age` (integer)
      - `gender` (text)
      - `goal` (text)
      - `status` (text, default 'ativo')
      - `start_date` (timestamptz, default now())
      - `avatar_url` (text)
      - `medical_history` (text)
      - `notes` (text)
      - `measurements` (jsonb)
      - `workout_ids` (text[])
      - `plan_id` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `clients` table
    - Add policy for authenticated users (trainers) to read their own clients
    - Add policy for authenticated users (trainers) to create clients
    - Add policy for authenticated users (trainers) to update their own clients
    - Add policy for authenticated users (trainers) to delete their own clients
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text, -- Making email optional as per common practice, unique per trainer enforced by index
  phone text,
  age integer,
  gender text,
  goal text,
  status text DEFAULT 'ativo',
  start_date timestamptz DEFAULT now(),
  avatar_url text,
  medical_history text,
  notes text,
  measurements jsonb, -- Store measurements as JSONB
  workout_ids text[], -- Store workout IDs as text array
  plan_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint on email per trainer, allowing multiple NULL emails
CREATE UNIQUE INDEX IF NOT EXISTS clients_trainer_id_email_idx ON clients (trainer_id, email) WHERE email IS NOT NULL;

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can read their own clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can create clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can update their own clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = trainer_id)
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can delete their own clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (auth.uid() = trainer_id);
