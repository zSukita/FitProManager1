export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  planId?: string;
}

export interface Profile {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  email?: string;
}

// Updated Exercise interface to match Supabase schema
export interface Exercise {
  id: string;
  created_at: string;
  name: string;
  description?: string;
  category: string; // e.g., 'força', 'cardio'
  muscle_group: string; // e.g., 'peito', 'pernas'
  equipment: string; // e.g., 'barra', 'halteres', 'nenhum'
  difficulty: string; // e.g., 'iniciante', 'intermediário'
  video_url?: string;
  image_url?: string;
  created_by?: string; // UUID of the user who created it (optional)
}

export interface ExerciseSet {
  reps: number;
  weight: number;
  restTime: number; // in seconds
}

export interface WorkoutExercise {
  exercise: Exercise; // Use the updated Exercise type
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  trainer_id: string;
  name: string;
  description?: string;
  type: string;
  notes?: string;
  target_muscle_groups: string[];
  exercises: WorkoutExercise[];
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  trainer_id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  goals?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  trainer_id: string;
  client_id: string;
  amount: number;
  payment_date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// ExerciseLibrary type is no longer needed as we fetch from DB
// export interface ExerciseLibrary {
//   [key: string]: Exercise;
// }

// Mock data types (keep if still using mock data elsewhere)
export interface FinancialSummary {
  totalRevenue: number;
  pendingRevenue: number;
  paidToday: number;
  dueToday: number;
  monthlyRevenue: number[];
  paymentsByStatus: {
    pago: number;
    pendente: number;
    atrasado: number;
    cancelado: number;
  };
}

export interface Measurement {
  date: string;
  weight?: number;
  height?: number;
  bodyFat?: number;
  waist?: number;
  chest?: number;
  // Add other measurements as needed
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  gender?: 'masculino' | 'feminino' | 'outro';
  goal?: string;
  status?: 'ativo' | 'inativo' | 'pendente';
  startDate?: string;
  avatar?: string;
  medicalHistory?: string;
  notes?: string;
  measurements?: Measurement[];
  workouts?: string[]; // IDs of workouts assigned
  payments?: Payment[]; // Simplified payment info
  planId?: string; // ID of the plan
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  frequency: 'mensal' | 'trimestral' | 'anual' | 'sessao_unica' | 'vitalicio';
  features: string[];
  clientLimit: number | 'ilimitado';
  isDefault?: boolean;
  sessionsPerPeriod?: number; // For session-based plans
  durationInMonths?: number; // For fixed-duration plans
}
