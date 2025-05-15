/*
  # Create workouts table

  1. New Tables
    - `workouts`
      - `id` (uuid, primary key)
      - `trainer_id` (uuid, foreign key to auth.users)
      - `client_id` (uuid, foreign key to clients)
      - `name` (text)
      - `description` (text)
      - `exercises` (jsonb) -- Array of exercise objects { name, sets, reps, weight, notes }
      - `date` (timestamptz)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `workouts` table
    - Add policy for authenticated users (trainers) to read their own workouts
    - Add policy for authenticated users (trainers) to create workouts
    - Add policy for authenticated users (trainers) to update their own workouts
    - Add policy for authenticated users (trainers) to delete their own workouts
*/

CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  exercises jsonb DEFAULT '[]'::jsonb,
  date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can read their own workouts"
  ON workouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can create workouts"
  ON workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can update their own workouts"
  ON workouts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = trainer_id)
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can delete their own workouts"
  ON workouts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = trainer_id);
