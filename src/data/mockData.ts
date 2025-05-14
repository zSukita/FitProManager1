import { Client, Exercise, Workout, Payment, ExerciseLibrary, FinancialSummary } from '../types';
import dayjs from 'dayjs';

// Biblioteca de exercícios
export const exerciseLibrary: ExerciseLibrary = {
  'ex1': {
    id: 'ex1',
    name: 'Supino Reto',
    category: 'força',
    muscleGroup: 'peito',
    equipment: 'barra',
    difficulty: 'intermediário',
    description: 'Deite-se em um banco reto, segure a barra com as mãos um pouco mais afastadas que a largura dos ombros, e empurre a barra para cima até que os braços estejam estendidos.',
    imageUrl: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  'ex2': {
    id: 'ex2',
    name: 'Agachamento',
    category: 'força',
    muscleGroup: 'pernas',
    equipment: 'barra',
    difficulty: 'intermediário',
    description: 'Posicione a barra nos ombros, mantendo as costas retas, desça até que as coxas fiquem paralelas ao chão e então retorne à posição inicial.',
    imageUrl: 'https://images.pexels.com/photos/4162508/pexels-photo-4162508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  'ex3': {
    id: 'ex3',
    name: 'Levantamento Terra',
    category: 'força',
    muscleGroup: 'costas',
    equipment: 'barra',
    difficulty: 'avançado',
    description: 'Em pé, com a barra no chão, segure a barra com as mãos afastadas na largura dos ombros e levante a barra até ficar em posição ereta.',
    imageUrl: 'https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  'ex4': {
    id: 'ex4',
    name: 'Barra Fixa',
    category: 'força',
    muscleGroup: 'costas',
    equipment: 'barra',
    difficulty: 'intermediário',
    description: 'Segure a barra fixa com as palmas das mãos voltadas para frente e puxe o corpo para cima até que o queixo ultrapasse a barra.',
    imageUrl: 'https://images.pexels.com/photos/2294363/pexels-photo-2294363.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  'ex5': {
    id: 'ex5',
    name: 'Rosca Direta',
    category: 'força',
    muscleGroup: 'bíceps',
    equipment: 'barra',
    difficulty: 'iniciante',
    description: 'Em pé, segure a barra com as palmas das mãos voltadas para cima e levante a barra até a altura dos ombros, flexionando os cotovelos.',
    imageUrl: 'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  'ex6': {
    id: 'ex6',
    name: 'Tríceps Testa',
    category: 'força',
    muscleGroup: 'tríceps',
    equipment: 'barra',
    difficulty: 'intermediário',
    description: 'Deitado em um banco reto, segure a barra acima da cabeça, flexione os cotovelos para baixar a barra até a testa e retorne à posição inicial.',
    imageUrl: 'https://images.pexels.com/photos/4162450/pexels-photo-4162450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  'ex7': {
    id: 'ex7',
    name: 'Desenvolvimento Ombro',
    category: 'força',
    muscleGroup: 'ombros',
    equipment: 'barra',
    difficulty: 'intermediário',
    description: 'Sentado ou em pé, segure a barra à altura dos ombros e empurre-a para cima até os braços estarem estendidos.',
    imageUrl: 'https://images.pexels.com/photos/38630/bodybuilder-weight-training-stress-38630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  'ex8': {
    id: 'ex8',
    name: 'Abdominal',
    category: 'força',
    muscleGroup: 'abdômen',
    equipment: 'nenhum',
    difficulty: 'iniciante',
    description: 'Deitado de costas, com os joelhos dobrados e os pés no chão, cruze as mãos sobre o peito e eleve o tronco em direção aos joelhos.',
    imageUrl: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  'ex9': {
    id: 'ex9',
    name: 'Esteira',
    category: 'cardio',
    muscleGroup: 'total',
    equipment: 'máquina',
    difficulty: 'iniciante',
    description: 'Caminhe ou corra na esteira em uma velocidade adequada ao seu nível de condicionamento.',
    imageUrl: 'https://images.pexels.com/photos/3756042/pexels-photo-3756042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  'ex10': {
    id: 'ex10',
    name: 'Bicicleta',
    category: 'cardio',
    muscleGroup: 'pernas',
    equipment: 'máquina',
    difficulty: 'iniciante',
    description: 'Pedale na bicicleta ergométrica, ajustando a resistência conforme necessário.',
    imageUrl: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
};

// Clientes
export const clients: Client[] = [
  {
    id: 'client1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    phone: '(11) 99999-1234',
    age: 28,
    gender: 'feminino',
    goal: 'Hipertrofia e definição muscular',
    status: 'ativo',
    startDate: '2023-01-15',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    medicalHistory: 'Sem restrições médicas',
    notes: 'Prefere treinar pela manhã',
    measurements: [
      {
        date: '2023-01-15',
        weight: 65,
        height: 168,
        bodyFat: 26,
        waist: 75,
        hips: 95,
      },
      {
        date: '2023-03-15',
        weight: 63,
        height: 168,
        bodyFat: 24,
        waist: 73,
        hips: 94,
      }
    ],
    payments: [
      {
        id: 'pay1',
        clientId: 'client1',
        amount: 350,
        date: '2023-01-10',
        status: 'pago',
        method: 'pix',
        description: 'Mensalidade - Janeiro 2023',
        planType: 'mensal',
        recurrent: true,
        dueDate: '2023-01-10',
      },
      {
        id: 'pay2',
        clientId: 'client1',
        amount: 350,
        date: '2023-02-10',
        status: 'pago',
        method: 'pix',
        description: 'Mensalidade - Fevereiro 2023',
        planType: 'mensal',
        recurrent: true,
        dueDate: '2023-02-10',
      }
    ]
  },
  {
    id: 'client2',
    name: 'Pedro Santos',
    email: 'pedro@example.com',
    phone: '(11) 98888-5678',
    age: 35,
    gender: 'masculino',
    goal: 'Perda de peso e condicionamento',
    status: 'ativo',
    startDate: '2022-11-05',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    medicalHistory: 'Hipertensão controlada',
    notes: 'Disponível apenas à noite',
    measurements: [
      {
        date: '2022-11-05',
        weight: 92,
        height: 178,
        bodyFat: 28,
        waist: 98,
      },
      {
        date: '2023-01-05',
        weight: 88,
        height: 178,
        bodyFat: 26,
        waist: 95,
      }
    ],
    payments: [
      {
        id: 'pay3',
        clientId: 'client2',
        amount: 900,
        date: '2022-11-01',
        status: 'pago',
        method: 'cartão',
        description: 'Trimestral - Nov/Dez/Jan',
        planType: 'trimestral',
        recurrent: false,
        dueDate: '2022-11-01',
      }
    ]
  },
  {
    id: 'client3',
    name: 'Mariana Costa',
    email: 'mariana@example.com',
    phone: '(11) 97777-9090',
    age: 42,
    gender: 'feminino',
    goal: 'Fortalecimento e mobilidade',
    status: 'ativo',
    startDate: '2023-02-20',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    medicalHistory: 'Osteoporose leve',
    notes: 'Prefere exercícios de baixo impacto',
    measurements: [
      {
        date: '2023-02-20',
        weight: 70,
        height: 165,
        bodyFat: 30,
        waist: 82,
        hips: 100,
      }
    ],
    payments: [
      {
        id: 'pay4',
        clientId: 'client3',
        amount: 350,
        date: '2023-02-20',
        status: 'pago',
        method: 'transferência',
        description: 'Mensalidade - Fevereiro 2023',
        planType: 'mensal',
        recurrent: true,
        dueDate: '2023-02-20',
      },
      {
        id: 'pay5',
        clientId: 'client3',
        amount: 350,
        date: '',
        status: 'pendente',
        description: 'Mensalidade - Março 2023',
        planType: 'mensal',
        recurrent: true,
        dueDate: '2023-03-20',
      }
    ]
  },
  {
    id: 'client4',
    name: 'Lucas Oliveira',
    email: 'lucas@example.com',
    phone: '(11) 96666-4321',
    age: 25,
    gender: 'masculino',
    goal: 'Ganho de massa muscular',
    status: 'inativo',
    startDate: '2022-09-10',
    avatar: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    medicalHistory: 'Sem restrições',
    notes: 'Pausou por motivos pessoais',
    measurements: [
      {
        date: '2022-09-10',
        weight: 75,
        height: 182,
        bodyFat: 15,
        chest: 95,
        waist: 80,
        arms: 35,
      }
    ],
    payments: [
      {
        id: 'pay6',
        clientId: 'client4',
        amount: 350,
        date: '2022-09-10',
        status: 'pago',
        method: 'dinheiro',
        description: 'Mensalidade - Setembro 2022',
        planType: 'mensal',
        recurrent: true,
        dueDate: '2022-09-10',
      },
      {
        id: 'pay7',
        clientId: 'client4',
        amount: 350,
        date: '2022-10-10',
        status: 'pago',
        method: 'pix',
        description: 'Mensalidade - Outubro 2022',
        planType: 'mensal',
        recurrent: true,
        dueDate: '2022-10-10',
      },
      {
        id: 'pay8',
        clientId: 'client4',
        amount: 350,
        date: '',
        status: 'cancelado',
        description: 'Mensalidade - Novembro 2022',
        planType: 'mensal',
        recurrent: true,
        dueDate: '2022-11-10',
      }
    ]
  }
];

// Treinos
export const workouts: Workout[] = [
  {
    id: 'workout1',
    name: 'Treino de Força: Superiores',
    description: 'Foco em força para membros superiores',
    created: '2023-01-20',
    type: 'força',
    targetMuscleGroups: ['peito', 'costas', 'ombros', 'bíceps', 'tríceps'],
    exercises: [
      {
        exercise: exerciseLibrary['ex1'],
        sets: [
          { reps: 10, weight: 30, restTime: 60 },
          { reps: 10, weight: 40, restTime: 60 },
          { reps: 8, weight: 50, restTime: 90 }
        ]
      },
      {
        exercise: exerciseLibrary['ex4'],
        sets: [
          { reps: 8, restTime: 60 },
          { reps: 8, restTime: 60 },
          { reps: 6, restTime: 90 }
        ]
      },
      {
        exercise: exerciseLibrary['ex5'],
        sets: [
          { reps: 12, weight: 15, restTime: 60 },
          { reps: 12, weight: 15, restTime: 60 },
          { reps: 10, weight: 20, restTime: 60 }
        ]
      },
      {
        exercise: exerciseLibrary['ex6'],
        sets: [
          { reps: 12, weight: 15, restTime: 60 },
          { reps: 12, weight: 15, restTime: 60 },
          { reps: 10, weight: 20, restTime: 60 }
        ]
      },
      {
        exercise: exerciseLibrary['ex7'],
        sets: [
          { reps: 10, weight: 20, restTime: 60 },
          { reps: 10, weight: 20, restTime: 60 },
          { reps: 8, weight: 25, restTime: 60 }
        ]
      }
    ],
    notes: 'Realizar aquecimento adequado antes de iniciar',
    isTemplate: true,
    creatorId: '1',
    clientIds: ['client1', 'client2']
  },
  {
    id: 'workout2',
    name: 'Treino de Força: Inferiores',
    description: 'Foco em força para membros inferiores',
    created: '2023-01-21',
    type: 'força',
    targetMuscleGroups: ['pernas', 'glúteos', 'core'],
    exercises: [
      {
        exercise: exerciseLibrary['ex2'],
        sets: [
          { reps: 12, weight: 40, restTime: 90 },
          { reps: 10, weight: 50, restTime: 90 },
          { reps: 8, weight: 60, restTime: 120 }
        ]
      },
      {
        exercise: exerciseLibrary['ex3'],
        sets: [
          { reps: 10, weight: 50, restTime: 90 },
          { reps: 8, weight: 60, restTime: 90 },
          { reps: 6, weight: 70, restTime: 120 }
        ]
      },
      {
        exercise: exerciseLibrary['ex8'],
        sets: [
          { reps: 15, restTime: 60 },
          { reps: 15, restTime: 60 },
          { reps: 15, restTime: 60 }
        ]
      }
    ],
    notes: 'Manter a técnica correta em todos os exercícios',
    isTemplate: true,
    creatorId: '1',
    clientIds: ['client1', 'client3']
  },
  {
    id: 'workout3',
    name: 'Treino de Cardio',
    description: 'Foco em resistência cardiovascular',
    created: '2023-01-22',
    type: 'cardio',
    targetMuscleGroups: ['total'],
    exercises: [
      {
        exercise: exerciseLibrary['ex9'],
        sets: [
          { reps: '20 min', time: 1200, restTime: 60 }
        ]
      },
      {
        exercise: exerciseLibrary['ex10'],
        sets: [
          { reps: '20 min', time: 1200, restTime: 60 }
        ]
      }
    ],
    notes: 'Ajustar intensidade de acordo com o nível de condicionamento',
    isTemplate: true,
    creatorId: '1',
    clientIds: ['client2', 'client3']
  }
];

// Resumo financeiro
export const financialSummary: FinancialSummary = {
  totalRevenue: 3000,
  pendingRevenue: 350,
  paidToday: 0,
  dueToday: 0,
  monthlyRevenue: [2000, 2350, 3000, 2800, 3200, 3000],
  paymentsByStatus: {
    pago: 2650,
    pendente: 350,
    atrasado: 0,
    cancelado: 350
  }
};

// Gera datas dos últimos 6 meses
export const last6Months = Array.from({ length: 6 }).map((_, i) => {
  const date = dayjs().subtract(5 - i, 'month');
  return date.format('MMM/YY');
});

// Gera dados para o gráfico de clientes ativos
export const clientsCountByMonth = [10, 12, 15, 18, 20, 22];
