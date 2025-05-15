/*
  # Create payments table

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `trainer_id` (uuid, foreign key to auth.users)
      - `client_id` (uuid, foreign key to clients)
      - `amount` (numeric)
      - `payment_date` (timestamptz)
      - `method` (text) -- e.g., 'Pix', 'Cartão', 'Dinheiro'
      - `notes` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `payments` table
    - Add policy for authenticated users (trainers) to read their own payments
    - Add policy for authenticated users (trainers) to create payments
    - Add policy for authenticated users (trainers) to update their own payments
    - Add policy for authenticated users (trainers) to delete their own payments
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES clients ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  payment_date timestamptz NOT NULL,
  method text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can read their own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = trainer_id);

CREATE POLICY "Trainers can create payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can update their own payments"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = trainer_id)
  WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "Trainers can delete their own payments"
  ON payments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = trainer_id);