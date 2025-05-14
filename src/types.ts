// Tipos de autenticação
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'trainer' | 'admin';
  avatar?: string;
  plan: 'iniciante' | 'profissional' | 'estudio';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Tipos para clientes
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'masculino' | 'feminino' | 'outro';
  goal: string;
  status: 'ativo' | 'inativo' | 'pendente';
  startDate: string;
  avatar?: string;
  medicalHistory?: string;
  notes?: string;
  measurements?: ClientMeasurements[];
  workouts?: string[]; // IDs dos treinos
  payments?: Payment[];
}

export interface ClientMeasurements {
  date: string;
  weight: number;
  height: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
}

// Tipos para treinos
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  difficulty: 'iniciante' | 'intermediário' | 'avançado';
  description: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface ExerciseSet {
  reps: number | string;
  weight?: number;
  time?: number; // em segundos
  restTime: number; // em segundos
  notes?: string;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  created: string;
  type: 'força' | 'hipertrofia' | 'resistência' | 'cardio' | 'flexibilidade' | 'personalizado';
  targetMuscleGroups: MuscleGroup[];
  exercises: WorkoutExercise[];
  notes?: string;
  isTemplate?: boolean;
  creatorId: string;
  clientIds?: string[]; // IDs dos clientes que usam este treino
}

export type ExerciseCategory = 
  | 'força' 
  | 'cardio' 
  | 'flexibilidade' 
  | 'equilíbrio' 
  | 'funcional';

export type MuscleGroup = 
  | 'peito' 
  | 'costas' 
  | 'ombros' 
  | 'bíceps' 
  | 'tríceps' 
  | 'pernas' 
  | 'glúteos' 
  | 'abdômen' 
  | 'core' 
  | 'total';

export type Equipment = 
  | 'nenhum' 
  | 'halteres' 
  | 'barra' 
  | 'máquina' 
  | 'kettlebell' 
  | 'elástico' 
  | 'corda' 
  | 'banco' 
  | 'bola' 
  | 'outro';

export interface ExerciseLibrary {
  [id: string]: Exercise;
}

// Tipos para finanças
export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  date: string;
  status: 'pago' | 'pendente' | 'atrasado' | 'cancelado';
  method?: 'dinheiro' | 'cartão' | 'pix' | 'transferência' | 'outro';
  description?: string;
  planType?: 'mensal' | 'trimestral' | 'semestral' | 'anual' | 'sessão';
  recurrent: boolean;
  dueDate?: string;
}

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
