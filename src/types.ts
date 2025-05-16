export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
  }

  export interface Payment {
    id: string;
    client_id: string;
    amount: number;
    payment_date: string;
    payment_method: string;
    status: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
    client_name?: string;
  }

  export interface Workout {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    trainer_id: string;
  }

  export interface Exercise {
    id: string;
    name: string;
    description: string;
    muscle_group: string;
    equipment: string;
    difficulty: string;
    created_at: string;
    created_by: string;
  }

  export interface Profile {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    role: string;
    created_at: string;
    updated_at: string;
  }

  export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
  }

  export interface MonthlyData {
    month: string;
    count: number;
  }

  export interface RevenueData {
    month: string;
    total: number;
  }
