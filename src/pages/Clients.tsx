import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, User, Dumbbell, CalendarDays, DollarSign, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchClients, deleteClient } from '../services/supabaseService';
import { Client } from '../types';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from AuthContext
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  useEffect(() => {
    const loadClients = async () => {
      if (!user?.id) { // Check if user and user.id exist
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedClients = await fetchClients(user.id); // Pass user.id
        setClients(fetchedClients);
      } catch (err) {
        console.error('Error loading clients:', err);
        setError('Erro ao carregar a lista de clientes.');
        toast.error('Erro ao carregar clientes.');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [user?.id]); // Add user.id to dependency array

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      try {
        await deleteClient(clientId);
        setClients(clients.filter(client => client.id !== clientId));
        toast.success('Cliente excluído com sucesso!');
      } catch (error) {
        console.error('Error deleting client:', error);
        toast.error('Erro ao excluir cliente.');
      }
    }
  };


  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (client.phone && client.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'todos' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-600">Gerencie seus alunos</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/clients/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Cliente
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
           <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            className="input-field pl-10"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="pendente">Pendente</option>
          </select>
        </div>
      </div>


      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando clientes...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhum cliente encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map(client => (
              <div
                key={client.id}
                className="client-card border border-gray-200 rounded-lg p-4 flex items-center space-x-4 cursor-pointer"
                onClick={() => navigate(`/dashboard/clients/${client.id}`)}
              >
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={client.avatar_url || 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                    alt={client.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{client.name}</p>
                  <p className="text-sm text-gray-500 truncate">{client.email || 'Sem email'}</p>
                  <p className="text-xs text-gray-500">{client.phone || 'Sem telefone'}</p>
                </div>
                 <div className="flex-shrink-0 flex flex-col items-end space-y-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      client.status === 'ativo' ? 'bg-green-100 text-green-800' :
                      client.status === 'inativo' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                     {/* Botão de exclusão - Adicionado para funcionalidade básica */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleDeleteClient(client.id);
                      }}
                      className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Excluir cliente"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
