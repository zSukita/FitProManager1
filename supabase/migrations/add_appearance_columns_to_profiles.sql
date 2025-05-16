/*
      # Add appearance columns to profiles table

      1. Changes
        - Add `theme` column to `profiles` table
        - Add `primary_color` column to `profiles` table
        - Add `layout` column to `profiles` table
    */

    DO $$
    BEGIN
      -- Add theme column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'theme'
      ) THEN
        ALTER TABLE profiles ADD COLUMN theme text DEFAULT 'claro';
      END IF;

      -- Add primary_color column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'primary_color'
      ) THEN
        ALTER TABLE profiles ADD COLUMN primary_color text DEFAULT 'verde';
      END IF;

      -- Add layout column if it doesn't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'layout'
      ) THEN
        ALTER TABLE profiles ADD COLUMN layout text DEFAULT 'barraLateral';
      END IF;
    END $$;