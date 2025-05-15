import { supabase } from '../lib/supabase';
import { Client, Payment, Workout } from '../types';
import { User } from '@supabase/supabase-js';

// --- Client Service ---

export const fetchClients = async (trainerId: string): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('trainer_id', trainerId);

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
  return data as Client[];
};

export const createClient = async (clientData: Omit<Client, 'id' | 'trainer_id' | 'created_at' | 'updated_at'>, trainerId: string): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert({ ...clientData, trainer_id: trainerId })
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    throw error;
  }
  return data as Client;
};

// --- Workout Service ---

export const fetchWorkouts = async (trainerId: string): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('trainer_id', trainerId);

  if (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
  return data as Workout[];
};

export const createWorkout = async (workoutData: Omit<Workout, 'id' | 'trainer_id' | 'created_at' | 'updated_at'>, trainerId: string): Promise<Workout> => {
  const { data, error } = await supabase
    .from('workouts')
    .insert({ ...workoutData, trainer_id: trainerId })
    .select()
    .single();

  if (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
  return data as Workout;
};

// --- Payment Service ---

export const fetchPayments = async (trainerId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('trainer_id', trainerId);

  if (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
  return data as Payment[];
};

export const createPayment = async (paymentData: Omit<Payment, 'id' | 'trainer_id' | 'created_at' | 'updated_at'>, trainerId: string): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .insert({ ...paymentData, trainer_id: trainerId })
    .select()
    .single();

  if (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
  return data as Payment;
};

// --- Auth Service (Basic) ---
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return user;
};
