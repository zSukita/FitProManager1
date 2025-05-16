import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter, ChevronDown, MoreHorizontal, CalendarDays, DollarSign } from 'lucide-react';
import { Payment } from '../types';
import { fetchPayments, getCurrentUser } from '../services/supabaseService'; // Import Supabase service
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const Finances: React.FC = () => {
  const { user } = useAuth(); // Get user from AuthContext
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('data');
  const [payments, setPayments] = useState<Payment[]>([]); // Use state for payments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
       if (!user?.id) { // Check if user and user.id exist
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // fetchPayments now returns payments with client_name
        const data = await fetchPayments(user.id);
        // Sort by date descending by default
        const sortedData = data.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
        setPayments(sortedData);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
        setError('Erro ao carregar pagamentos.');
        toast.error('Erro ao carregar pagamentos.');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [user?.id]); // Add user.id to dependency array

  // Filtrar pagamentos
  const filteredPayments = payments.filter(payment => {
    // Search by client name, payment method, or notes
    const matchesSearch = payment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'todos' || payment.method === filterMethod;

    return matchesSearch && matchesMethod;
  });

  // Ordenar pagamentos
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    const dateA = new Date(a.payment_date).getTime();
    const dateB = new Date(b.payment_date).getTime();

    if (sortBy === 'data') {
      return dateB - dateA; // Newest first
    } else if (sortBy === 'valor') {
      return parseFloat(b.amount as any) - parseFloat(a.amount as any); // Assuming amount is numeric or can be parsed
    }
    return 0;
  });

  if (loading) {
    return <div className="text-center text-gray-500">Carregando pagamentos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }


  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Finanças</h1>
          <p className="text-gray-600">Gerencie pagamentos e veja o histórico financeiro</p>
        </div>
        <Link to="/dashboard/finances/new" className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <PlusCircle size={18} />
          Novo Pagamento
        </Link>
      </div>

      {/* Filtros e busca */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-1 md:col-span-1"> {/* Adjusted col-span */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por cliente, método ou notas..." // Updated placeholder
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
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
            >
              <option value="todos">Todos os métodos</option>
              <option value="Pix">Pix</option>
              <option value="Cartão">Cartão</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Transferência">Transferência</option>
              {/* Add other methods as needed */}
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
              <option value="data">Ordenar por Data</option>
              <option value="valor">Ordenar por Valor</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de pagamentos */}
      {sortedPayments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Nenhum pagamento encontrado com os filtros aplicados.</p>
          <button
            className="mt-2 text-primary hover:underline"
            onClick={() => {
              setSearchTerm('');
              setFilterMethod('todos');
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notas
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPayments.map((payment) => (
                <tr key={payment.id}>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {/* Display client_name fetched from the join */}
                    {payment.client_name || 'Cliente Desconhecido'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(payment.amount as any))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.payment_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.method || '-'}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                    {payment.notes || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary hover:text-primary-dark">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Finances;
