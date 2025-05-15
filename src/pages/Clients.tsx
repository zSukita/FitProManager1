import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Filter, ChevronDown, MoreHorizontal, Mail, Phone, CalendarClock, CircleDollarSign } from 'lucide-react';
import { Client } from '../types';
import { fetchClients, getCurrentUser } from '../services/supabaseService'; // Import Supabase service
import toast from 'react-hot-toast';

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('nome');
  const [clients, setClients] = useState<Client[]>([]); // Use state for clients
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await getCurrentUser();
        if (user) {
          const data = await fetchClients(user.id);
          setClients(data);
        } else {
          // Handle case where user is not logged in, maybe redirect to login
          toast.error('Usuário não autenticado.');
          setClients([]); // Clear clients if not authenticated
        }
      } catch (err) {
        console.error('Failed to fetch clients:', err);
        setError('Erro ao carregar clientes.');
        toast.error('Erro ao carregar clientes.');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []); // Empty dependency array means this runs once on mount

  // Filtrar clientes
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false); // Handle potential null email
    const matchesStatus = filterStatus === 'todos' || client.status === filterStatus;
    // Note: Goal filter removed as it wasn't fully implemented and might not be needed based on UI
    return matchesSearch && matchesStatus;
  });

  // Ordenar clientes
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === 'nome') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'data') {
      // Assuming startDate is a valid date string or Date object
      const dateA = new Date(a.start_date || a.created_at).getTime(); // Use created_at as fallback
      const dateB = new Date(b.start_date || b.created_at).getTime();
      return dateB - dateA; // Newest first
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // Status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Ativo</span>;
      case 'inativo':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inativo</span>;
      case 'pendente':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pendente</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Carregando clientes...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes e veja o histórico completo</p>
        </div>
        <Link to="/clients/new" className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <UserPlus size={18} />
          Novo Cliente
        </Link>
      </div>

      {/* Filtros e busca */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="todos">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="pendente">Pendentes</option>
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
              <option value="nome">Ordenar por Nome</option>
              <option value="data">Ordenar por Data</option>
              <option value="status">Ordenar por Status</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      {sortedClients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Nenhum cliente encontrado com os filtros aplicados.</p>
          <button
            className="mt-2 text-primary hover:underline"
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('todos');
              // setFilterGoal('todos'); // Goal filter removed
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedClients.map((client: Client) => (
            <Link
              to={`/clients/${client.id}`}
              key={client.id}
              className="client-card bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
              <div className="px-6 pt-0 pb-6 -mt-12">
                <div className="flex justify-between">
                  <img
                    src={client.avatar_url || 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                    alt={client.name}
                    className="w-20 h-20 rounded-full border-4 border-white object-cover"
                  />
                  <div className="mt-12 flex">
                    {getStatusBadge(client.status)}
                    <button className="ml-2 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-lg font-semibold">{client.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{client.goal}</p>
                </div>

                <div className="mt-4 space-y-2">
                  {client.email && ( // Only show email if it exists
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && ( // Only show phone if it exists
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarClock size={16} className="mr-2 text-gray-400" />
                    <span>Cliente desde {new Date(client.start_date || client.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {/* Payment info will be fetched separately or joined if needed */}
                  {/* client.payments && client.payments.length > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CircleDollarSign size={16} className="mr-2 text-gray-400" />
                      <span>Último pagamento: {
                        client.payments[client.payments.length - 1].date
                          ? new Date(client.payments[client.payments.length - 1].date).toLocaleDateString('pt-BR')
                          : 'Pendente'
                      }</span>
                    </div>
                  )*/}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;
