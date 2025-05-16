import { supabase } from '../lib/supabase';
import { Client, Payment, Workout, Exercise } from '../types'; // Import Exercise
import { User } from '@supabase/supabase-js';
import { Profile } from '../types';
import dayjs from 'dayjs'; // Import dayjs

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

// Adicionando a função deleteClient e exportando-a
export const deleteClient = async (clientId: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

// Função para buscar contagem de clientes por mês nos últimos 6 meses
export const fetchMonthlyClients = async (trainerId: string): Promise<{ month: string; count: number }[]> => {
  const sixMonthsAgo = dayjs().subtract(6, 'month').startOf('month').toISOString();

  const { data, error } = await supabase
    .from('clients')
    .select('created_at')
    .eq('trainer_id', trainerId)
    .gte('created_at', sixMonthsAgo); // Filter for the last 6 months

  if (error) {
    console.error('Error fetching monthly clients:', error);
    throw error;
  }

  // Aggregate data by month
  const monthlyData: { [key: string]: number } = {};
  data.forEach(client => {
    const month = dayjs(client.created_at).format('YYYY-MM'); // Format as YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  // Prepare data for the last 6 months, including months with no clients
  const result = [];
  let currentMonth = dayjs().subtract(5, 'month').startOf('month'); // Start 5 months ago to include current month + 5 previous
  for (let i = 0; i < 6; i++) {
    const monthKey = currentMonth.format('YYYY-MM');
    result.push({
      month: currentMonth.format('MMM/YY'), // Format for display (e.g., Jan/24)
      count: monthlyData[monthKey] || 0,
    });
    currentMonth = currentMonth.add(1, 'month');
  }

  return result;
};


// --- Workout Service ---

export const fetchWorkouts = async (trainerId: string): Promise<Workout[]> => {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false }); // Order by creation date

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

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId);

  if (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};


// --- Payment Service ---

// Modified fetchPayments to include client name
export const fetchPayments = async (trainerId: string): Promise<Payment[]> => {
  // Select payment fields and join 'clients' table to get the client's name
  const { data, error } = await supabase
    .from('payments')
    .select('*, clients(name)') // Select all payment fields and the 'name' from the related client
    .eq('trainer_id', trainerId);

  if (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }

  // Map the data to transform the nested client object into a client_name property
  const paymentsWithClientName: Payment[] = data.map((payment: any) => ({
    ...payment,
    client_name: payment.clients ? payment.clients.name : 'Cliente Desconhecido', // Extract client name
    // Ensure client_id is still present if needed elsewhere, though the select might replace it
    // If 'clients' is null, it means the client was not found or the relationship is broken
  }));

  return paymentsWithClientName;
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

// Função para buscar receita mensal nos últimos 6 meses
export const fetchMonthlyRevenue = async (trainerId: string): Promise<{ month: string; total: number }[]> => {
  const sixMonthsAgo = dayjs().subtract(6, 'month').startOf('month').toISOString();

  const { data, error } = await supabase
    .from('payments')
    .select('payment_date, amount')
    .eq('trainer_id', trainerId)
    .gte('payment_date', sixMonthsAgo); // Filter for the last 6 months

  if (error) {
    console.error('Error fetching monthly revenue:', error);
    throw error;
  }

  // Aggregate data by month
  const monthlyData: { [key: string]: number } = {};
  data.forEach(payment => {
    const month = dayjs(payment.payment_date).format('YYYY-MM'); // Format as YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + payment.amount;
  });

  // Prepare data for the last 6 months, including months with no revenue
  const result = [];
  let currentMonth = dayjs().subtract(5, 'month').startOf('month'); // Start 5 months ago to include current month + 5 previous
  for (let i = 0; i < 6; i++) {
    const monthKey = currentMonth.format('YYYY-MM');
    result.push({
      month: currentMonth.format('MMM/YY'), // Format for display (e.g., Jan/24)
      total: monthlyData[monthKey] || 0,
    });
    currentMonth = currentMonth.add(1, 'month');
  }

  return result;
};


// --- Exercise Service ---

export const fetchExercises = async (): Promise<Exercise[]> => {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name', { ascending: true }); // Order alphabetically

  if (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
  return data as Exercise[];
};

export const createExercise = async (exerciseData: Omit<Exercise, 'id' | 'created_at' | 'created_by'>, userId: string): Promise<Exercise> => {
  const { data, error } = await supabase
    .from('exercises')
    .insert({ ...exerciseData, created_by: userId })
    .select()
    .single();

  if (error) {
    console.error('Error creating exercise:', error);
    throw error;
  }
  return data as Exercise;
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

export const updateUserProfile = async (userId: string, profileData: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data as Profile;
};
