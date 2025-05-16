import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, DollarSign, Dumbbell, Plus } from 'lucide-react'; // Importando ícones necessários
import { fetchMonthlyRevenue, fetchMonthlyClients, getCurrentUser } from '../services/supabaseService';
import { MonthlyRevenueData, MonthlyClientsData } from '../types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


// Dados mockados para os cards de resumo (manter por enquanto, substituir com dados reais depois)
const summaryData = {
  totalClients: 5,
  estimatedRevenue: 15000.00,
  pendingRevenue: 750.00,
  registeredWorkouts: 3,
};

// Dados mockados para clientes recentes (manter por enquanto, substituir com dados reais depois)
const recentClients = [
  { id: 1, name: 'Ana Silva', goal: 'Perda de peso', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 2, name: 'Bruno Costa', goal: 'Hipertrofia', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 3, name: 'Mariana Santos', goal: 'Resistência', avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 4, name: 'Pedro Almeida', goal: 'Saúde geral', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { id: 5, name: 'Sofia Fernandes', goal: 'Tonificação', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
];

// Dados mockados para pagamentos pendentes/atrasados (manter por enquanto, substituir com dados reais depois)
const pendingPayments = [
  { id: 1, clientName: 'Mariana Santos', amount: 300.00, status: 'Pendente' },
  { id: 2, clientName: 'Pedro Almeida', amount: 380.00, status: 'Atrasado' },
];

const Dashboard: React.FC = () => {
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueData[]>([]);
  const [monthlyClients, setMonthlyClients] = useState<MonthlyClientsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trainerId, setTrainerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getCurrentUser();
      if (user) {
        setTrainerId(user.id);
      } else {
        setError("Usuário não autenticado.");
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!trainerId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const revenueData = await fetchMonthlyRevenue(trainerId);
        setMonthlyRevenue(revenueData);

        const clientsData = await fetchMonthlyClients(trainerId);
        setMonthlyClients(clientsData);

      } catch (err) {
        console.error("Erro ao buscar dados para gráficos:", err);
        setError("Erro ao carregar dados dos gráficos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trainerId]); // Refetch when trainerId is available or changes

  // Data structure for Revenue Chart
  const revenueChartData = {
    labels: monthlyRevenue.map(data => data.month),
    datasets: [
      {
        label: 'Receita Mensal (R$)',
        data: monthlyRevenue.map(data => data.total),
        borderColor: 'rgb(139, 92, 246)', // Purple color
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Data structure for Clients Chart
  const clientsChartData = {
    labels: monthlyClients.map(data => data.month),
    datasets: [
      {
        label: 'Novos Clientes por Mês',
        data: monthlyClients.map(data => data.count),
        borderColor: 'rgb(34, 197, 94)', // Green color
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Options for the charts
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow height to be controlled by container
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false, // Title is already in the card header
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Olá, Lucas Silva!</h1>
        {/* Placeholder for search/notifications/user icon */}
        {/* <div className="flex items-center gap-4">
          <Search size={20} className="text-gray-500" />
          <Bell size={20} className="text-gray-500" />
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Clients */}
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total de Clientes</h3>
            <p className="text-2xl font-semibold text-gray-900">{summaryData.totalClients}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Users size={24} className="text-green-600" />
          </div>
        </div>

        {/* Estimated Revenue */}
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Receita Total (Estimada)</h3>
            <p className="text-2xl font-semibold text-gray-900">R$ {summaryData.estimatedRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <DollarSign size={24} className="text-purple-600" />
          </div>
        </div>

        {/* Pending Revenue */}
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Receita Pendente</h3>
            <p className="text-2xl font-semibold text-gray-900">R$ {summaryData.pendingRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded-full">
            <DollarSign size={24} className="text-yellow-600" />
          </div>
        </div>

        {/* Registered Workouts */}
        <div className="bg-white p-5 rounded-lg shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Treinos Cadastrados</h3>
            <p className="text-2xl font-semibold text-gray-900">{summaryData.registeredWorkouts}</p>
          </div>
          <div className="bg-pink-100 p-3 rounded-full">
            <Dumbbell size={24} className="text-pink-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="flex gap-8">
          {/* Gerenciar Clientes */}
          <Link to="/dashboard/clients" className="flex flex-col items-center text-center text-gray-700 hover:text-purple-600 transition-colors">
            <div className="bg-gray-200 p-3 rounded-full mb-2">
              <Users size={24} />
            </div>
            <span className="text-sm">Gerenciar Clientes</span>
          </Link>
          {/* Novo Treino */}
          <Link to="/dashboard/workouts/new" className="flex flex-col items-center text-center text-gray-700 hover:text-purple-600 transition-colors">
            <div className="bg-gray-200 p-3 rounded-full mb-2">
              <Plus size={24} />
            </div>
            <span className="text-sm">Novo Treino</span>
          </Link>
           {/* Ver Finanças */}
           <Link to="/dashboard/finances" className="flex flex-col items-center text-center text-gray-700 hover:text-purple-600 transition-colors">
            <div className="bg-gray-200 p-3 rounded-full mb-2">
              <DollarSign size={24} />
            </div>
            <span className="text-sm">Ver Finanças</span>
          </Link>
        </div>
      </div>

      {/* Charts and Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Receita Mensal Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Receita Mensal (Últimos 6 meses)</h2>
          <div className="w-full h-48"> {/* Container for the chart */}
            {loading && <div className="flex items-center justify-center h-full text-gray-500">Carregando gráfico de receita...</div>}
            {error && <div className="flex items-center justify-center h-full text-red-500">Erro: {error}</div>}
            {!loading && !error && monthlyRevenue.length > 0 && (
              <Line data={revenueChartData} options={chartOptions} />
            )}
             {!loading && !error && monthlyRevenue.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500">Sem dados de receita nos últimos 6 meses.</div>
            )}
          </div>
          <Link to="/dashboard/finances" className="text-sm text-purple-600 hover:underline mt-4 block text-center">
            &larr; Ver Finanças
          </Link>
        </div>

        {/* Clientes por Mês Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clientes por Mês (Últimos 6 meses)</h2>
           <div className="w-full h-48"> {/* Container for the chart */}
            {loading && <div className="flex items-center justify-center h-full text-gray-500">Carregando gráfico de clientes...</div>}
            {error && <div className="flex items-center justify-center h-full text-red-500">Erro: {error}</div>}
            {!loading && !error && monthlyClients.length > 0 && (
               <Line data={clientsChartData} options={chartOptions} />
            )}
             {!loading && !error && monthlyClients.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-500">Sem dados de novos clientes nos últimos 6 meses.</div>
            )}
          </div>
          <Link to="/dashboard/clients" className="text-sm text-purple-600 hover:underline mt-4 block text-center">
            &larr; Ver Clientes
          </Link>
        </div>
      </div>

      {/* Recent Clients and Pending Payments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clientes Recentes */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clientes Recentes</h2>
          <ul>
            {recentClients.map((client) => (
              <li key={client.id} className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-200">
                <div className="flex items-center gap-3">
                  <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <span className="text-gray-800 font-medium">{client.name}</span>
                    <p className="text-sm text-gray-500">{client.goal}</p>
                  </div>
                </div>
                <Link to={`/dashboard/clients/${client.id}`} className="text-sm text-green-600 hover:underline">
                  Ver Perfil
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Pagamentos Pendentes/Atrasados */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pagamentos Pendentes/Atrasados</h2>
          <ul>
            {pendingPayments.map((payment) => (
              <li key={payment.id} className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-200">
                <div>
                  <span className="text-gray-800 font-medium">{payment.clientName}</span>
                  <p className={`text-sm ${payment.status === 'Atrasado' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {payment.status}: R$ {payment.amount.toFixed(2)}
                  </p>
                </div>
                <Link to="/dashboard/finances" className="text-sm text-green-600 hover:underline">
                  Ver Finanças
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
