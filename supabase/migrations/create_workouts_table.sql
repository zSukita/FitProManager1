/*
      # Create workouts table and RLS policies

      1. New Tables
        - `workouts`
          - `id` (uuid, primary key)
          - `trainer_id` (uuid, foreign key to auth.users)
          - `name` (text, not null)
          - `description` (text)
          - `type` (text, not null)
          - `notes` (text)
          - `target_muscle_groups` (text[], not null)
          - `exercises` (jsonb, not null) - Stores array of workout exercises
          - `created_at` (timestamptz)
          - `updated_at` (timestamptz)
      2. Security
        - Enable RLS on `workouts` table
        - Add policies for authenticated users to perform CRUD operations on their own workouts.
    */

    -- Create the workouts table
    CREATE TABLE IF NOT EXISTS workouts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      trainer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      name text NOT NULL,
      description text,
      type text NOT NULL,
      notes text,
      target_muscle_groups text[] NOT NULL DEFAULT '{}',
      exercises jsonb NOT NULL DEFAULT '[]',
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable Row Level Security
    ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

    -- Policy for authenticated users to view their own workouts
    CREATE POLICY "Authenticated users can view their own workouts"
      ON workouts
      FOR SELECT
      TO authenticated
      USING (auth.uid() = trainer_id);

    -- Policy for authenticated users to create workouts
    CREATE POLICY "Authenticated users can create workouts"
      ON workouts
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = trainer_id);

    -- Policy for authenticated users to update their own workouts
    CREATE POLICY "Authenticated users can update their own workouts"
      ON workouts
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = trainer_id)
      WITH CHECK (auth.uid() = trainer_id);

    -- Policy for authenticated users to delete their own workouts
    CREATE POLICY "Authenticated users can delete their own workouts"
      ON workouts
      FOR DELETE
      TO authenticated
      USING (auth.uid() = trainer_id);

    -- Add index for trainer_id for faster lookups
    CREATE INDEX IF NOT EXISTS workouts_trainer_id_idx ON workouts (trainer_id);

    -- Function to update updated_at timestamp
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Trigger to update updated_at on update
    DROP TRIGGER IF EXISTS update_workouts_updated_at ON workouts;
    CREATE TRIGGER update_workouts_updated_at
    BEFORE UPDATE ON workouts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();