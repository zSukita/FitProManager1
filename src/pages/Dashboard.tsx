import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clients, financialSummary, workouts, last6Months, clientsCountByMonth } from '../data/mockData';
import { Dumbbell, Users, DollarSign, BarChart2, PlusCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Dados para o gráfico de receita mensal
  const revenueData = last6Months.map((month, index) => ({
    name: month,
    Receita: financialSummary.monthlyRevenue[index] || 0,
  }));

  // Dados para o gráfico de clientes por mês
  const clientsData = last6Months.map((month, index) => ({
    name: month,
    Clientes: clientsCountByMonth[index] || 0,
  }));

  // Contagem de clientes por status
  const clientStatusData = Object.entries(financialSummary.paymentsByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    Quantidade: count,
  }));


  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Olá, {user?.name || 'Usuário'}!</h1>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="icon-box bg-primary/10 text-primary">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Receita Total (Estimada)</p>
              <p className="text-2xl font-bold text-gray-900">R$ {financialSummary.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="icon-box bg-green-100 text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Receita Pendente</p>
              <p className="text-2xl font-bold text-gray-900">R$ {financialSummary.pendingRevenue.toFixed(2)}</p>
            </div>
            <div className="icon-box bg-yellow-100 text-yellow-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Treinos Cadastrados</p>
              <p className="text-2xl font-bold text-gray-900">{workouts.length}</p>
            </div>
            <div className="icon-box bg-purple-100 text-purple-600">
              <Dumbbell size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/clients" className="quick-action-card">
            <Users size={24} />
            <span>Gerenciar Clientes</span>
          </Link>
          {/* CORRIGIDO: Link para a página de criação de treino */}
          <Link to="/workouts/new" className="quick-action-card">
            <PlusCircle size={24} />
            <span>Novo Treino</span>
          </Link>
          <Link to="/finances" className="quick-action-card">
            <DollarSign size={24} />
            <span>Ver Finanças</span>
          </Link>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Receita Mensal (Últimos 6 meses)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Receita" stroke="#6366F1" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Clientes por Mês (Últimos 6 meses)</h2>
           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Clientes" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Clientes Recentes / Pagamentos Pendentes (Exemplo de outras seções) */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="card">
           <h2 className="text-lg font-semibold mb-4">Clientes Recentes</h2>
           {/* Lista de clientes recentes */}
           <ul className="divide-y divide-gray-200">
             {clients.slice(0, 5).map(client => (
               <li key={client.id} className="py-3 flex items-center justify-between">
                 <div className="flex items-center">
                   <img className="h-8 w-8 rounded-full object-cover mr-3" src={client.avatar} alt={client.name} />
                   <div>
                     <p className="text-sm font-medium text-gray-900">{client.name}</p>
                     <p className="text-xs text-gray-500">{client.goal}</p>
                   </div>
                 </div>
                 <Link to={`/clients/${client.id}`} className="text-sm text-primary hover:underline">Ver Perfil</Link>
               </li>
             ))}
           </ul>
         </div>

         <div className="card">
           <h2 className="text-lg font-semibold mb-4">Pagamentos Pendentes/Atrasados</h2>
            {/* Lista de pagamentos pendentes/atrasados */}
            <ul className="divide-y divide-gray-200">
             {clients.filter(c => c.payments.some(p => p.status === 'pendente' || p.status === 'atrasado')).slice(0, 5).map(client => {
               const pendingPayment = client.payments.find(p => p.status === 'pendente' || p.status === 'atrasado');
               if (!pendingPayment) return null; // Should not happen based on filter

               return (
                 <li key={client.id} className="py-3 flex items-center justify-between">
                   <div>
                     <p className="text-sm font-medium text-gray-900">{client.name}</p>
                     <p className={`text-xs ${pendingPayment.status === 'atrasado' ? 'text-red-600' : 'text-yellow-600'}`}>
                       {pendingPayment.status === 'atrasado' ? 'Atrasado' : 'Pendente'} - R$ {pendingPayment.amount.toFixed(2)}
                     </p>
                   </div>
                   <Link to="/finances" className="text-sm text-primary hover:underline">Ver Finanças</Link>
                 </li>
               );
             })}
              {clients.filter(c => c.payments.some(p => p.status === 'pendente' || p.status === 'atrasado')).length === 0 && (
                <li className="py-3 text-center text-sm text-gray-500">Nenhum pagamento pendente ou atrasado.</li>
              )}
           </ul>
         </div>
       </div>

    </div>
  );
};

export default Dashboard;
