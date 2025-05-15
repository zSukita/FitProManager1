import { Client, FinancialSummary, Exercise, Workout, Payment, Plan } from '../types';

// Dados mock para clientes
export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    phone: '11 98765-4321',
    age: 28,
    gender: 'feminino',
    goal: 'Perda de peso',
    status: 'ativo',
    startDate: '2023-01-15',
    avatar: 'https://images.pexels.com/photos/4164847/pexels-photo-4164847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    medicalHistory: 'Sem histórico relevante',
    notes: 'Gosta de treinos ao ar livre.',
    measurements: [
      { date: '2023-01-15', weight: 70, height: 1.65, bodyFat: 30, waist: 80 },
      { date: '2023-02-15', weight: 68, height: 1.65, bodyFat: 28, waist: 78 },
      { date: '2023-03-15', weight: 67, height: 1.65, bodyFat: 27, waist: 77 },
    ],
    workouts: ['workout-1'],
    payments: [
      { id: 'pay-1', clientId: 'client-1', amount: 350, date: '2023-01-10', status: 'pago', recurrent: true, planType: 'mensal' },
      { id: 'pay-2', clientId: 'client-1', amount: 350, date: '2023-02-10', status: 'pago', recurrent: true, planType: 'mensal' },
      { id: 'pay-3', clientId: 'client-1', amount: 350, date: '2023-03-10', status: 'pago', recurrent: true, planType: 'mensal' },
    ],
    planId: 'profissional' // Associado ao plano Profissional
  },
  {
    id: 'client-2',
    name: 'Bruno Costa',
    email: 'bruno.costa@example.com',
    phone: '11 99876-5432',
    age: 35,
    gender: 'masculino',
    goal: 'Hipertrofia',
    status: 'ativo',
    startDate: '2023-02-01',
    avatar: 'https://images.pexels.com/photos/1516440/pexels-photo-1516440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    medicalHistory: 'Dor lombar ocasional.',
    notes: 'Prefere treinar pela manhã.',
    measurements: [
      { date: '2023-02-01', weight: 80, height: 1.78, bodyFat: 18, chest: 100 },
      { date: '2023-03-01', weight: 81, height: 1.78, bodyFat: 17, chest: 101 },
    ],
    workouts: ['workout-2'],
    payments: [
      { id: 'pay-4', clientId: 'client-2', amount: 400, date: '2023-01-28', status: 'pago', recurrent: true, planType: 'mensal' },
      { id: 'pay-5', clientId: 'client-2', amount: 400, date: '2023-02-28', status: 'pago', recurrent: true, planType: 'mensal' },
    ],
    planId: 'profissional' // Associado ao plano Profissional
  },
  {
    id: 'client-3',
    name: 'Mariana Santos',
    email: 'mariana.santos@example.com',
    phone: '11 97654-3210',
    age: 22,
    gender: 'feminino',
    goal: 'Resistência',
    status: 'pendente',
    startDate: '2023-03-10',
    avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    medicalHistory: '',
    notes: 'Interesse em corrida.',
    measurements: [],
    workouts: [],
    payments: [
      { id: 'pay-6', clientId: 'client-3', amount: 300, date: '2023-03-08', status: 'pendente', recurrent: false, planType: 'sessão', dueDate: '2023-03-10' },
    ],
    planId: 'sessao_unica' // Associado ao plano Sessão Única
  },
   {
    id: 'client-4',
    name: 'Pedro Almeida',
    email: 'pedro.almeida@example.com',
    phone: '11 96543-2109',
    age: 45,
    gender: 'masculino',
    goal: 'Saúde geral',
    status: 'ativo',
    startDate: '2022-11-20',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    medicalHistory: 'Hipertensão controlada.',
    notes: 'Precisa de acompanhamento constante.',
    measurements: [],
    workouts: ['workout-3'],
    payments: [
      { id: 'pay-7', clientId: 'client-4', amount: 380, date: '2023-01-18', status: 'pago', recurrent: true, planType: 'mensal' },
      { id: 'pay-8', clientId: 'client-4', amount: 380, date: '2023-02-18', status: 'pago', recurrent: true, planType: 'mensal' },
      { id: 'pay-9', clientId: 'client-4', amount: 380, date: '2023-03-18', status: 'atrasado', recurrent: true, planType: 'mensal', dueDate: '2023-03-18' },
    ],
    planId: 'profissional' // Associado ao plano Profissional
  },
   {
    id: 'client-5',
    name: 'Sofia Fernandes',
    email: 'sofia.fernandes@example.com',
    phone: '11 95432-1098',
    age: 31,
    gender: 'feminino',
    goal: 'Tonificação',
    status: 'ativo',
    startDate: '2023-01-05',
    avatar: 'https://images.pexels.com/photos/3772818/pexels-photo-3772818.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    medicalHistory: '',
    notes: 'Gosta de variar os exercícios.',
    measurements: [],
    workouts: ['workout-1', 'workout-2'],
    payments: [
      { id: 'pay-10', clientId: 'client-5', amount: 350, date: '2023-01-01', status: 'pago', recurrent: true, planType: 'mensal' },
      { id: 'pay-11', clientId: 'client-5', amount: 350, date: '2023-02-01', status: 'pago', recurrent: true, planType: 'mensal' },
      { id: 'pay-12', clientId: 'client-5', amount: 350, date: '2023-03-01', status: 'pago', recurrent: true, planType: 'mensal' },
    ],
    planId: 'profissional' // Associado ao plano Profissional
  },
];

