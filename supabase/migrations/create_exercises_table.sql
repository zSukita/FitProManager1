/*
      # Create exercises table

      1. New Tables
        - `exercises`
          - `id` (uuid, primary key)
          - `created_at` (timestamptz)
          - `name` (text, not null)
          - `description` (text)
          - `category` (text, not null)
          - `muscle_group` (text, not null)
          - `equipment` (text, not null)
          - `difficulty` (text, not null)
          - `video_url` (text)
          - `image_url` (text)
          - `created_by` (uuid, foreign key to auth.users)
      2. Security
        - Enable RLS on `exercises` table
        - Add policy for authenticated users to read all exercises
        - Add policy for authenticated users to create exercises
    */

    CREATE TABLE IF NOT EXISTS exercises (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamptz DEFAULT now(),
      name text NOT NULL,
      description text,
      category text NOT NULL,
      muscle_group text NOT NULL,
      equipment text NOT NULL,
      difficulty text NOT NULL,
      video_url text,
      image_url text,
      created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL -- Link exercise to the user who created it
    );

    ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

    -- Allow authenticated users to read all exercises
    CREATE POLICY "Authenticated users can view exercises"
      ON exercises FOR SELECT
      TO authenticated
      USING (true);

    -- Allow authenticated users to create exercises
    CREATE POLICY "Authenticated users can create exercises"
      ON exercises FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() IS NOT NULL);

    -- Optional: Add policies for update/delete if needed later
    -- CREATE POLICY "Authenticated users can update their own exercises"
    --   ON exercises FOR UPDATE
    --   TO authenticated
    --   USING (auth.uid() = created_by);

    -- CREATE POLICY "Authenticated users can delete their own exercises"
    --   ON exercises FOR DELETE
    --   TO authenticated
    --   USING (auth.uid() = created_by);