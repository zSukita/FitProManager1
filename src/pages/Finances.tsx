import React, { useState } from 'react';
import { clients, financialSummary, last6Months } from '../data/mockData';
import { Payment } from '../types';
import {
  BarChart3,
  Plus,
  Search,
  Filter,
  ChevronDown,
  CalendarDays,
  BellRing,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const Finances: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [filter, setFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('data-desc');

  // Obter pagamentos de todos os clientes
  const allPayments = clients.flatMap(client =>
    (client.payments || []).map(payment => ({
      ...payment,
      clientName: client.name,
      clientAvatar: client.avatar
    }))
  );

  // Filtrar pagamentos
  const filteredPayments = allPayments.filter(payment => {
    const matchesStatus = filter === 'todos' || payment.status === filter;
    const matchesSearch = payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (payment.description && payment.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Ordenar pagamentos
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortBy === 'data-asc') {
      return new Date(a.date || a.dueDate || '').getTime() - new Date(b.date || b.dueDate || '').getTime();
    } else if (sortBy === 'data-desc') {
      return new Date(b.date || b.dueDate || '').getTime() - new Date(a.date || a.dueDate || '').getTime();
    } else if (sortBy === 'valor-asc') {
      return a.amount - b.amount;
    } else if (sortBy === 'valor-desc') {
      return b.amount - a.amount;
    }
    return 0;
  });

  // Dias vencidos
  const getDaysOverdue = (dueDate: string | undefined): number => {
    if (!dueDate) return 0;
    const today = dayjs();
    const due = dayjs(dueDate);
    return today.diff(due, 'day');
  };

  // Status badges
  const getStatusBadge = (status: string, dueDate?: string) => {
    const daysOverdue = dueDate ? getDaysOverdue(dueDate) : 0;

    switch (status) {
      case 'pago':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pago</span>;
      case 'pendente':
        return daysOverdue > 0
          ? <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Atrasado ({daysOverdue} dias)</span>
          : <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pendente</span>;
      case 'atrasado':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Atrasado</span>;
      case 'cancelado':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Cancelado</span>;
      default:
        return null;
    }
  };

  // Método de pagamento
  const getPaymentMethodIcon = (method: string | undefined) => {
    switch (method) {
      case 'dinheiro':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">Dinheiro</span>;
      case 'cartão':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">Cartão</span>;
      case 'pix':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-50 text-purple-700">PIX</span>;
      case 'transferência':
        return <span className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">Transferência</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-50 text-gray-700">Outro</span>;
    }
  };

  // Dados do gráfico de receita mensal
  const revenueChartData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Receita Mensal (R$)',
        data: financialSummary.monthlyRevenue,
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderRadius: 6,
      },
    ],
  };

  const markAsPaid = (id: string) => {
    toast.success('Pagamento registrado com sucesso!');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Finanças</h1>
          <p className="text-gray-600">Gerencie pagamentos e acompanhe sua receita</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
          onClick={() => navigate('/finances/new')} // Navigate to the new payment page
        >
          <Plus size={18} />
          Novo Pagamento
        </button>
      </div>

      {/* Resumo financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card hover:border-primary hover:border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Receita Total</h3>
              <p className="text-2xl font-bold">R$ {financialSummary.totalRevenue.toLocaleString('pt-BR')}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-600 text-sm">
            <ArrowUp size={16} className="mr-1" />
            <span>12% em relação ao mês anterior</span>
          </div>
        </div>

        <div className="card hover:border-accent hover:border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-orange-100">
              <Wallet className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Receita Pendente</h3>
              <p className="text-2xl font-bold">R$ {financialSummary.pendingRevenue.toLocaleString('pt-BR')}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-orange-600 text-sm">
            <ArrowDown size={16} className="mr-1" />
            <span>5% em relação ao mês anterior</span>
          </div>
        </div>

        <div className="card hover:border-blue-500 hover:border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <CalendarDays className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Pagamentos Hoje</h3>
              <p className="text-2xl font-bold">R$ {financialSummary.paidToday.toLocaleString('pt-BR')}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-gray-600 text-sm">
            <BellRing size={16} className="mr-1" />
            <span>0 pagamentos realizados hoje</span>
          </div>
        </div>

        <div className="card hover:border-purple-500 hover:border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Média Mensal</h3>
              <p className="text-2xl font-bold">
                R$ {(financialSummary.monthlyRevenue.reduce((a, b) => a + b, 0) / 6).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-600 text-sm">
            <ArrowUp size={16} className="mr-1" />
            <span>8% em relação ao período anterior</span>
          </div>
        </div>
      </div>

      {/* Gráfico de receita */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Receita Mensal
          </h3>
        </div>
        <div className="h-64">
          <Bar
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

      {/* Lista de pagamentos */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-800 mb-4">Lista de Pagamentos</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por cliente ou descrição..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm w-full appearance-none cursor-pointer"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="todos">Todos os status</option>
                <option value="pago">Pagos</option>
                <option value="pendente">Pendentes</option>
                <option value="atrasado">Atrasados</option>
                <option value="cancelado">Cancelados</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm w-full appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="data-desc">Data (mais recente)</option>
                <option value="data-asc">Data (mais antiga)</option>
                <option value="valor-desc">Valor (maior)</option>
                <option value="valor-asc">Valor (menor)</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    Nenhum pagamento encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                sortedPayments.map((payment: Payment & { clientName: string, clientAvatar?: string }) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={payment.clientAvatar || 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                            alt={payment.clientName}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{payment.clientName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.description}</div>
                      {payment.recurrent && (
                        <div className="text-xs text-gray-500">Recorrente</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">R$ {payment.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.date ? dayjs(payment.date).format('DD/MM/YYYY') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.dueDate ? dayjs(payment.dueDate).format('DD/MM/YYYY') : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentMethodIcon(payment.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status, payment.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {payment.status === 'pendente' && (
                        <button
                          onClick={() => markAsPaid(payment.id)}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          Registrar pagamento
                        </button>
                      )}
                      {payment.status !== 'pendente' && (
                        <button className="text-gray-500 hover:text-gray-700 font-medium">
                          Detalhes
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finances;