// Dados mock para finanças
export const financialSummary: FinancialSummary = {
  totalRevenue: 15000, // Exemplo
  pendingRevenue: 750, // Exemplo
  paidToday: 0, // Exemplo
  dueToday: 350, // Exemplo (Mariana Costa)
  monthlyRevenue: [2000, 2500, 3000, 3500, 4000, 4500], // Exemplo para 6 meses
  paymentsByStatus: {
    pago: 10, // Exemplo
    pendente: 1, // Exemplo (Mariana Costa)
    atrasado: 1, // Exemplo (Pedro Almeida)
    cancelado: 0, // Exemplo
  },
};

// Dados mock para treinos (simplificado)
export const workouts: Workout[] = [
  {
    id: 'workout-1',
    name: 'Treino Full Body Iniciante',
    description: 'Um treino completo para iniciantes.',
    created: '2023-01-10',
    type: 'força',
    targetMuscleGroups: ['total'],
    exercises: [], // Adicionar exercícios reais depois
    creatorId: 'trainer-1',
    clientIds: ['client-1', 'client-5'],
  },
  {
    id: 'workout-2',
    name: 'Treino de Peito e Tríceps',
    description: 'Foco em hipertrofia para peito e tríceps.',
    created: '2023-02-05',
    type: 'hipertrofia',
    targetMuscleGroups: ['peito', 'tríceps'],
    exercises: [], // Adicionar exercícios reais depois
    creatorId: 'trainer-1',
    clientIds: ['client-2', 'client-5'],
  },
   {
    id: 'workout-3',
    name: 'Treino de Mobilidade e Core',
    description: 'Melhora da mobilidade e fortalecimento do core.',
    created: '2022-11-15',
    type: 'flexibilidade',
    targetMuscleGroups: ['core'],
    exercises: [], // Adicionar exercícios reais depois
    creatorId: 'trainer-1',
    clientIds: ['client-4'],
  },
];

// Dados mock para meses (últimos 6 meses)
const today = new Date();
export const last6Months = Array.from({ length: 6 }).map((_, i) => {
  const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
  return date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
}).reverse(); // Para ter do mais antigo para o mais recente

// Dados mock para contagem de clientes por mês (exemplo)
export const clientsCountByMonth = [10, 12, 15, 18, 20, 22]; // Exemplo para 6 meses

// Dados mock para a biblioteca de exercícios (REMOVIDO - AGORA VEM DO SUPABASE)
export const exerciseLibrary: Exercise[] = []; // Empty array as exercises are fetched from Supabase


// Dados mock para planos (Detalhado)
export const plans: Plan[] = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    price: 0,
    frequency: 'vitalicio',
    features: [
      'Até 5 clientes',
      'Criação de treinos básicos',
      'Acompanhamento de medidas',
      'Suporte por email'
    ],
    clientLimit: 5,
    isDefault: true,
  },
  {
    id: 'profissional',
    name: 'Profissional',
    price: 99.90,
    frequency: 'mensal',
    features: [
      'Até 50 clientes',
      'Criação ilimitada de treinos',
      'Biblioteca de exercícios',
      'Acompanhamento financeiro',
      'Suporte prioritário'
    ],
    clientLimit: 50,
  },
  {
    id: 'estudio',
    name: 'Estúdio',
    price: 249.90,
    frequency: 'mensal',
    features: [
      'Clientes ilimitados',
      'Múltiplos usuários (equipe)',
      'Recursos avançados de finanças',
      'Personalização da marca',
      'Suporte dedicado'
    ],
    clientLimit: 'ilimitado',
  },
   {
    id: 'sessao_unica',
    name: 'Sessão Única',
    price: 80.00,
    frequency: 'sessao_unica',
    features: [
      '1 sessão de treino',
      'Avaliação inicial',
      'Plano de treino para a sessão'
    ],
    clientLimit: 1, // Limite técnico para este tipo de plano
    sessionsPerPeriod: 1,
  },
   {
    id: 'trimestral',
    name: 'Trimestral',
    price: 270.00, // Exemplo: desconto
    frequency: 'trimestral',
    features: [
      'Todos os recursos do plano Profissional',
      'Pagamento a cada 3 meses',
      'Desconto aplicado'
    ],
    clientLimit: 50,
    durationInMonths: 3,
  },
];
