import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Dumbbell, CreditCard, CalendarCheck, TrendingUp, Bell } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { clients, financialSummary, last6Months, clientsCountByMonth } from '../data/mockData';

// Registra componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  // Estatísticas gerais
  const activeClients = clients.filter(client => client.status === 'ativo').length;
  const totalClients = clients.length;
  const pendingPayments = clients.flatMap(client => client.payments || [])
    .filter(payment => payment.status === 'pendente').length;

  // Configuração do gráfico de receita mensal
  const revenueChartData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Receita Mensal (R$)',
        data: financialSummary.monthlyRevenue,
        fill: false,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        tension: 0.4,
      },
    ],
  };

  // Configuração do gráfico de clientes ativos
  const clientsChartData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Clientes Ativos',
        data: clientsCountByMonth,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderRadius: 6,
      },
    ],
  };

  // Configuração do gráfico de status de pagamentos
  const paymentStatusChartData = {
    labels: ['Pago', 'Pendente', 'Atrasado', 'Cancelado'],
    datasets: [
      {
        data: [
          financialSummary.paymentsByStatus.pago,
          financialSummary.paymentsByStatus.pendente,
          financialSummary.paymentsByStatus.atrasado,
          financialSummary.paymentsByStatus.cancelado,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(249, 115, 22, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(107, 114, 128, 0.6)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao seu painel de gerenciamento</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card hover:border-primary hover:border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Clientes Ativos</h3>
              <p className="text-2xl font-bold">{activeClients}/{totalClients}</p>
            </div>
          </div>
          <div className="mt-4">
            {/* Link corrigido para /clients */}
            <Link to="/clients" className="text-sm text-primary font-medium hover:underline">
              Ver todos os clientes
            </Link>
          </div>
        </div>

        <div className="card hover:border-secondary hover:border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-secondary/10">
              <Dumbbell className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Treinos Atribuídos</h3>
              <p className="text-2xl font-bold">8/12</p>
            </div>
          </div>
          <div className="mt-4">
            {/* Link corrigido para /workouts */}
            <Link to="/workouts" className="text-sm text-secondary font-medium hover:underline">
              Gerenciar treinos
            </Link>
          </div>
        </div>

        <div className="card hover:border-accent hover:border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-accent/10">
              <CreditCard className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Receita Mensal</h3>
              <p className="text-2xl font-bold">
                R$ {financialSummary.monthlyRevenue[5].toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="mt-4">
            {/* Link corrigido para /finances */}
            <Link to="/finances" className="text-sm text-accent font-medium hover:underline">
              Ver relatório financeiro
            </Link>
          </div>
        </div>

        <div className="card hover:border-pink-500 hover:border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-pink-100">
              <CalendarCheck className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Pagamentos Pendentes</h3>
              <p className="text-2xl font-bold">{pendingPayments}</p>
            </div>
          </div>
          <div className="mt-4">
            {/* Link corrigido para /finances */}
            <Link to="/finances" className="text-sm text-pink-500 font-medium hover:underline">
              Ver pagamentos
            </Link>
          </div>
        </div>
      </div>

      {/* Gráficos e listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de receita */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Receita Mensal
            </h3>
          </div>
          <div className="h-64">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Gráfico de status de pagamentos */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-accent" />
              Status de Pagamentos
            </h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={paymentStatusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de clientes ativos */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-secondary" />
              Crescimento de Clientes
            </h3>
          </div>
          <div className="h-64">
            <Bar
              data={clientsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Notificações */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="h-5 w-5 text-pink-500" />
              Notificações Recentes
            </h3>
            {/* Link de exemplo, pode ser ajustado conforme necessário */}
            <a href="#" className="text-xs text-primary font-medium hover:underline">
              Ver todas
            </a>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg bg-orange-50">
              <div className="p-2 rounded-full bg-accent/10">
                <CreditCard className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Pagamento Pendente</h4>
                <p className="text-sm text-gray-600">
                  Mariana Costa tem um pagamento pendente de R$ 350,00 com vencimento hoje.
                </p>
                <span className="text-xs text-gray-500">Hoje, 09:45</span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg bg-blue-50">
              <div className="p-2 rounded-full bg-secondary/10">
                <CalendarCheck className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Sessão de Treino</h4>
                <p className="text-sm text-gray-600">
                  Pedro Santos tem uma sessão agendada para hoje às 18:00.
                </p>
                <span className="text-xs text-gray-500">Hoje, 08:30</span>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg bg-green-50">
              <div className="p-2 rounded-full bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Novo Objetivo Alcançado</h4>
                <p className="text-sm text-gray-600">
                  Ana Silva atingiu 90% do seu objetivo de perda de peso. Parabéns!
                </p>
                <span className="text-xs text-gray-500">Ontem, 16:20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
